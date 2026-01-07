/**
 * Script to upload schedule data to Firebase Firestore
 * Run with: node upload-schedule.js
 */

import fs from 'fs'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { scheduleData } from './schedule-data.js'

// Try env-based service account first; fall back to local serviceAccountKey.json if available.
const buildServiceAccount = () => {
  const envKey = process.env.FIREBASE_PRIVATE_KEY
  if (envKey && process.env.FIREBASE_CLIENT_EMAIL) {
    return {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID || 'eep-app-ea0e0',
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: envKey.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
    }
  }

  // Fallback to local file
  const keyPath = './serviceAccountKey.json'
  if (fs.existsSync(keyPath)) {
    return JSON.parse(fs.readFileSync(keyPath, 'utf8'))
  }

  throw new Error('Missing Firebase credentials. Set env vars or provide serviceAccountKey.json')
}

const serviceAccount = buildServiceAccount()

// Initialize Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount)
})

const db = getFirestore()

async function uploadScheduleData() {
  try {
    const sessionsRef = db.collection('sessions')
    
    // Step 1: Delete all existing sessions
    console.log('🗑️  Deleting all existing sessions...')
    const existingSessions = await sessionsRef.get()
    const deletePromises = []
    existingSessions.forEach((doc) => {
      deletePromises.push(doc.ref.delete())
    })
    await Promise.all(deletePromises)
    console.log(`✓ Deleted ${existingSessions.size} old sessions\n`)
    
    // Step 2: Upload new sessions
    console.log('📤 Uploading new schedule data...')
    let uploadCount = 0

    for (const session of scheduleData) {
      const sessionData = {
        ...session,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      }

      await sessionsRef.add(sessionData)
      uploadCount++
      console.log(`✓ Uploaded: ${session.title} (${session.date} at ${session.startTime})`)
    }

    console.log(`\n✅ Successfully uploaded ${uploadCount} sessions to Firestore!`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error uploading schedule data:', error)
    process.exit(1)
  }
}

uploadScheduleData()
