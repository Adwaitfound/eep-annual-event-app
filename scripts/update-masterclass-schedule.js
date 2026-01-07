// Update masterclass sessions to show separate concurrent tracks
import admin from 'firebase-admin'
import path from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load service account
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json')
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

// Masterclass sessions - separate tracks for Laurie and Mark
const masterclassSessions = [
  // BENGALURU - JAN 24-25, 2026
  {
    id: 'laurie-blr-morning',
    title: 'Creating a Sense of Community with Intention',
    description: 'Morning Masterclass with Laurie Frank',
    date: '2026-01-24',
    startTime: '10:00',
    endTime: '13:00',
    location: 'Bengaluru - Room A',
    track: 'Masterclass',
    speakers: ['Laurie Frank'],
    capacity: 50,
    duration: 180,
    category: 'Masterclass'
  },
  {
    id: 'mark-blr-morning',
    title: 'Remarkable Program Design',
    description: 'Morning Masterclass with Mark Collard',
    date: '2026-01-24',
    startTime: '10:00',
    endTime: '13:00',
    location: 'Bengaluru - Room B',
    track: 'Masterclass',
    speakers: ['Mark Collard'],
    capacity: 50,
    duration: 180,
    category: 'Masterclass'
  },
  {
    id: 'laurie-blr-afternoon',
    title: 'Thinking Experientially',
    description: 'Afternoon Masterclass with Laurie Frank',
    date: '2026-01-24',
    startTime: '14:00',
    endTime: '17:00',
    location: 'Bengaluru - Room A',
    track: 'Masterclass',
    speakers: ['Laurie Frank'],
    capacity: 50,
    duration: 180,
    category: 'Masterclass'
  },
  {
    id: 'mark-blr-afternoon',
    title: 'Critical Facilitation Skills',
    description: 'Afternoon Masterclass with Mark Collard',
    date: '2026-01-24',
    startTime: '14:00',
    endTime: '17:00',
    location: 'Bengaluru - Room B',
    track: 'Masterclass',
    speakers: ['Mark Collard'],
    capacity: 50,
    duration: 180,
    category: 'Masterclass'
  },
  {
    id: 'laurie-blr-day2-morning',
    title: 'Creating a Sense of Community with Intention',
    description: 'Day 2 Morning Masterclass with Laurie Frank',
    date: '2026-01-25',
    startTime: '10:00',
    endTime: '13:00',
    location: 'Bengaluru - Room A',
    track: 'Masterclass',
    speakers: ['Laurie Frank'],
    capacity: 50,
    duration: 180,
    category: 'Masterclass'
  },
  {
    id: 'mark-blr-day2-morning',
    title: 'Remarkable Program Design',
    description: 'Day 2 Morning Masterclass with Mark Collard',
    date: '2026-01-25',
    startTime: '10:00',
    endTime: '13:00',
    location: 'Bengaluru - Room B',
    track: 'Masterclass',
    speakers: ['Mark Collard'],
    capacity: 50,
    duration: 180,
    category: 'Masterclass'
  },
  {
    id: 'laurie-blr-day2-afternoon',
    title: 'Thinking Experientially',
    description: 'Day 2 Afternoon Masterclass with Laurie Frank',
    date: '2026-01-25',
    startTime: '14:00',
    endTime: '17:00',
    location: 'Bengaluru - Room A',
    track: 'Masterclass',
    speakers: ['Laurie Frank'],
    capacity: 50,
    duration: 180,
    category: 'Masterclass'
  },
  {
    id: 'mark-blr-day2-afternoon',
    title: 'Critical Facilitation Skills',
    description: 'Day 2 Afternoon Masterclass with Mark Collard',
    date: '2026-01-25',
    startTime: '14:00',
    endTime: '17:00',
    location: 'Bengaluru - Room B',
    track: 'Masterclass',
    speakers: ['Mark Collard'],
    capacity: 50,
    duration: 180,
    category: 'Masterclass'
  },

  // PUNE - JAN 29-30, 2026
  {
    id: 'laurie-pune-morning',
    title: 'Creating a Sense of Community with Intention',
    description: 'Morning Masterclass with Laurie Frank',
    date: '2026-01-29',
    startTime: '10:00',
    endTime: '13:00',
    location: 'Pune - Room A',
    track: 'Masterclass',
    speakers: ['Laurie Frank'],
    capacity: 50,
    duration: 180,
    category: 'Masterclass'
  },
  {
    id: 'mark-pune-morning',
    title: 'Remarkable Program Design',
    description: 'Morning Masterclass with Mark Collard',
    date: '2026-01-29',
    startTime: '10:00',
    endTime: '13:00',
    location: 'Pune - Room B',
    track: 'Masterclass',
    speakers: ['Mark Collard'],
    capacity: 50,
    duration: 180,
    category: 'Masterclass'
  },
  {
    id: 'laurie-pune-afternoon',
    title: 'Thinking Experientially',
    description: 'Afternoon Masterclass with Laurie Frank',
    date: '2026-01-29',
    startTime: '14:00',
    endTime: '17:00',
    location: 'Pune - Room A',
    track: 'Masterclass',
    speakers: ['Laurie Frank'],
    capacity: 50,
    duration: 180,
    category: 'Masterclass'
  },
  {
    id: 'mark-pune-afternoon',
    title: 'Critical Facilitation Skills',
    description: 'Afternoon Masterclass with Mark Collard',
    date: '2026-01-29',
    startTime: '14:00',
    endTime: '17:00',
    location: 'Pune - Room B',
    track: 'Masterclass',
    speakers: ['Mark Collard'],
    capacity: 50,
    duration: 180,
    category: 'Masterclass'
  },
  {
    id: 'laurie-pune-day2-morning',
    title: 'Creating a Sense of Community with Intention',
    description: 'Day 2 Morning Masterclass with Laurie Frank',
    date: '2026-01-30',
    startTime: '10:00',
    endTime: '13:00',
    location: 'Pune - Room A',
    track: 'Masterclass',
    speakers: ['Laurie Frank'],
    capacity: 50,
    duration: 180,
    category: 'Masterclass'
  },
  {
    id: 'mark-pune-day2-morning',
    title: 'Remarkable Program Design',
    description: 'Day 2 Morning Masterclass with Mark Collard',
    date: '2026-01-30',
    startTime: '10:00',
    endTime: '13:00',
    location: 'Pune - Room B',
    track: 'Masterclass',
    speakers: ['Mark Collard'],
    capacity: 50,
    duration: 180,
    category: 'Masterclass'
  },
  {
    id: 'laurie-pune-day2-afternoon',
    title: 'Thinking Experientially',
    description: 'Day 2 Afternoon Masterclass with Laurie Frank',
    date: '2026-01-30',
    startTime: '14:00',
    endTime: '17:00',
    location: 'Pune - Room A',
    track: 'Masterclass',
    speakers: ['Laurie Frank'],
    capacity: 50,
    duration: 180,
    category: 'Masterclass'
  },
  {
    id: 'mark-pune-day2-afternoon',
    title: 'Critical Facilitation Skills',
    description: 'Day 2 Afternoon Masterclass with Mark Collard',
    date: '2026-01-30',
    startTime: '14:00',
    endTime: '17:00',
    location: 'Pune - Room B',
    track: 'Masterclass',
    speakers: ['Mark Collard'],
    capacity: 50,
    duration: 180,
    category: 'Masterclass'
  }
]

async function updateMasterclassSessions() {
  console.log('Starting masterclass schedule update...')
  
  try {
    const batch = db.batch()
    
    for (const session of masterclassSessions) {
      const docRef = db.collection('sessions').doc(session.id)
      batch.set(docRef, session, { merge: true })
      console.log(`✓ Queued: ${session.title} (${session.location})`)
    }
    
    await batch.commit()
    console.log(`\n✅ Successfully updated ${masterclassSessions.length} masterclass sessions!`)
    console.log('Sessions are now split into separate concurrent tracks for Laurie and Mark.')
    
  } catch (error) {
    console.error('Error updating sessions:', error)
  } finally {
    process.exit()
  }
}

updateMasterclassSessions()
