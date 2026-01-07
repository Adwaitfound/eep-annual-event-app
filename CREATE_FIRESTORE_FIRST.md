# ⚠️ IMPORTANT: Create Firestore Database First

The upload script is ready, but **Firestore Database must be created manually** in Firebase Console.

## Step 1: Create Firestore Database (Required)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **eep-app-ea0e0**
3. In the left menu, click **Firestore Database**
4. If you see a "Create Database" button, click it
5. Choose **Start in test mode** (for development)
6. Select region: **us-central1** (or closest to you)
7. Click **Create Database**
8. Wait 2-3 minutes for it to initialize

Once you see the Firestore console with an empty database, come back and run:

```bash
cd /tmp/eep-annual-event-app
node upload-to-firebase.js
```

## Step 2: Enable Authentication (Optional but Recommended)

1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Enable **Email/Password** provider
4. Click **Save**

## Step 3: Update Security Rules (Optional)

Go to **Firestore Database → Rules** and update to:

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read sessions
    match /sessions/{document=**} {
      allow read: if request.auth != null;
    }

    // Allow anyone to read during development
    match /sessions/{document=**} {
      allow read: if request.time < timestamp.date(2026, 2, 28);
    }
  }
}
```

Then click **Publish**.

## Troubleshooting

### "Error: 5 NOT_FOUND"

This means Firestore Database doesn't exist. Go to Firebase Console and create it.

### "PERMISSION_DENIED"

Update security rules or switch to test mode in Firestore.

## What Happens After Upload

Once the database is created and script runs successfully:

✅ 70 sessions will be uploaded to Firestore
✅ App can fetch schedule data
✅ Users can view sessions by date and location

## Next Steps

1. Create the Firestore Database
2. Run: `node upload-to-firebase.js`
3. Start the app: `npm run web`
4. Create test user in Firebase Auth
5. Log in and view schedule
