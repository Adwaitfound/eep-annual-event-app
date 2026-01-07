// Update schedule from new CSV data
// Usage: node scripts/update-schedule-new-csv.js

import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const csvPath = path.join(__dirname, 'data', 'final-speakers.csv')

// Basic text cleanup to keep output ASCII-friendly
function cleanText(text = '') {
  return text
    .replace(/\uFEFF/g, '') // BOM
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014\u2015]/g, '-')
    .replace(/\uFFFD/g, '')
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Parse CSV with support for quoted, multi-line fields
function parseCSV(filePath) {
  const content = readFileSync(filePath, 'utf8')
  const rows = []
  let row = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < content.length; i++) {
    const char = content[i]
    const next = content[i + 1]

    if (char === '"') {
      if (next === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      row.push(current)
      current = ''
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') {
        // skip the \n of CRLF
        i++
      }
      row.push(current)
      if (row.length > 1 || row[0].trim() !== '') {
        rows.push(row)
      }
      row = []
      current = ''
    } else {
      current += char
    }
  }

  // push last row if any
  if (current.length || row.length) {
    row.push(current)
    rows.push(row)
  }

  const headers = rows[0].map((h) => cleanText(h))
  const dataRows = rows.slice(1)

  return dataRows
    .map((cols) => {
      const obj = {}
      headers.forEach((h, idx) => {
        obj[h] = cleanText(cols[idx] || '')
      })
      return obj
    })
    .filter((row) => row['Name of Presenter'])
}

// Convert time format from decimal (10.45) to HH:MM (10:45)
function convertTime(timeStr) {
  if (!timeStr) return ''
  const raw = timeStr.replace(/[^0-9.:]/g, '')
  if (!raw) return ''

  // Already HH:MM
  if (raw.includes(':')) {
    const [h, m = '00'] = raw.split(':')
    const hh = h.padStart(2, '0')
    const mm = m.padEnd(2, '0').slice(0, 2)
    return `${hh}:${mm}`
  }

  // Decimal-like 9.3 => 09:30, 10.45 => 10:45
  const [hours, mins] = raw.split('.')
  const hh = (hours || '0').padStart(2, '0')
  const mm = mins ? mins.padEnd(2, '0').slice(0, 2) : '00'
  return `${hh}:${mm}`
}

// Convert date format
function convertDate(dateStr) {
  if (!dateStr) return ''
  const clean = dateStr.replace(/,/g, '').trim()
  const match = clean.match(/(\d{1,2})(?:st|nd|rd|th)?\s*-?\s*([A-Za-z]{3})/i)
  if (!match) return ''

  const day = match[1].padStart(2, '0')
  const monthKey = match[2].slice(0, 3).toLowerCase()
  const monthMap = {
    jan: '01',
    feb: '02',
    mar: '03',
    apr: '04',
    may: '05',
    jun: '06',
    jul: '07',
    aug: '08',
    sep: '09',
    oct: '10',
    nov: '11',
    dec: '12',
  }
  const month = monthMap[monthKey] || '01'
  return `2026-${month}-${day}`
}

// Map area of focus to track category
function mapTrack(areaOfFocus) {
  const trackMap = {
    'Experienced Based Training and Development': 'Experience Based T&D',
    'K-12 Classroom Education': 'K-12',
    'Nature Based Practices': 'Nature Based Practices',
    'Inclusive Practices in Civil Society or Not for Profit': 'Inclusive Practices',
  }
  return trackMap[areaOfFocus] || 'Workshop'
}

// Calculate duration in minutes
function calculateDuration(startTime, endTime) {
  if (!startTime || !endTime) return null
  const [startH, startM] = startTime.split(':').map(Number)
  const [endH, endM] = endTime.split(':').map(Number)
  let diff = (endH * 60 + endM) - (startH * 60 + startM)
  if (diff < 0) {
    // Assume sessions do not span midnight; bump by 12 hours if end appears earlier.
    diff += 12 * 60
  }
  return diff
}

function slugify(text) {
  return cleanText(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Generate schedule entries from CSV
function generateScheduleAndSpeakers(csvPath) {
  const sessions = parseCSV(csvPath)
  const scheduleEntries = []
  const speakerMap = new Map()

  sessions.forEach((session) => {
    const startTime = convertTime(session['Start Time'])
    const endTime = convertTime(session['End Time'])
    const date = convertDate(session['Date'])
    const duration = calculateDuration(startTime, endTime)
    const track = mapTrack(session['Area of Focus'])

    const title = session['Workshop  Title'] || session['Workshop Title'] || ''
    const description = session['Workshop Description:'] || session['Workshop Description'] || ''
    const bio = session['Biographical Sketch of the Presenter'] || session['Biographical Sketch of the Presenter '] || ''
    const linkedin = (session['Linkedin'] || '').replace(/�/g, '').trim()
    const name = session['Name of Presenter']

    const entry = {
      title: cleanText(title),
      description: cleanText(description),
      date: date,
      startTime: startTime,
      endTime: endTime,
      location: date.endsWith('-01-31') ? 'Bengaluru' : 'Pune',
      track,
      speakers: [name],
      capacity: 80,
      duration: duration ?? 0,
      category: 'Conference',
    }

    scheduleEntries.push(entry)

    if (!speakerMap.has(name)) {
      speakerMap.set(name, {
        id: slugify(name),
        name,
        title: '',
        bio: cleanText(bio),
        sessionTitle: cleanText(title),
        track,
        linkedin,
      })
    }
  })

  scheduleEntries.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date)
    return a.startTime.localeCompare(b.startTime)
  })

  return { scheduleEntries, speakers: Array.from(speakerMap.values()) }
}

// Main execution
const { scheduleEntries, speakers } = generateScheduleAndSpeakers(csvPath)

// Write schedule-data.js
const scheduleOutPath = path.join(__dirname, '..', 'schedule-data.js')
const scheduleJs = `// Generated from scripts/data/final-speakers.csv\nconst scheduleData = ${JSON.stringify(scheduleEntries, null, 2)};\n\nexport default scheduleData;\n`
writeFileSync(scheduleOutPath, scheduleJs)
console.log(`✓ Wrote ${scheduleEntries.length} sessions to ${scheduleOutPath}`)

// Write speakers data for seeding
const speakersOutPath = path.join(__dirname, 'data', 'speakers-from-csv.js')
const speakersJs = `// Generated from scripts/data/final-speakers.csv\nexport const speakers = ${JSON.stringify(speakers, null, 2)};\n`
writeFileSync(speakersOutPath, speakersJs)
console.log(`✓ Wrote ${speakers.length} speakers to ${speakersOutPath}`)
