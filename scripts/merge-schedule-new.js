// Parse the new 31st/1st CSV and merge with existing masterclass data
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Helper to convert time strings to 24h format
function convertTime(timeStr) {
  if (!timeStr) return '00:00'
  const lower = timeStr.toLowerCase().trim()
  const match = lower.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/)
  if (!match) return '00:00'
  
  let hours = parseInt(match[1], 10)
  const minutes = match[2] ? parseInt(match[2], 10) : 0
  const meridiem = match[3] || ''
  
  if (meridiem === 'pm' && hours !== 12) hours += 12
  if (meridiem === 'am' && hours === 12) hours = 0
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

// Helper to calculate duration in minutes
function calcDuration(startTime, endTime) {
  const [sh, sm] = startTime.split(':').map(Number)
  const [eh, em] = endTime.split(':').map(Number)
  const startMinutes = sh * 60 + sm
  const endMinutes = eh * 60 + em
  return Math.max(0, endMinutes - startMinutes)
}

// Helper to get track from area of focus
function getTrack(areaOfFocus) {
  const area = (areaOfFocus || '').toLowerCase()
  if (area.includes('k-12') || area.includes('classroom')) return 'K-12'
  if (area.includes('experience') || area.includes('training')) return 'Experience Based T&D'
  if (area.includes('nature')) return 'Nature Based Practices'
  if (area.includes('inclusive')) return 'Inclusive Practices'
  return 'Experience Based T&D'
}

// Read the new CSV
const newCsvPath = path.join(__dirname, '..', 'Final for Adwait 1.csv')
const newCsvContent = fs.readFileSync(newCsvPath, 'utf8')

const lines = newCsvContent.split('\n')
const header = lines[0].split(',').map(h => h.trim())

// Map headers to indices
const dateIdx = header.indexOf('Date')
const startIdx = header.indexOf('Start Time')
const endIdx = header.indexOf('End Time')
const nameIdx = header.indexOf('Name of Presenter')
const bioIdx = header.indexOf('Biographical Sketch of the Presenter ')
const titleIdx = header.indexOf('Workshop  Title')
const areaIdx = header.indexOf('Area of Focus')
const descIdx = header.indexOf('Workshop Description: ')

const newSessions = []

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim()
  if (!line || line === ',,,,,,,,') continue
  
  // Handle quoted fields
  const fields = []
  let current = ''
  let inQuotes = false
  
  for (let j = 0; j < line.length; j++) {
    const char = line[j]
    if (char === '"') {
      inQuotes = !inQuotes
      current += char
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  fields.push(current.trim())
  
  const date = fields[dateIdx]?.trim() || ''
  if (!date || (!date.includes('31st') && !date.includes('31-Jan') && !date.includes('1st Feb') && !date.includes('1st Feb'))) {
    continue
  }
  
  const startTime = convertTime(fields[startIdx])
  const endTime = convertTime(fields[endIdx])
  const presenter = fields[nameIdx]?.trim() || ''
  const bio = fields[bioIdx]?.trim().replace(/^"|"$/g, '') || ''
  const title = fields[titleIdx]?.trim() || ''
  const area = fields[areaIdx]?.trim() || ''
  const desc = fields[descIdx]?.trim().replace(/^"|"$/g, '') || ''
  
  if (!title || !presenter) continue
  
  // Determine ISO date
  let isoDate = ''
  if (date.includes('31') || date.includes('31st')) {
    isoDate = '2026-01-31'
  } else if (date.includes('1st Feb')) {
    isoDate = '2026-02-01'
  } else {
    continue
  }
  
  const duration = calcDuration(startTime, endTime)
  
  newSessions.push({
    title,
    description: desc,
    date: isoDate,
    startTime,
    endTime,
    location: 'Pune', // default for 31st/1st
    track: getTrack(area),
    speakers: [presenter],
    capacity: 80,
    duration,
    category: 'Conference'
  })
}

console.log(`✓ Parsed ${newSessions.length} sessions from new CSV`)

// Now get masterclasses from Book1.csv
const bookCsvPath = path.join(__dirname, '..', 'Book1.csv')
const bookCsvContent = fs.readFileSync(bookCsvPath, 'utf8')
const bookLines = bookCsvContent.split('\n')

const masterclasses = {}

for (let i = 1; i < bookLines.length; i++) {
  const line = bookLines[i].trim()
  if (!line) continue
  
  const parts = line.split(',')
  if (parts.length < 6) continue
  
  const speaker = parts[0].trim()
  const date = parts[1].trim()
  const startTime = parts[2].trim()
  const endTime = parts[3].trim()
  const sessionName = parts[4].trim()
  const location = parts[5].trim()
  
  if (!speaker || !date) continue
  if (!['24/01/26', '25/01/26', '29/01/26', '30/01/26'].includes(date)) continue
  
  // Parse date
  const [day, month, year] = date.split('/')
  const isoDate = `20${year}-${month}-${day}`
  
  const key = `${isoDate}|${location}|${sessionName}`
  
  if (!masterclasses[key]) {
    masterclasses[key] = {
      title: sessionName,
      description: `${sessionName} - A masterclass by ${speaker}`,
      date: isoDate,
      startTime: '10:00',
      endTime: '17:00',
      location,
      track: 'Masterclass',
      speakers: [],
      capacity: 80,
      duration: 420,
      category: 'Conference'
    }
  }
  
  if (!masterclasses[key].speakers.includes(speaker)) {
    masterclasses[key].speakers.push(speaker)
  }
}

const masterclassArray = Object.values(masterclasses)
console.log(`✓ Found ${masterclassArray.length} masterclass sessions`)

// Combine all sessions
const allSessions = [...masterclassArray, ...newSessions]

// Sort by date then time
allSessions.sort((a, b) => {
  const dateA = new Date(a.date)
  const dateB = new Date(b.date)
  if (dateA.getTime() !== dateB.getTime()) return dateA.getTime() - dateB.getTime()
  return a.startTime.localeCompare(b.startTime)
})

console.log(`\n✓ Total sessions: ${allSessions.length}`)
console.log(`  24 Jan: ${allSessions.filter(s => s.date === '2026-01-24').length}`)
console.log(`  25 Jan: ${allSessions.filter(s => s.date === '2026-01-25').length}`)
console.log(`  29 Jan: ${allSessions.filter(s => s.date === '2026-01-29').length}`)
console.log(`  30 Jan: ${allSessions.filter(s => s.date === '2026-01-30').length}`)
console.log(`  31 Jan: ${allSessions.filter(s => s.date === '2026-01-31').length}`)
console.log(`  01 Feb: ${allSessions.filter(s => s.date === '2026-02-01').length}`)

// Write to schedule-data.js
const schedulePath = path.join(__dirname, '..', 'schedule-data.js')
const output = `// Generated from Final for Adwait 1.csv and Book1.csv
const scheduleData = ${JSON.stringify(allSessions, null, 2)}

export { scheduleData }
`

fs.writeFileSync(schedulePath, output)
console.log(`\n✓ Updated ${schedulePath}`)
