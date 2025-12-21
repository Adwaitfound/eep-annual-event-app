# Setup Checklist

Use this checklist to ensure you've completed all setup steps correctly.

## Initial Setup

- [ ] Node.js (v18+) installed
- [ ] Git installed
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)

## Firebase Project Setup

### Create Project
- [ ] Created Firebase project at https://console.firebase.google.com/
- [ ] Project name chosen
- [ ] Google Analytics configured (optional)

### Enable Services
- [ ] **Authentication** enabled
  - [ ] Email/Password provider enabled
  - [ ] Google provider enabled (optional)
- [ ] **Firestore Database** created
  - [ ] Started in production mode
  - [ ] Security rules published
- [ ] **Cloud Storage** enabled
  - [ ] Security rules published
- [ ] **Cloud Messaging** enabled (optional for now)

### Get Configuration
- [ ] Web app created in Firebase project
- [ ] Configuration copied (API Key, Auth Domain, etc.)
- [ ] `.env` file created from `.env.example`
- [ ] Firebase credentials added to `.env`

## Security Rules Setup

### Firestore Rules
- [ ] Opened Firestore Rules tab
- [ ] Copied rules from `firestore.rules`
- [ ] Published rules
- [ ] Rules validated (no errors)

### Storage Rules
- [ ] Opened Storage Rules tab
- [ ] Copied rules from `storage.rules`
- [ ] Published rules
- [ ] Rules validated (no errors)

## Optional: Cloud Functions

- [ ] Firebase CLI installed (`npm install -g firebase-tools`)
- [ ] Logged into Firebase CLI (`firebase login`)
- [ ] Firebase project initialized (`firebase init`)
- [ ] Functions deployed (`firebase deploy --only functions`)

## Test the Application

### First Run
- [ ] App starts without errors (`npm start` or `npm run web`)
- [ ] No console errors in terminal
- [ ] Login screen displays correctly

### Authentication Test
- [ ] Can navigate to Register screen
- [ ] Can create a new account
- [ ] Email validation works
- [ ] Password validation works
- [ ] Account created in Firebase Authentication
- [ ] User profile created in Firestore

### Profile Setup Test
- [ ] Profile setup screen shows after registration
- [ ] All required fields validate correctly
- [ ] Profile can be saved
- [ ] Profile data appears in Firestore

### Main App Test
- [ ] All 5 tabs visible
- [ ] Can switch between tabs
- [ ] Profile tab shows user information
- [ ] Logout works correctly
- [ ] Can log back in

## Common Issues Resolved

### npm install fails
- [ ] Using Node.js v18 or higher
- [ ] `.npmrc` file exists
- [ ] Deleted `node_modules` and `package-lock.json` before retry

### Firebase connection errors
- [ ] `.env` file exists in project root
- [ ] All Firebase credentials correct
- [ ] No extra spaces in `.env` values
- [ ] App restarted after adding `.env`

### Authentication not working
- [ ] Email/Password provider enabled in Firebase
- [ ] Firestore rules published
- [ ] User collection exists in Firestore
- [ ] Network connection stable

### App won't start
- [ ] Port 19000-19006 not in use
- [ ] Cache cleared (`npx expo start -c`)
- [ ] All dependencies installed correctly

## Production Readiness (Future)

- [ ] All placeholder images replaced
- [ ] Brand colors updated in `constants.js`
- [ ] Error messages customized
- [ ] Privacy policy added
- [ ] Terms of service added
- [ ] App icons created
- [ ] Splash screen designed
- [ ] Push notification icons created

## Testing Checklist

- [ ] Can register new account
- [ ] Can login with existing account
- [ ] Can complete profile setup
- [ ] Can edit profile
- [ ] Can logout
- [ ] Profile data persists after logout
- [ ] All tabs accessible
- [ ] Navigation works smoothly

## Deployment Checklist (Future)

### Mobile Apps
- [ ] EAS Build configured
- [ ] iOS build successful
- [ ] Android build successful
- [ ] App Store listing prepared
- [ ] Google Play listing prepared

### PWA
- [ ] Web build created (`expo build:web`)
- [ ] Hosted on Firebase Hosting or Netlify
- [ ] Custom domain configured (optional)
- [ ] HTTPS enabled
- [ ] Service worker active

## Documentation Review

- [ ] Read `README.md`
- [ ] Read `QUICKSTART.md`
- [ ] Read `ARCHITECTURE.md`
- [ ] Read `CONTRIBUTING.md`
- [ ] Understand project structure

## Next Steps

After completing this checklist:

1. **Phase 2**: Add schedule management features
2. **Phase 3**: Add speaker profiles and voting
3. **Phase 4**: Add networking and messaging
4. **Phase 5**: Add notifications and info hub
5. **Phase 6**: Add admin dashboard
6. **Phase 7**: Testing and deployment

---

**Congratulations!** 🎉 If all items are checked, your development environment is ready and the app is running successfully!
