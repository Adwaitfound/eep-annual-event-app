#!/usr/bin/env node
import { createHash } from 'crypto'
import admin from 'firebase-admin'

const log = (...args) => console.log('[sync]', ...args)
const error = (...args) => console.error('[sync]', ...args)

const requiredEnv = ['FIREBASE_SERVICE_ACCOUNT', 'FIREBASE_PROJECT_ID', 'SCHEDULE_CSV_URL', 'SPEAKERS_CSV_URL']
const missing = requiredEnv.filter((key) => !process.env[key])
if (missing.length) {
  error(`Missing required env vars: ${missing.join(', ')}`)
  process.exit(1)
}

const serviceAccount = (() => {
  try {
    const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('utf8')
    return JSON.parse(decoded)
  } catch (err) {
    error('Failed to parse FIREBASE_SERVICE_ACCOUNT (expected base64-encoded JSON)')
    process.exit(1)
  }
})()

const projectId = process.env.FIREBASE_PROJECT_ID
const scheduleCsvUrl = process.env.SCHEDULE_CSV_URL
const speakersCsvUrl = process.env.SPEAKERS_CSV_URL

if (!global.fetch) {
  error('fetch is not available in this Node runtime')
  process.exit(1)
}

admin.initializeApp({
  credential: admin.credential.cert({ ...serviceAccount, projectId }),
  projectId,
})

const db = admin.firestore()

const parseCsv = (text) => {
  const rows = []
  let i = 0
  const len = text.length
  const current = []
  let field = ''
  let inQuotes = false

  const pushField = () => {
    current.push(field)
    field = ''
  }

  const pushRow = () => {
    if (current.length > 0) rows.push([...current])
    current.length = 0
  }

  while (i < len) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i += 2
          continue
        } else {
          inQuotes = false
          i += 1
          continue
        }
      }
      field += ch
      i += 1
    } else {
      if (ch === '"') {
        inQuotes = true
        i += 1
      } else if (ch === ',') {
        pushField()
        i += 1
      } else if (ch === '\n') {
        pushField()
        pushRow()
        i += 1
      } else if (ch === '\r') {
        i += 1
      } else {
        field += ch
        i += 1
      }
    }
  }
  if (inQuotes) {
    throw new Error('Unterminated quote in CSV')
  }
  // push last field/row
  pushField()
  pushRow()

  if (!rows.length) return []
  const headers = rows[0].map((h) => h.trim())
  return rows.slice(1).filter((r) => r.some((v) => v.trim() !== '')).map((r) => {
    const obj = {}
    headers.forEach((h, idx) => {
      obj[h] = r[idx] ?? ''
    })
    return obj
  })
}

const toArray = (value) => {
  if (!value) return []
  return String(value)
    .split(/[,;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

const numberOrNull = (value) => {
  if (value === undefined || value === null) return null
  const trimmed = String(value).trim()
  if (trimmed === '') return null
  const n = Number(trimmed)
  return Number.isFinite(n) ? n : null
}

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const sessionIdFromRow = (row) => {
  const base = `${row.title || ''}-${row.date || ''}-${row.startTime || ''}-${row.location || ''}`
  const slug = slugify(base)
  if (slug) return slug
  return createHash('sha1').update(base).digest('hex').slice(0, 16)
}

const fetchCsv = async (url, label) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${label} fetch failed: ${res.status} ${res.statusText}`)
  return await res.text()
}

const upsertSessions = async (rows) => {
  const collection = db.collection('sessions')
  const keepIds = new Set()
  for (const row of rows) {
    const id = sessionIdFromRow(row)
    keepIds.add(id)
    const speakers = toArray(row.speakers)
    const doc = {
      title: row.title || '',
      description: row.description || '',
      date: row.date || '',
      startTime: row.startTime || '',
      endTime: row.endTime || '',
      location: row.location || '',
      track: row.track || 'default',
      speakers,
      capacity: numberOrNull(row.capacity),
      duration: numberOrNull(row.duration),
      category: row.category || 'Conference',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }
    await collection.doc(id).set(doc, { merge: true })
  }

  const existing = await collection.listDocuments()
  const deletions = existing.filter((doc) => !keepIds.has(doc.id))
  if (deletions.length) {
    log(`Removing ${deletions.length} stale session(s)`) 
    await Promise.all(deletions.map((doc) => doc.delete()))
  }
}

const upsertSpeakers = async (rows) => {
  const collection = db.collection('speakers')
  const keepIds = new Set()
  for (const row of rows) {
    const id = row.id?.trim()
    if (!id) continue
    keepIds.add(id)
    const doc = {
      id,
      name: row.name || '',
      bio: row.bio || '',
      linkedin: row.linkedin || '',
      image: row.image || '',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }
    await collection.doc(id).set(doc, { merge: true })
  }

  const existing = await collection.listDocuments()
  const deletions = existing.filter((doc) => !keepIds.has(doc.id))
  if (deletions.length) {
    log(`Removing ${deletions.length} stale speaker(s)`) 
    await Promise.all(deletions.map((doc) => doc.delete()))
  }
}

const main = async () => {
  try {
    log('Fetching CSVs...')
    const [scheduleCsv, speakersCsv] = await Promise.all([
      fetchCsv(scheduleCsvUrl, 'schedule'),
      fetchCsv(speakersCsvUrl, 'speakers'),
    ])

    log('Parsing CSVs...')
    const scheduleRows = parseCsv(scheduleCsv)
    const speakerRows = parseCsv(speakersCsv)

    log(`Parsed ${scheduleRows.length} sessions, ${speakerRows.length} speakers`)

    log('Upserting sessions...')
    await upsertSessions(scheduleRows)

    log('Upserting speakers...')
    await upsertSpeakers(speakerRows)

    log('Sync complete ✅')
    process.exit(0)
  } catch (err) {
    error('Sync failed:', err.message)
    process.exit(1)
  }
}

main()
