// Generate speakers data from CSV with LinkedIn links
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const csvPath = path.join(__dirname, '..', 'Final for Adwait 1.csv')
const csvContent = fs.readFileSync(csvPath, 'utf8')

const lines = csvContent.split('\n')
const header = lines[0].split(',').map(h => h.trim())

// Map headers
const nameIdx = header.indexOf('Name of Presenter')
const bioIdx = header.indexOf('Biographical Sketch of the Presenter ')
const linkedinIdx = header.indexOf('Linkedin')

const speakers = {}

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim()
  if (!line || line === ',,,,,,,,') continue
  
  // Parse CSV with quoted field support
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
  
  const name = fields[nameIdx]?.trim() || ''
  const bio = fields[bioIdx]?.trim().replace(/^"|"$/g, '') || ''
  let linkedin = fields[linkedinIdx]?.trim().replace(/^"|"$/g, '').replace(/,$/g, '') || ''
  
  if (!name || !bio) continue
  
  // Clean up LinkedIn URL
  if (linkedin && !linkedin.startsWith('http')) {
    linkedin = ''
  }
  
  const id = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
  
  if (!speakers[id]) {
    speakers[id] = {
      id,
      name,
      bio,
      linkedin: linkedin || null,
      image: null
    }
  }
}

const speakersArray = Object.values(speakers)

console.log(`✓ Generated ${speakersArray.length} speakers from CSV`)

const output = `// Generated from Final for Adwait 1.csv
export const speakers = ${JSON.stringify(speakersArray, null, 2)}
`

const outputPath = path.join(__dirname, '..', 'scripts', 'data', 'speakers-with-linkedin.js')
fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, output)

console.log(`✓ Saved to ${outputPath}`)

// Also output for reference
console.log('\nSpeaker Preview:')
speakersArray.slice(0, 3).forEach(s => {
  console.log(`- ${s.name}`)
  if (s.linkedin) console.log(`  LinkedIn: ${s.linkedin}`)
})
