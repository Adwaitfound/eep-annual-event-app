#!/usr/bin/env node

/**
 * Script to upload schedule data to Firebase Firestore using Web SDK
 * Run with: node upload-schedule-web.js
 * 
 * This script uses your .env credentials to authenticate
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');
const scheduleData = require('./schedule-data');

// Load environment variables from .env file
require('dotenv').config();

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

console.log('Firebase Config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function uploadScheduleData() {
  try {
    console.log('\n🚀 Starting schedule data upload to Firestore...\n');
    
    const sessionsRef = collection(db, 'sessions');
    let uploadCount = 0;
    let errors = 0;

    for (const session of scheduleData) {
      try {
        const sessionData = {
          ...session,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(sessionsRef, sessionData);
        uploadCount++;
        console.log(`✓ [${uploadCount}/${scheduleData.length}] ${session.title}`);
        console.log(`  📅 ${session.date} | ⏰ ${session.startTime}-${session.endTime} | 📍 ${session.location}`);
        if (session.speakers && session.speakers.length > 0) {
          console.log(`  🎤 Speakers: ${session.speakers.join(', ')}`);
        }
        console.log();
      } catch (error) {
        errors++;
        console.error(`✗ Error uploading "${session.title}":`, error.message);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✅ Upload Complete!`);
    console.log(`Total Sessions: ${scheduleData.length}`);
    console.log(`Successfully Uploaded: ${uploadCount}`);
    if (errors > 0) {
      console.log(`Errors: ${errors}`);
    }
    console.log('='.repeat(60) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Critical Error:', error);
    process.exit(1);
  }
}

uploadScheduleData();
