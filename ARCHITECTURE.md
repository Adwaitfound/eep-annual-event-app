# Architecture Overview

This document provides an overview of the EEP Annual Event App architecture.

## Technology Stack

### Frontend
- **React Native**: Cross-platform mobile development
- **Expo**: Development toolchain and managed workflow
- **React Navigation**: Navigation library (Stack & Bottom Tabs)
- **React Context API**: Global state management
- **Formik + Yup**: Form handling and validation

### Backend
- **Firebase Authentication**: User authentication
- **Cloud Firestore**: NoSQL database
- **Cloud Storage**: File storage
- **Cloud Functions**: Serverless backend logic
- **Cloud Messaging**: Push notifications

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **NPM**: Package management

## Application Architecture

### Three-Layer Architecture

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Screens, Components, Navigation)      │
└─────────────────────────────────────────┘
              ↓ ↑
┌─────────────────────────────────────────┐
│          Business Logic Layer           │
│     (Context, Utils, Validators)        │
└─────────────────────────────────────────┘
              ↓ ↑
┌─────────────────────────────────────────┐
│           Data Layer                    │
│  (Firebase Services, Cloud Functions)   │
└─────────────────────────────────────────┘
```

## Directory Structure Explained

### `/src/components/`
Reusable UI components organized by feature:
- `common/`: Shared components used throughout the app
- `schedule/`: Schedule-specific components (future)
- `speaker/`: Speaker-specific components (future)
- `networking/`: Networking-specific components (future)

### `/src/screens/`
Full-page views organized by feature:
- `auth/`: Authentication screens (Login, Register, Profile Setup)
- `schedule/`: Schedule-related screens
- `speakers/`: Speaker-related screens
- `networking/`: Networking-related screens
- `info/`: Event information screens
- `profile/`: User profile screens

### `/src/navigation/`
Navigation configuration:
- `AppNavigator.js`: Main navigation router, handles auth state
- `AuthNavigator.js`: Stack navigator for auth flow
- `TabNavigator.js`: Bottom tab navigator for main app

### `/src/context/`
Global state management using React Context:
- `AuthContext.js`: User authentication state
- `ScheduleContext.js`: Event schedule state
- `NetworkingContext.js`: Networking/connections state

### `/src/services/`
External service integrations:
- `firebase/`: Firebase SDK wrappers
  - `config.js`: Firebase initialization
  - `auth.js`: Authentication functions
  - `firestore.js`: Database operations
  - `storage.js`: File upload/download
  - `messaging.js`: Push notifications
- `api/`: API clients (future)

### `/src/utils/`
Utility functions and helpers:
- `constants.js`: App-wide constants (colors, fonts, etc.)
- `helpers.js`: Helper functions (date formatting, etc.)
- `validators.js`: Form validation schemas

### `/functions/`
Firebase Cloud Functions:
- `index.js`: Function exports
- `src/notifications.js`: Notification functions
- `src/voting.js`: Speaker voting functions
- `src/messaging.js`: Messaging functions

### `/web/`
Progressive Web App files:
- `index.html`: Entry point for web app
- `manifest.json`: PWA manifest
- `service-worker.js`: Offline functionality

## Data Flow

### Authentication Flow
```
User Input (Login/Register)
    ↓
LoginScreen/RegisterScreen
    ↓
Firebase Auth Service
    ↓
AuthContext updates
    ↓
AppNavigator re-renders
    ↓
Navigate to appropriate screen
```

### Data Fetching Flow
```
Screen Component
    ↓
Context (useSchedule, useNetworking, etc.)
    ↓
Firestore Service
    ↓
Firebase Firestore
    ↓
Real-time updates via onSnapshot
    ↓
Context state updated
    ↓
Components re-render
```

## State Management Strategy

### Local State (useState)
Used for:
- Form inputs
- Loading states
- UI state (modals, dropdowns)

### Context State (useContext)
Used for:
- User authentication
- Global app data (sessions, speakers)
- User preferences

### Server State (Firebase)
Used for:
- User profiles
- Event data
- Messages and connections

## Authentication Flow Details

1. **Unauthenticated**: Show `AuthNavigator` (Login/Register)
2. **Authenticated but incomplete profile**: Show `ProfileSetupScreen`
3. **Authenticated with complete profile**: Show `TabNavigator` (main app)

## Firebase Security

### Firestore Rules
- Users can read all documents
- Users can only write their own data
- Admin operations restricted to Cloud Functions

### Storage Rules
- Users can upload to their own profile picture folder
- File size limits enforced
- Only image files allowed for profile pictures

## Cloud Functions

### Triggers
- **onCreate**: Run when new documents created
- **onWrite**: Run when documents created/updated/deleted
- **Scheduled**: Run at specific intervals
- **HTTPS**: Callable functions via HTTP

### Key Functions
1. **createUserProfile**: Auto-create user profile on signup
2. **deleteUserData**: Cleanup on account deletion
3. **sendSessionReminder**: Scheduled session reminders
4. **updateSpeakerVoteCount**: Real-time vote counting
5. **onNewMessage**: Message notifications

## Component Design Principles

### Composition
- Small, focused components
- Reusable across features
- Props for customization

### Separation of Concerns
- Presentational components (UI only)
- Container components (data + logic)
- Service layer (API calls)

### Error Handling
- Try-catch in async operations
- User-friendly error messages
- Graceful degradation

## Performance Considerations

### Optimization Strategies
1. **Lazy Loading**: Load screens on-demand
2. **Memoization**: Cache computed values
3. **Debouncing**: Limit rapid function calls
4. **Image Optimization**: Resize and compress images
5. **Firestore Indexing**: Optimize queries

### Real-time Updates
- Use Firestore snapshots for live data
- Automatic synchronization across devices
- Offline support with local cache

## PWA Features

### Service Worker
- Cache static assets
- Offline functionality
- Background sync (future)

### Web Manifest
- Install to home screen
- Standalone app experience
- Custom splash screen

## Security Best Practices

1. **Environment Variables**: Sensitive config in .env
2. **Security Rules**: Firestore and Storage rules
3. **Input Validation**: Both client and server-side
4. **Authentication**: Required for all operations
5. **HTTPS Only**: Enforced by Firebase

## Future Enhancements

### Phase 2
- Schedule management
- Session details and filtering
- Personal agenda builder

### Phase 3
- Speaker profiles and voting
- Real-time vote tracking

### Phase 4
- Networking features
- In-app messaging
- QR code connections

### Phase 5
- Push notifications
- Calendar integration
- Document downloads

### Phase 6
- Admin dashboard
- Analytics
- Content management

## Testing Strategy (Future)

### Unit Tests
- Utility functions
- Validation schemas
- Business logic

### Integration Tests
- Firebase operations
- Context providers
- Navigation flows

### E2E Tests
- Critical user flows
- Authentication
- Data operations

## Deployment

### Mobile Apps
- **Android**: Google Play Store via EAS Build
- **iOS**: App Store via EAS Build

### Web App
- **PWA**: Firebase Hosting or Netlify
- **CI/CD**: GitHub Actions

## Support and Resources

- **Firebase Console**: https://console.firebase.google.com/
- **Expo Documentation**: https://docs.expo.dev/
- **React Navigation**: https://reactnavigation.org/
- **Foundation EEP**: https://www.foundationeep.org/
