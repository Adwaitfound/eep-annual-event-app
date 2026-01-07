// Update masterclass schedule from CSV - simplified version
import admin from 'firebase-admin'
import path from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load service account
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json')
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

// Parse CSV file
function parseCSV(filePath) {
  const content = readFileSync(filePath, 'utf8')
  const lines = content.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim())
  
  const data = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line || line === '%') continue
    
    const values = line.split(',').map(v => v.trim())
    const row = {}
    headers.forEach((header, idx) => {
      row[header] = values[idx] || ''
    })
    
    if (row['Name of Speaker']) {
      data.push(row)
    }
  }
  return data
}

// Convert time format (10am -> 10:00, 5pm -> 17:00)
function parseTime(timeStr) {
  const match = timeStr.toLowerCase().match(/(\d+)(am|pm)/)
  if (!match) return timeStr
  
  let hour = parseInt(match[1])
  const isPM = match[2] === 'pm'
  
  if (isPM && hour !== 12) hour += 12
  if (!isPM && hour === 12) hour = 0
  
  return `${String(hour).padStart(2, '0')}:00`
}

// Convert date format (24/01/26 -> 2026-01-24)
function parseDate(dateStr) {
  const [day, month, year] = dateStr.split('/')
  return `20${year}-${month}-${day}`
}

(async () => {
  try {
    const csvPath = path.join(__dirname, 'Book1.csv')
    const sessions = parseCSV(csvPath)
    
    console.log(`Parsed ${sessions.length} sessions from CSV`)
    
    // First, delete all existing masterclass sessions
    const snapshot = await db.collection('sessions')
      .where('category', '==', 'Masterclass')
      .get()
    
    const deletePromises = []
    snapshot.docs.forEach(doc => {
      deletePromises.push(doc.ref.delete())
    })
    
    if (deletePromises.length > 0) {
      await Promise.all(deletePromises)
      console.log(`Deleted ${snapshot.size} existing masterclass sessions`)
    }
    
    // Create new sessions
    const writePromises = []
    const sessionIds = new Set()
    let idCounter = 1
    
    sessions.forEach((row) => {
      const speaker = row['Name of Speaker']
      const date = parseDate(row['Date'])
      const startTime = parseTime(row['Start Time'])
      const endTime = parseTime(row['End Time'])
      const sessionName = row['Session Name']
      const location = row['Location']
      
      // Create unique session ID
      let sessionId = `masterclass-${speaker.toLowerCase().replace(/\s+/g, '-')}-${location.toLowerCase()}-${date}`
      
      // Ensure unique ID
      if (sessionIds.has(sessionId)) {
        sessionId = `${sessionId}-${idCounter}`
        idCounter++
      }
      sessionIds.add(sessionId)
      
      const session = {
        id: sessionId,
        title: sessionName,
        description: `Masterclass with ${speaker}`,
        date,
        startTime,
        endTime,
        location: `${location}`,
        track: 'Masterclass',
        speakers: [speaker],
        capacity: 50,
        duration: 420, // 7 hours: 10am to 5pm
        category: 'Masterclass',
        city: location,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }
      
      const docRef = db.collection('sessions').doc(sessionId)
      writePromises.push(docRef.set(session))
      
      console.log(`Queuing: ${sessionName} with ${speaker} in ${location} on ${date}`)
    })
    
    await Promise.all(writePromises)
    console.log(`✅ Successfully updated ${sessions.length} masterclass sessions`)
    
    process.exit(0)
    
  } catch (error) {
    console.error('Error updating schedule:', error)
    process.exit(1)
  }
})()

