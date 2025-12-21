# EEP Annual Event App

Event management application for the Foundation for Economic Education and Peace annual event. This is a cross-platform mobile application built with React Native and Expo that also works as a Progressive Web App (PWA).

## Features

### Phase 1 (Current) ✅
- ✅ User Authentication (Email/Password)
- ✅ User Registration with Profile Setup
- ✅ Bottom Tab Navigation
- ✅ Profile Management
- ✅ Firebase Integration
- ✅ Context-based State Management

### Coming Soon
- Event Schedule Management
- Speaker Profiles & Voting System
- Participant Networking & Messaging
- Personal Agenda Builder
- QR Code Networking
- Push Notifications
- Admin Dashboard

## Tech Stack

- **Framework**: React Native with Expo
- **Backend**: Firebase (Authentication, Firestore, Cloud Functions, Storage)
- **State Management**: React Context API
- **Navigation**: React Navigation v6
- **UI Components**: Custom components with consistent design system
- **Form Validation**: Formik + Yup
- **PWA Support**: Service Workers, Web Manifest

## Prerequisites

Before you begin, ensure you have installed:
- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Firebase CLI](https://firebase.google.com/docs/cli) (for Cloud Functions)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Adwaitfound/eep-annual-event-app.git
cd eep-annual-event-app
```

### 2. Install Dependencies

```bash
npm install
```

**Note:** This project uses `legacy-peer-deps` due to dependency conflicts between React Native packages. This is configured in the `.npmrc` file and is normal for React Native projects.

### 3. Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable the following services:
   - Authentication (Email/Password provider)
   - Firestore Database
   - Cloud Storage
   - Cloud Functions (optional for now)
   - Cloud Messaging (for push notifications)

3. Get your Firebase configuration from Project Settings > General > Your apps > Web app

4. Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

5. Fill in your Firebase credentials in the `.env` file:

```env
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Set Up Firestore Security Rules

1. Go to Firestore Database in Firebase Console
2. Navigate to the "Rules" tab
3. Copy and paste the rules from `firestore.rules` file
4. Publish the rules

### 5. Set Up Storage Security Rules

1. Go to Storage in Firebase Console
2. Navigate to the "Rules" tab
3. Copy and paste the rules from `storage.rules` file
4. Publish the rules

### 6. Run the Application

#### For Mobile Development (iOS/Android)

```bash
# Start the Expo development server
npm start

# Or run directly on a platform
npm run android  # For Android
npm run ios      # For iOS (macOS only)
```

#### For Web Development (PWA)

```bash
npm run web
```

The app will open in your default browser at `http://localhost:19006`

## Project Structure

```
eep-annual-event-app/
├── App.js                      # Main application entry point
├── app.json                    # Expo configuration
├── package.json                # Dependencies and scripts
├── babel.config.js             # Babel configuration
├── firebase.json               # Firebase configuration
├── .env.example                # Environment variables template
├── src/
│   ├── components/
│   │   └── common/             # Reusable UI components
│   │       ├── Button.js
│   │       ├── Card.js
│   │       ├── Input.js
│   │       └── Loading.js
│   ├── screens/
│   │   ├── auth/               # Authentication screens
│   │   │   ├── LoginScreen.js
│   │   │   ├── RegisterScreen.js
│   │   │   └── ProfileSetupScreen.js
│   │   ├── schedule/           # Schedule screens
│   │   ├── speakers/           # Speaker screens
│   │   ├── networking/         # Networking screens
│   │   ├── info/               # Information screens
│   │   └── profile/            # Profile screens
│   ├── navigation/
│   │   ├── AppNavigator.js     # Main navigation router
│   │   ├── AuthNavigator.js    # Authentication flow
│   │   └── TabNavigator.js     # Bottom tab navigation
│   ├── services/
│   │   └── firebase/           # Firebase services
│   │       ├── config.js       # Firebase initialization
│   │       ├── auth.js         # Authentication functions
│   │       ├── firestore.js    # Database functions
│   │       ├── storage.js      # Storage functions
│   │       └── messaging.js    # Push notifications
│   ├── context/                # React Context providers
│   │   ├── AuthContext.js
│   │   ├── ScheduleContext.js
│   │   └── NetworkingContext.js
│   ├── utils/
│   │   ├── constants.js        # App constants and theme
│   │   ├── helpers.js          # Utility functions
│   │   └── validators.js       # Form validation schemas
│   └── assets/                 # Static assets
├── functions/                  # Firebase Cloud Functions
│   ├── index.js
│   ├── package.json
│   └── src/
│       ├── notifications.js
│       ├── voting.js
│       └── messaging.js
└── web/                        # PWA specific files
    ├── index.html
    ├── manifest.json
    └── service-worker.js
```

## Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device
- `npm run web` - Run as web application
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Firebase Collections

### Users Collection
```javascript
{
  uid: string,
  email: string,
  displayName: string,
  organization: string,
  phone: string,
  dietaryPreferences: string,
  emergencyContact: string,
  profilePicture: string,
  myAgenda: array,
  connections: array,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Sessions Collection
```javascript
{
  id: string,
  title: string,
  description: string,
  speakerId: string,
  date: string,
  startTime: timestamp,
  endTime: timestamp,
  location: string,
  track: string,
  tags: array
}
```

### Speakers Collection
```javascript
{
  id: string,
  name: string,
  bio: string,
  photo: string,
  organization: string,
  voteCount: number
}
```

## Development Phases

- **Phase 1** ✅: Project setup, authentication, basic navigation (CURRENT)
- **Phase 2**: Schedule management, session details
- **Phase 3**: Speaker profiles and voting
- **Phase 4**: Networking and messaging
- **Phase 5**: Information hub, notifications
- **Phase 6**: Admin dashboard, analytics
- **Phase 7**: Testing, optimization, deployment

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Support

For support, email support@foundationeep.org or visit [https://www.foundationeep.org/](https://www.foundationeep.org/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Foundation for Economic Education and Peace
- All contributors and maintainers
- The React Native and Expo communities
