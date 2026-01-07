// Seed speakers into Firestore using firebase-admin.
// Usage: node scripts/seed-speakers.js
// Requires serviceAccountKey.json at project root and firebase-admin installed.

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

// Core masterclass speakers with bios
const masterclassSpeakers = [
  {
    id: 'laurie-frank',
    name: 'Laurie Frank',
    title: 'Owner/Director, GOAL Consulting; Author & Experiential Educator',
    bio:
      'Special education teacher turned experiential education leader. Focus on community-building, collaborative leadership, SEL, and appreciative inquiry. Author of Adventure in the Classroom and Journey Toward the Caring Classroom.',
    sessionTitle: 'Masterclass: Creating a Sense of Community with Intention / Thinking Experientially',
    track: 'Masterclass',
  },
  {
    id: 'mark-collard',
    name: 'Mark Collard',
    title: 'Founder, playmeo; Experiential Trainer & Author',
    bio:
      '36+ years designing playful experiential programs. Known as the “lazy facilitator.” Author of 5 books, 800+ activities; focuses on program design, psychological safety, and facilitation mastery.',
    sessionTitle: 'Masterclass: Remarkable Program Design / Critical Facilitation Skills',
    track: 'Masterclass',
  },
]

// Presenters extracted from Jan 31 & Feb 1 workshop pages (titles are concise placeholders)
const workshopPresenters = [
  // Jan 31 workshops
  { id: 'ameena-bukhari', name: 'Ameena Bukhari', title: 'Co-presenter, Intent-Based Leadership Simulation', track: 'Experience Based T&D' },
  { id: 'arvind-khinvesra', name: 'Arvind Khinvesra', title: 'Co-presenter, Intent-Based Leadership Simulation', track: 'Experience Based T&D' },
  { id: 'subhomoy-bhaduri', name: 'Shubhomoy Bhaduri', title: 'Co-presenter, Sport as a Medium for Social Justice', track: 'Inclusive Practices' },
  { id: 'shikha-bohra', name: 'Shikha Bohra', title: 'Co-presenter, Sport as a Medium for Social Justice', track: 'Inclusive Practices' },
  { id: 'vivek-yatnalkar', name: 'Vivek Yatnalkar', title: 'Facilitator, Let the Learning Happen - Do not Teach!', track: 'Experience Based T&D' },
  { id: 'racy-shukla', name: 'Racy Shukla', title: 'Presenter, The Synthetic Friend: When AI Listens but No One Else Does', track: 'K-12' },
  { id: 'ritu-dua', name: 'Ritu Dua', title: 'Facilitator, Where Quiet Grows', track: 'Nature Based Practices' },
  { id: 'sakshi-rawat', name: 'Sakshi Rawat', title: 'Facilitator, Designing Experiences That Stick', track: 'Experience Based T&D' },
  { id: 'sarabjit-singh-wallia', name: 'Sarabjit Singh Wallia', title: 'Workshop Facilitator', track: 'Experience Based T&D' },
  { id: 'nidhi-mittal', name: 'Nidhi Mittal', title: 'Facilitator, The Discipline of Subtraction', track: 'Experience Based T&D' },
  { id: 'simran-sanganeria', name: 'Simran Sanganeria', title: 'Facilitator, Art/Theatre/Play for Safe Group Spaces', track: 'Inclusive Practices' },
  { id: 'divya-arathi-m', name: 'Divya Arathi M', title: 'Facilitator, The Art of Learning to Learn', track: 'K-12' },
  { id: 'sumita-gowdety', name: 'Sumita Gowdety', title: 'Facilitator, From Turbulence to Tranquility (SEL)', track: 'K-12' },
  { id: 'usha-krishnan', name: 'Usha Krishnan', title: 'Facilitator, Designing the Experience', track: 'Experience Based T&D' },
  { id: 'sinthuja-shanmuganathan', name: 'Sinthuja Shanmuganathan', title: 'Co-facilitator, Play as Resistance', track: 'Inclusive Practices' },
  { id: 'swati-bhatt', name: 'Swati Bhatt', title: 'Co-facilitator, Play as Resistance', track: 'Inclusive Practices' },
  { id: 'agyatmitra', name: 'Agyatmitra', title: 'Co-facilitator, Play as Resistance', track: 'Inclusive Practices' },
  { id: 'chetan-vohra', name: 'Chetan Vohra', title: 'Facilitator, SEL Workshop through Play', track: 'K-12' },
  { id: 'diyanat-ali', name: 'Diyanat Ali', title: 'Facilitator, Beyond Psychological Safety (Somatics & Polyvagal)', track: 'Experience Based T&D' },
  { id: 'rinti-sengupta', name: 'Rinti Sengupta', title: 'Facilitator, Differentiated Pedagogies via Puppetry', track: 'K-12' },
  { id: 'junaid-hussain', name: 'Junaid Hussain', title: 'Facilitator, Quality Delivery & Price Standardisation', track: 'Experience Based T&D' },
  { id: 'vishwas-parchure', name: 'Vishwas Parchure', title: 'Workshop Facilitator', track: 'Experience Based T&D' },
  { id: 'yateen-gharat', name: 'Yateen Gharat', title: 'Facilitator, Exploring The ObVerse - The Other Side of Coin', track: 'Experience Based T&D' },
  { id: 'prachi-dalal', name: 'Prachi Dalal', title: 'Facilitator, Unboring History: Stories Things Tell', track: 'K-12' },
  { id: 'srishti-malpath', name: 'Srishti Malpath', title: 'Facilitator, Embodied Pedagogies', track: 'Nature Based Practices' },

  // Feb 1 workshops
  { id: 'jasmin-jasin', name: 'Jasmin Jasin', title: 'Co-facilitator, Mandala of Systems Awareness', track: 'K-12' },
  { id: 'sahala-harap', name: 'Sahala Harap', title: 'Co-facilitator, Mandala of Systems Awareness', track: 'K-12' },
  { id: 'anup-talwar', name: 'Anup Talwar', title: 'Facilitator, NLP for Experiential Educators', track: 'Experience Based T&D' },
  { id: 'rashmi-datt', name: 'Rashmi Datt', title: 'Facilitator, Mindful Conflict Management', track: 'Experience Based T&D' },
  { id: 'aaryan-sen', name: 'Aaryan Sen', title: 'Facilitator, Connecting with the Self 2 through Self 1', track: 'Experience Based T&D' },
  { id: 'riju-banerjee', name: 'Riju Banerjee', title: 'Facilitator, Beyond the Binary (Safety & Inclusion)', track: 'Inclusive Practices' },
  { id: 'natasha-nayar', name: 'Natasha Nayar', title: 'Co-facilitator, SHAKTI Warriors', track: 'Nature Based Practices' },
  { id: 'lane-jabaay', name: 'Lane Jabaay', title: 'Co-facilitator, SHAKTI Warriors', track: 'Nature Based Practices' },
  { id: 'gayatri-singh', name: 'Gayatri Singh', title: 'Facilitator, Immersive Sound Meditation Session', track: 'Nature Based Practices' },
  { id: 'mukta-joshi', name: 'Mukta Joshi', title: 'Facilitator, Forest of Stories', track: 'Nature Based Practices' },
  { id: 'anchita-kaul', name: 'Anchita Kaul', title: 'Co-facilitator, From Fibre to Freedom', track: 'Experience Based T&D' },
  { id: 'tsewang-yangzes', name: 'Tsewang Yangzes', title: 'Co-facilitator, From Fibre to Freedom', track: 'Experience Based T&D' },
  { id: 'vinay-sirsi', name: 'Vinay Sirsi', title: 'Workshop Facilitator', track: 'Experience Based T&D' },
  { id: 'pratyay-malakar', name: 'Pratyay Malakar', title: 'Facilitator, Experiential Education and Social Justice', track: 'Inclusive Practices' },
  { id: 'kavitha-talreja', name: 'Kavitha Talreja', title: 'Co-facilitator, Atlas of Emotions: EMO Lab', track: 'Experience Based T&D' },
  { id: 'roopashree-surana', name: 'Roopashree Surana', title: 'Co-facilitator, Atlas of Emotions: EMO Lab', track: 'Experience Based T&D' },
  { id: 'hemali-gandhi', name: 'Hemali Gandhi', title: 'Facilitator, Feel, Play, Grow', track: 'K-12' },
  { id: 'niken-rarasati', name: 'Niken Rasarati', title: 'Co-facilitator, The body knows your power', track: 'Experience Based T&D' },
  { id: 'tuuli-utriainen', name: 'Tuuli Utriainen', title: 'Co-facilitator, The body knows your power', track: 'Experience Based T&D' },
  { id: 'caroline-nagar', name: 'Caroline Nagar', title: 'Co-facilitator, What can Leaders Learn from School Principals', track: 'Experience Based T&D' },
  { id: 'somsuvra-chatterjee', name: 'Somsuvra Chatterjee', title: 'Co-facilitator, What can Leaders Learn from School Principals', track: 'Experience Based T&D' },
  { id: 'nidhi-chavan', name: 'Nidhi Chavan', title: 'Facilitator, Embodied Listening: The Art of Receiving', track: 'Experience Based T&D' },
  { id: 'zuhail-babu', name: 'Zuhail Babu P', title: 'Facilitator, Facilitator as Instrument', track: 'Experience Based T&D' },
  { id: 'tanushree-banerji', name: 'Tanushree Banerji', title: 'Facilitator, Panels of Possibility: Comic Writing as EE Tool', track: 'Experience Based T&D' },
  { id: 'rutesh-panditrao', name: 'Rutesh Panditrao', title: 'Facilitator, Contextual Sensitisers', track: 'Experience Based T&D' },
  { id: 'ashima-sheth', name: 'Ashima Sheth', title: 'Facilitator, Montessori Lens on Experiential Education', track: 'K-12' },
]

const speakers = [...masterclassSpeakers, ...workshopPresenters]

async function upsertSpeakers() {
  const batch = db.batch()
  speakers.forEach((speaker) => {
    const ref = db.collection('speakers').doc(speaker.id)
    batch.set(ref, {
      name: speaker.name,
      title: speaker.title || '',
      bio: speaker.bio || '',
      sessionTitle: speaker.sessionTitle || '',
      track: speaker.track || '',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true })
  })
  await batch.commit()
  console.log(`Seeded/updated ${speakers.length} speakers.`)
}

upsertSpeakers()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
