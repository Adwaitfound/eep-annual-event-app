// Seed speakers into Firestore using firebase-admin.
// Usage: node scripts/seed-speakers-new.js
// Requires serviceAccountKey.json at project root and firebase-admin installed.

import admin from 'firebase-admin'
import path from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'
import { speakers } from './data/speakers-from-csv.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json')
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

async function seedSpeakers() {
  const batch = db.batch()

  speakers.forEach((speaker) => {
    const docRef = db.collection('speakers').doc(speaker.id)
    batch.set(docRef, speaker)
  })

  await batch.commit()
  console.log(`Seeded ${speakers.length} speakers`)
}

seedSpeakers().catch((err) => {
  console.error('Failed to seed speakers:', err)
  process.exit(1)
})
