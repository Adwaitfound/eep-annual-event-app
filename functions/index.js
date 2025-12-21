const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Import cloud functions
const { sendSessionReminder } = require('./src/notifications');
const { updateSpeakerVoteCount } = require('./src/voting');
const { onNewMessage } = require('./src/messaging');

// Export cloud functions
exports.sendSessionReminder = sendSessionReminder;
exports.updateSpeakerVoteCount = updateSpeakerVoteCount;
exports.onNewMessage = onNewMessage;

// Example: Create user profile on sign up
exports.createUserProfile = functions.auth.user().onCreate(async (user) => {
  const userProfile = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || '',
    profilePicture: user.photoURL || '',
    myAgenda: [],
    connections: [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  try {
    await admin.firestore().collection('users').doc(user.uid).set(userProfile);
    console.log(`User profile created for ${user.uid}`);
  } catch (error) {
    console.error('Error creating user profile:', error);
  }
});

// Example: Clean up user data on account deletion
exports.deleteUserData = functions.auth.user().onDelete(async (user) => {
  try {
    // Delete user profile
    await admin.firestore().collection('users').doc(user.uid).delete();
    
    // Delete user's votes
    const votesSnapshot = await admin.firestore()
      .collection('votes')
      .where('userId', '==', user.uid)
      .get();
    
    const deletePromises = votesSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
    
    console.log(`User data deleted for ${user.uid}`);
  } catch (error) {
    console.error('Error deleting user data:', error);
  }
});
