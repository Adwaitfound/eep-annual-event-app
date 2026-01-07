import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDKVE1KsDFxAW3uLidgFW5E5C9L6CPpaKk",
  authDomain: "eep-app-ea0e0.firebaseapp.com",
  projectId: "eep-app-ea0e0",
  storageBucket: "eep-app-ea0e0.firebasestorage.app",
  messagingSenderId: "415614007066",
  appId: "1:415614007066:web:d572065a9b85032e5bdea3"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function addSampleData() {
  try {
    console.log('Adding sample data to Firestore...')

    // Add event info
    await setDoc(doc(db, 'event', 'info'), {
      name: 'EEP Annual Event 2025',
      description: 'Foundation for Economic Education and Peace Annual Conference',
      location: 'Main Convention Center',
      date: new Date('2025-12-25'),
      createdAt: serverTimestamp()
    })
    console.log('✅ Event info added')

    // Add schedule items
    const scheduleItems = [
      {
        title: 'Opening Keynote',
        description: 'Welcome address and conference overview',
        startTime: new Date('2025-12-25T09:00:00'),
        endTime: new Date('2025-12-25T10:00:00'),
        location: 'Main Hall',
        speaker: 'Dr. Sarah Johnson'
      },
      {
        title: 'Economic Development Panel',
        description: 'Discussion on sustainable economic growth',
        startTime: new Date('2025-12-25T10:30:00'),
        endTime: new Date('2025-12-25T12:00:00'),
        location: 'Conference Room A',
        speaker: 'Panel Discussion'
      },
      {
        title: 'Lunch Break',
        description: 'Networking lunch',
        startTime: new Date('2025-12-25T12:00:00'),
        endTime: new Date('2025-12-25T13:30:00'),
        location: 'Dining Hall'
      },
      {
        title: 'Peace Initiatives Workshop',
        description: 'Interactive workshop on peace building',
        startTime: new Date('2025-12-25T13:30:00'),
        endTime: new Date('2025-12-25T15:00:00'),
        location: 'Workshop Room B',
        speaker: 'Prof. Michael Chen'
      },
      {
        title: 'Closing Ceremony',
        description: 'Awards and closing remarks',
        startTime: new Date('2025-12-25T15:30:00'),
        endTime: new Date('2025-12-25T17:00:00'),
        location: 'Main Hall',
        speaker: 'Conference Organizers'
      }
    ]

    for (const item of scheduleItems) {
      await addDoc(collection(db, 'schedule'), {
        ...item,
        createdAt: serverTimestamp()
      })
    }
    console.log('✅ Schedule items added')

    // Add speakers
    const speakers = [
      {
        name: 'Dr. Sarah Johnson',
        title: 'Chief Economist',
        company: 'Global Economic Forum',
        bio: 'Leading expert in sustainable economic development with over 20 years of experience.',
        image: 'https://ui-avatars.com/api/?name=Sarah+Johnson&size=200&background=3b82f6&color=fff'
      },
      {
        name: 'Prof. Michael Chen',
        title: 'Director of Peace Studies',
        company: 'International Peace Institute',
        bio: 'Renowned scholar in conflict resolution and peace building initiatives.',
        image: 'https://ui-avatars.com/api/?name=Michael+Chen&size=200&background=10b981&color=fff'
      },
      {
        name: 'Ambassador Maria Rodriguez',
        title: 'Former UN Representative',
        company: 'United Nations',
        bio: 'Veteran diplomat with extensive experience in international relations.',
        image: 'https://ui-avatars.com/api/?name=Maria+Rodriguez&size=200&background=8b5cf6&color=fff'
      },
      {
        name: 'Dr. James Williams',
        title: 'Education Policy Expert',
        company: 'Foundation for Education',
        bio: 'Pioneer in educational reform and economic empowerment programs.',
        image: 'https://ui-avatars.com/api/?name=James+Williams&size=200&background=f59e0b&color=fff'
      }
    ]

    for (const speaker of speakers) {
      await addDoc(collection(db, 'speakers'), {
        ...speaker,
        createdAt: serverTimestamp()
      })
    }
    console.log('✅ Speakers added')

    console.log('\n🎉 All sample data added successfully!')
    console.log('You can now refresh your app to see the data.')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error adding sample data:', error)
    process.exit(1)
  }
}

addSampleData()
