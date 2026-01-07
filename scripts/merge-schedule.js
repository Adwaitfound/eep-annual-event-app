// Merge schedule data: keep 24, 25, 29, 30 from CSV, update 31st and 1st from new CSV data
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Read current schedule-data.js
const scheduleDataPath = path.join(__dirname, '..', 'schedule-data.js')
const scheduleContent = fs.readFileSync(scheduleDataPath, 'utf8')

// Extract the schedule array
const scheduleMatch = scheduleContent.match(/const scheduleData = \[([\s\S]*)\]/)
if (!scheduleMatch) {
  console.error('Could not parse schedule-data.js')
  process.exit(1)
}

// Parse as JSON by wrapping in brackets
const scheduleArray = JSON.parse('[' + scheduleMatch[1] + ']')

// Separate by date
const jan31Sessions = scheduleArray.filter(s => s.date === '2026-01-31')
const feb1Sessions = scheduleArray.filter(s => s.date === '2026-02-01')
const otherSessions = scheduleArray.filter(s => s.date !== '2026-01-31' && s.date !== '2026-02-01')

console.log(`Found ${jan31Sessions.length} sessions on 31st Jan`)
console.log(`Found ${feb1Sessions.length} sessions on 1st Feb`)
console.log(`Found ${otherSessions.length} other sessions`)

// Now check if there are sessions from CSV that should be on 24, 25, 29, 30
// Those need to be added back if missing
const csvPath = path.join(__dirname, '..', 'Book1.csv')
const csvContent = fs.readFileSync(csvPath, 'utf8')
const csvLines = csvContent.split('\n').slice(1) // skip header

// Extract masterclass sessions from CSV (24, 25, 29, 30)
const masterclasses = {}
csvLines.forEach(line => {
  if (!line.trim()) return
  
  const parts = line.split(',')
  if (parts.length < 6) return
  
  const speaker = parts[0].trim()
  const date = parts[1].trim()
  const startTime = parts[2].trim()
  const endTime = parts[3].trim()
  const sessionName = parts[4].trim()
  const location = parts[5].trim()
  
  if (!speaker || !date) return
  if (!['24/01/26', '25/01/26', '29/01/26', '30/01/26'].includes(date)) return
  
  const dateObj = new Date(date.replace(/\//g, '-').split('-').reverse().join('-') + 'T00:00:00Z')
  const isoDate = dateObj.toISOString().split('T')[0]
  
  const key = `${isoDate}-${location}-${sessionName}`
  if (!masterclasses[key]) {
    masterclasses[key] = {
      title: sessionName,
      description: `${sessionName} - A masterclass by ${speaker}`,
      date: isoDate,
      startTime: '10:00',
      endTime: '17:00',
      location: location,
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
})

// Combine: other sessions (24-30) + new masterclasses + updated 31st & 1st
const mergedSessions = [
  ...Object.values(masterclasses),
  ...jan31Sessions,
  ...feb1Sessions
]

// Sort by date then time
mergedSessions.sort((a, b) => {
  const dateA = new Date(a.date)
  const dateB = new Date(b.date)
  if (dateA !== dateB) return dateA - dateB
  return a.startTime.localeCompare(b.startTime)
})

console.log(`\nMerged schedule has ${mergedSessions.length} total sessions`)

// Write back to file
const output = `// Generated from scripts/data/final-speakers.csv
const scheduleData = ${JSON.stringify(mergedSessions, null, 2)}

export { scheduleData }\n`

fs.writeFileSync(scheduleDataPath, output)
console.log(`✓ Updated ${scheduleDataPath}`)
