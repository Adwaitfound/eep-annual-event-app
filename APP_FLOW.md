# Application Flow Diagram

This document provides visual representations of the application flow.

## User Journey

```
┌─────────────────────────────────────────────────────────────────────┐
│                         APP LAUNCH                                  │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Check Auth      │
                    │  State           │
                    └──────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │                           │
                ▼                           ▼
    ┌──────────────────┐        ┌──────────────────┐
    │ NOT              │        │ AUTHENTICATED    │
    │ AUTHENTICATED    │        │                  │
    └──────────────────┘        └──────────────────┘
                │                           │
                ▼                           ▼
    ┌──────────────────┐        ┌──────────────────┐
    │ Login Screen     │        │ Check Profile    │
    │                  │        │ Complete?        │
    └──────────────────┘        └──────────────────┘
                │                           │
        ┌───────┴───────┐       ┌──────────┼──────────┐
        │               │       │                     │
        ▼               ▼       ▼                     ▼
    ┌─────┐      ┌──────────┐  ┌──────────┐   ┌──────────┐
    │Login│      │Register  │  │Profile   │   │Main App  │
    │     │      │          │  │Setup     │   │(Tabs)    │
    └─────┘      └──────────┘  └──────────┘   └──────────┘
        │               │           │               │
        └───────┬───────┘           │               │
                │                   │               │
                └────────┬──────────┘               │
                         │                          │
                         └──────────────────────────┘
```

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                      AUTHENTICATION FLOW                            │
└─────────────────────────────────────────────────────────────────────┘

New User Path:
══════════════
LoginScreen → "Sign Up" → RegisterScreen → Enter Details → Create Account
     ↓
Firebase Auth creates user
     ↓
Cloud Function creates user profile
     ↓
ProfileSetupScreen (complete additional info)
     ↓
Main App (Tabs)

Existing User Path:
═══════════════════
LoginScreen → Enter Credentials → Firebase Auth validates → Main App

Password Reset:
══════════════
LoginScreen → "Forgot Password" → Email sent → Reset via link
```

## Main App Navigation

```
┌─────────────────────────────────────────────────────────────────────┐
│                         MAIN APP TABS                               │
└─────────────────────────────────────────────────────────────────────┘

        Schedule    Speakers    Network     Info      Profile
           │           │          │          │           │
           ▼           ▼          ▼          ▼           ▼
    ┌──────────┐ ┌──────────┐ ┌────────┐ ┌──────┐ ┌──────────┐
    │Event     │ │Speaker   │ │Connect │ │Event │ │User      │
    │Sessions  │ │List      │ │with    │ │Info  │ │Info      │
    │          │ │          │ │Others  │ │      │ │          │
    ├──────────┤ ├──────────┤ ├────────┤ ├──────┤ ├──────────┤
    │• Day     │ │• Browse  │ │• QR    │ │• FAQ │ │• Name    │
    │  Filter  │ │• Vote    │ │  Code  │ │• Map │ │• Email   │
    │• Track   │ │• Message │ │• Chat  │ │• Docs│ │• Org     │
    │  Filter  │ │• Profile │ │• List  │ │      │ │• Edit    │
    │• My      │ │          │ │        │ │      │ │• Logout  │
    │  Agenda  │ │          │ │        │ │      │ │          │
    └──────────┘ └──────────┘ └────────┘ └──────┘ └──────────┘
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                          DATA FLOW                                  │
└─────────────────────────────────────────────────────────────────────┘

Screen Component
       │
       │ useContext
       ▼
Context Provider (AuthContext, ScheduleContext, NetworkingContext)
       │
       │ Firebase Service Functions
       ▼
Firebase SDK
       │
       ├─────────────┬─────────────┬─────────────┐
       │             │             │             │
       ▼             ▼             ▼             ▼
   Firebase      Firestore     Storage      Cloud
   Auth          Database                  Functions
       │             │             │             │
       └─────────────┴─────────────┴─────────────┘
                     │
                     ▼
           Real-time Updates
                     │
                     ▼
          Context State Updated
                     │
                     ▼
         Components Re-render
```

## State Management

```
┌─────────────────────────────────────────────────────────────────────┐
│                      STATE MANAGEMENT                               │
└─────────────────────────────────────────────────────────────────────┘

Global State (Context API)
═══════════════════════════
┌────────────────────────────────────────────────────────────────┐
│ AuthContext                                                    │
│ ├── user (Firebase User object)                               │
│ ├── userProfile (Firestore user document)                     │
│ ├── loading                                                    │
│ └── error                                                      │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ ScheduleContext                                                │
│ ├── sessions (array)                                           │
│ ├── selectedDay                                                │
│ ├── selectedTrack                                              │
│ ├── loading                                                    │
│ └── getFilteredSessions()                                      │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ NetworkingContext                                              │
│ ├── participants (array)                                       │
│ ├── connections (array)                                        │
│ ├── loading                                                    │
│ ├── getConnectedUsers()                                        │
│ └── isConnected(userId)                                        │
└────────────────────────────────────────────────────────────────┘

Local State (useState)
══════════════════════
└── Form inputs, UI state, loading states in individual components
```

## Firebase Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      FIREBASE SERVICES                              │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                        AUTHENTICATION                            │
│  Email/Password  │  Google OAuth  │  Profile Management         │
└──────────────────────────────────────────────────────────────────┘
                              │
┌──────────────────────────────────────────────────────────────────┐
│                      FIRESTORE DATABASE                          │
│                                                                  │
│  Collections:                                                    │
│  ├── users         (user profiles)                              │
│  ├── sessions      (event sessions)                             │
│  ├── speakers      (speaker info)                               │
│  ├── votes         (speaker votes)                              │
│  ├── connections   (user connections)                           │
│  ├── messages      (chat messages)                              │
│  └── announcements (event news)                                 │
└──────────────────────────────────────────────────────────────────┘
                              │
┌──────────────────────────────────────────────────────────────────┐
│                       CLOUD STORAGE                              │
│  ├── profile-pictures/                                          │
│  ├── speaker-photos/                                            │
│  └── documents/                                                 │
└──────────────────────────────────────────────────────────────────┘
                              │
┌──────────────────────────────────────────────────────────────────┐
│                     CLOUD FUNCTIONS                              │
│  ├── createUserProfile      (onCreate user)                     │
│  ├── deleteUserData         (onDelete user)                     │
│  ├── sendSessionReminder    (scheduled)                         │
│  ├── sendAnnouncement       (onCreate announcement)             │
│  ├── updateVoteCount        (onWrite vote)                      │
│  ├── onNewMessage           (onCreate message)                  │
│  └── onConnectionRequest    (onCreate connection)               │
└──────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App
 └── AuthProvider
      └── ScheduleProvider
           └── NetworkingProvider
                └── AppNavigator
                     │
                     ├── AuthNavigator (if not authenticated)
                     │    ├── LoginScreen
                     │    └── RegisterScreen
                     │
                     ├── ProfileSetupScreen (if profile incomplete)
                     │
                     └── TabNavigator (if authenticated & complete)
                          ├── ScheduleScreen
                          ├── SpeakersListScreen
                          ├── ParticipantsScreen
                          ├── EventInfoScreen
                          └── ProfileScreen
```

## Security Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                       SECURITY LAYERS                               │
└─────────────────────────────────────────────────────────────────────┘

1. Client-Side Validation
   └── Formik + Yup schemas validate all inputs

2. Firebase Authentication
   └── Email/password verification, session management

3. Firestore Security Rules
   └── Server-side authorization checks
       ├── Users can read all documents
       ├── Users can only write their own data
       └── Admin operations via Cloud Functions only

4. Storage Security Rules
   └── File type and size restrictions
       ├── Only authenticated users can upload
       ├── Users can only write to their own folders
       └── Image files only for profile pictures

5. Cloud Functions
   └── Background tasks with admin privileges
       └── Validated and sanitized data
```

## Development Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT WORKFLOW                             │
└─────────────────────────────────────────────────────────────────────┘

1. Local Development
   npm install → npm start → Expo Dev Server → Test on device/browser

2. Make Changes
   Edit code → Hot reload → Test → Iterate

3. Quality Check
   npm run lint → npm run format → Manual testing

4. Deploy Functions (when ready)
   firebase deploy --only functions

5. Deploy Web (when ready)
   expo build:web → Firebase Hosting/Netlify

6. Build Mobile Apps (when ready)
   eas build → iOS/Android builds → Store submission
```
