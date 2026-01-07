# Schedule Data Upload Instructions

The schedule data has been prepared and is ready to be uploaded to Firestore. Here's how to do it:

## Prerequisites

1. **Create a Service Account** (for admin upload):
   - Go to Firebase Console → Your Project → Project Settings
   - Click "Service Accounts" tab
   - Click "Generate New Private Key"
   - Save the JSON file

2. **Enable Firestore Database**:
   - Go to Firebase Console → Firestore Database
   - Click "Create Database"
   - Choose "Start in test mode" (for development)
   - Choose a region (e.g., us-central1)
   - Click "Create"

3. **Enable Authentication**:
   - Go to Firebase Console → Authentication
   - Click "Sign-in method"
   - Enable "Email/Password"

## Method 1: Using Admin SDK (Recommended for batch uploads)

If you downloaded the service account JSON file:

```bash
# Set environment variables from the service account JSON
export FIREBASE_PRIVATE_KEY_ID="your-key-id"
export FIREBASE_PRIVATE_KEY="your-private-key"
export FIREBASE_CLIENT_EMAIL="your-client-email"
export FIREBASE_CLIENT_ID="your-client-id"
export FIREBASE_CLIENT_CERT_URL="your-cert-url"

# Run the upload script
node upload-schedule.js
```

## Method 2: Using Web SDK (Simpler)

If you don't have admin credentials, use the web SDK method:

```bash
# Make sure your .env file has the correct credentials
node upload-schedule-web.js
```

## What Gets Uploaded

The script will upload:

- **Bengaluru Masterclass**: Jan 24-25, 2026 (8 sessions)
- **Pune Masterclass**: Jan 29-30, 2026 (8 sessions)
- **Pune Conference Day 1**: Jan 31, 2026 (Multiple concurrent workshops)
- **Pune Conference Day 2**: Feb 1, 2026 (Multiple concurrent workshops)

**Total**: ~80 sessions

Each session includes:

- Title
- Description
- Date and Time (with duration)
- Location
- Track Category
- Speakers
- Capacity
- Category (Masterclass/Conference)

## After Upload

1. Check Firestore Console to verify data is there
2. Restart the app to see the schedule
3. Navigate to the "Schedule" tab in the app

## Troubleshooting

**"PERMISSION_DENIED" Error**:

- Make sure you've enabled Firestore in your Firebase Console
- Check that you're in test mode or your rules allow reads/writes

**"No sessions showing in app"**:

- Restart the Expo dev server: `npm run web`
- Clear browser cache
- Check that your .env file is correct

## Firestore Rules (Test Mode)

For development, your Firestore should have these rules in test mode:

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2026, 1, 1);
    }
  }
}
```

For production, update with proper authentication rules from `firestore.rules`.
