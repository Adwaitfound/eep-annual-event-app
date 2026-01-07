#!/usr/bin/env node

/**
 * Firebase Schedule Upload Script
 * This script uploads the event schedule to Firestore
 * 
 * SETUP REQUIRED:
 * 1. Go to Firebase Console > Your Project > Project Settings
 * 2. Click "Service Accounts" tab
 * 3. Click "Generate New Private Key" 
 * 4. Save as serviceAccountKey.json in this directory
 * 5. Run: node upload-to-firebase.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const scheduleData = require('./schedule-data');

// Check if service account key exists
const keyPath = path.join(__dirname, 'serviceAccountKey.json');

if (!fs.existsSync(keyPath)) {
  console.error('\n❌ ERROR: serviceAccountKey.json not found!\n');
  console.log('Setup Instructions:');
  console.log('1. Go to Firebase Console > Project Settings');
  console.log('2. Click "Service Accounts" tab');
  console.log('3. Click "Generate New Private Key"');
  console.log('4. Save the downloaded JSON file as serviceAccountKey.json in this directory');
  console.log('5. Run this script again\n');
  process.exit(1);
}

// Initialize Firebase Admin SDK
const serviceAccount = require(keyPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

const db = admin.firestore();

async function ensureDatabase() {
  try {
    console.log('Creating Firestore database reference...');
    
    // Try to create a test document to ensure database exists
    const testDocRef = db.collection('_test').doc('_init');
    await testDocRef.set({ initialized: true });
    await testDocRef.delete();
    
    console.log('✓ Firestore database is ready\n');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error.message);
    return false;
  }
}

async function uploadSchedule() {
  try {
    console.log('\n🚀 Starting schedule upload to Firestore...\n');
    
    // Ensure database exists
    const dbReady = await ensureDatabase();
    if (!dbReady) {
      throw new Error('Could not initialize database');
    }
    
    const batch = db.batch();
    const sessionsRef = db.collection('sessions');
    
    let uploadCount = 0;
    
    for (const session of scheduleData) {
      const docRef = sessionsRef.doc();
      batch.set(docRef, {
        ...session,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      
      uploadCount++;
      if (uploadCount % 10 === 0) {
        console.log(`  Prepared ${uploadCount} sessions...`);
      }
    }
    
    console.log(`\n📤 Committing ${uploadCount} sessions to Firestore...`);
    await batch.commit();
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ SUCCESS! All sessions uploaded to Firestore');
    console.log(`Total Sessions: ${uploadCount}`);
    console.log('='.repeat(60) + '\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error uploading schedule:', error.message);
    console.error('\nNote: Make sure Firestore Database is created in Firebase Console');
    process.exit(1);
  }
}

uploadSchedule();
