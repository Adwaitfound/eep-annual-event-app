# How to Upload Schedule to Firebase

## Step 1: Create Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **eep-app-ea0e0**
3. Click **Firestore Database** (left menu)
4. Click **Create Database**
5. Choose **Start in test mode**
6. Select region (e.g., **us-central1**)
7. Click **Create**

## Step 2: Download Service Account Key

1. Go to Firebase Console > **Project Settings** (gear icon)
2. Click the **Service Accounts** tab
3. Click **Generate New Private Key** button
4. A JSON file will download
5. **Save it in the project root** and rename it to: `serviceAccountKey.json`

The path should be: `/tmp/eep-annual-event-app/serviceAccountKey.json`

## Step 3: Upload the Schedule

Run this command:

```bash
cd /tmp/eep-annual-event-app
node upload-to-firebase.js
```

You should see:

```
🚀 Starting schedule upload to Firestore...
  Prepared 10 sessions...
  Prepared 20 sessions...
  ...
✅ SUCCESS! All sessions uploaded to Firestore
Total Sessions: 49
```

## Step 4: Verify in Firebase Console

1. Go to Firebase Console > **Firestore Database**
2. Click on the **sessions** collection
3. You should see all ~49 sessions listed

## Step 5: Update Firestore Security Rules (Optional)

For production, update your Firestore rules:

1. Go to Firestore Database > **Rules** tab
2. Replace with this:

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read sessions
    match /sessions/{document=**} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth.token.admin == true;
    }

    // Allow users to read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

## Troubleshooting

### "serviceAccountKey.json not found"

- Download the key file from Firebase Console as described above
- Make sure it's in the project root directory
- The filename must be exactly: `serviceAccountKey.json`

### "Permission denied" error

- Make sure Firestore is in **test mode**
- Or update your security rules to allow reads/writes

### "Project not found"

- Double-check the project ID in the service account key
- Make sure you're using the correct Firebase project

## What Gets Uploaded

- **Bengaluru Masterclass**: Jan 24-25, 2026 (8 sessions)
- **Pune Masterclass**: Jan 29-30, 2026 (8 sessions)
- **Pune Conference Day 1**: Jan 31, 2026 (33 sessions)
- **Pune Conference Day 2**: Feb 1, 2026 (Multiple concurrent workshops)

**Total: 49 sessions**

Each session includes:

- Title
- Date & Time (startTime, endTime)
- Location (Bengaluru/Pune)
- Track (Workshop, Break, Keynote)
- Speakers (array)
- Category (Masterclass/Conference)

## Next Steps

After uploading:

1. **Start the app**:

   ```bash
   npm run web
   ```

2. **Create a test user** in Firebase Authentication
3. **Log in** to the app
4. **Go to Schedule tab** to see all sessions
5. **Filter by date or track** as needed

## For Production

Once you're happy with the data:

1. Update `.env` with production credentials
2. Enable proper authentication in Firebase
3. Update Firestore security rules (see above)
4. Test on real devices
