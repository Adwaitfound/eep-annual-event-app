// Update schedule for 31st Jan and 1st Feb only, keeping other dates
import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Papa from 'papaparse'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const csvPath = path.join(__dirname, 'scripts/data/final-speakers.csv')
const scheduleDataPath = path.join(__dirname, 'schedule-data.js')

const csvContent = readFileSync(csvPath, 'utf8')
const rows = Papa.parse(csvContent).data

// Parse CSV into sessions
const newSessions = rows
  .slice(1) // Skip header
  .filter((row) => row[0] && row[0].trim()) // Has speaker name
  .filter((row) => {
    const date = row[0] === '31st Jan ' || row[0] === '31-Jan' ? '31st Jan' : row[0]
    return date.includes('31st Jan') || date.includes('1st Feb')
  })
  .map((row) => {
    const date = row[0]
    const startTime = row[1]
    const endTime = row[2]
    const speaker = row[3]
    const bio = row[4]
    const title = row[5]
    const track = row[6]
    const description = row[7]

    // Convert date format
    let dateStr
    if (date.includes('31st Jan') || date.includes('31-Jan')) {
      dateStr = '2026-01-31'
    } else if (date.includes('1st Feb')) {
      dateStr = '2026-02-01'
    }

    // Convert time 10.45 => 10:45
    const [startHour, startMin] = startTime.split('.').map((x) => x.padStart(2, '0'))
    const [endHour, endMin] = endTime.split('.').map((x) => x.padStart(2, '0'))
    const startTimeStr = `${startHour}:${startMin}`
    const endTimeStr = `${endHour}:${endMin}`

    // Calculate duration
    const startMinutes = parseInt(startHour) * 60 + parseInt(startMin)
    const endMinutes = parseInt(endHour) * 60 + parseInt(endMin)
    const duration = Math.max(0, endMinutes - startMinutes)

    // Default location
    const location = dateStr === '2026-01-31' ? 'Bengaluru' : 'Pune'

    return {
      title: title || '',
      description: description || '',
      date: dateStr,
      startTime: startTimeStr,
      endTime: endTimeStr,
      location,
      track: track || 'Conference',
      speakers: [speaker].filter(Boolean),
      capacity: 80,
      duration,
      category: 'Conference',
    }
  })
  .filter((s) => s.title) // Only sessions with titles

console.log(`Found ${newSessions.length} sessions for 31st Jan and 1st Feb`)
console.log(newSessions.slice(0, 3))

// Read existing schedule-data.js
let scheduleData = readFileSync(scheduleDataPath, 'utf8')

// Extract the array content
const arrayMatch = scheduleData.match(/const scheduleData = \[([\s\S]*)\]\s*export/)
if (!arrayMatch) {
  console.error('Could not find schedule array')
  process.exit(1)
}

// Parse existing sessions
const existingCode = `[${arrayMatch[1]}]`
let existingSessions = eval(existingCode)

// Filter out 31st Jan and 1st Feb sessions
const otherDatesSessions = existingSessions.filter(
  (s) => s.date !== '2026-01-31' && s.date !== '2026-02-01'
)

console.log(
  `Keeping ${otherDatesSessions.length} sessions from other dates, adding ${newSessions.length} new sessions`
)

// Combine
const allSessions = [...otherDatesSessions, ...newSessions]

// Generate new file
const newContent = `// Generated from scripts/data/final-speakers.csv
const scheduleData = ${JSON.stringify(allSessions, null, 2)}

export { scheduleData }
`

writeFileSync(scheduleDataPath, newContent)
console.log('✓ Updated schedule-data.js with 31st Jan and 1st Feb sessions only')
