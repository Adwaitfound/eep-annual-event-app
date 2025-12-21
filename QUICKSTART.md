# Quick Start Guide

This guide will help you get the EEP Annual Event App running on your machine in minutes.

## Prerequisites

Make sure you have the following installed:
- Node.js (v18 or higher): https://nodejs.org/
- npm (comes with Node.js)
- Git: https://git-scm.com/

## Setup Steps

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/Adwaitfound/eep-annual-event-app.git
cd eep-annual-event-app

# Install dependencies
npm install
```

### 2. Firebase Configuration

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Authentication (Email/Password)
3. Create Firestore Database
4. Create Storage bucket
5. Copy your Firebase config

### 3. Configure Environment

```bash
# Copy the environment template
cp .env.example .env

# Edit .env and add your Firebase credentials
# Use your favorite text editor (nano, vim, vscode, etc.)
nano .env
```

Add your Firebase credentials:
```env
FIREBASE_API_KEY=AIza...
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abc123
```

### 4. Set Up Firestore Security Rules

1. Go to Firestore Database in Firebase Console
2. Click on "Rules" tab
3. Copy the contents of `firestore.rules` from this project
4. Paste into the Firebase Console
5. Click "Publish"

### 5. Set Up Storage Security Rules

1. Go to Storage in Firebase Console
2. Click on "Rules" tab
3. Copy the contents of `storage.rules` from this project
4. Paste into the Firebase Console
5. Click "Publish"

### 6. Run the App

#### For Web (Easiest to test)
```bash
npm run web
```
The app will open in your browser at http://localhost:19006

#### For Mobile (iOS/Android)
```bash
# Install Expo Go app on your phone from:
# iOS: App Store
# Android: Google Play Store

# Start Expo
npm start

# Scan the QR code with:
# iOS: Camera app
# Android: Expo Go app
```

## What You'll See

1. **Login Screen**: The app starts with a login screen
2. **Register**: Click "Sign Up" to create a new account
3. **Profile Setup**: After registration, you'll be prompted to complete your profile
4. **Main App**: After setup, you'll see the main app with 5 tabs:
   - Schedule (placeholder)
   - Speakers (placeholder)
   - Network (placeholder)
   - Info (placeholder)
   - Profile

## Troubleshooting

### "npm install" fails
- Make sure you're using Node.js v18 or higher
- Try deleting `node_modules` and `package-lock.json`, then run `npm install` again
- The `.npmrc` file configures legacy-peer-deps, which is normal for React Native

### Firebase errors
- Double-check your `.env` file has the correct credentials
- Make sure all Firebase services are enabled in the Firebase Console
- Ensure you've published the security rules

### App won't start
- Make sure all dependencies installed successfully
- Check that no other app is using port 19000-19006
- Try clearing Expo cache: `npx expo start -c`

### Images not showing
- The app references images in `src/assets/images/`
- For now, the app will work without them (you'll see warnings)
- See `src/assets/images/README.md` for required images

## Next Steps

1. **Add Test Data**: Use Firebase Console to add sample sessions and speakers
2. **Customize Theme**: Edit `src/utils/constants.js` to change colors
3. **Add Features**: Phase 2 will add schedule management
4. **Test on Real Device**: Install Expo Go and test on your phone

## Need Help?

- Check the main [README.md](README.md) for full documentation
- Review [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines
- Open an issue on GitHub if you encounter problems

## Useful Commands

```bash
# Start development server
npm start

# Run on specific platform
npm run web
npm run android
npm run ios

# Check for errors
npm run lint

# Format code
npm run format
```

Happy coding! 🚀
