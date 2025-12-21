import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './config';

/**
 * Sign up a new user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} displayName - User display name
 * @returns {Promise} Firebase user credential
 */
export const signUp = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    
    return userCredential;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

/**
 * Sign in existing user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Firebase user credential
 */
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

/**
 * Sign out current user
 * @returns {Promise}
 */
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @returns {Promise}
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

/**
 * Update user profile
 * @param {Object} updates - Profile updates (displayName, photoURL)
 * @returns {Promise}
 */
export const updateUserProfile = async (updates) => {
  try {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, updates);
    }
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

/**
 * Get current user
 * @returns {Object|null} Current user or null
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Listen to auth state changes
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Get error message from Firebase auth error code
 * @param {string} errorCode - Firebase error code
 * @returns {string} User-friendly error message
 */
export const getAuthErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/operation-not-allowed': 'Operation not allowed.',
    'auth/weak-password': 'Password is too weak. Please use a stronger password.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
  };
  
  return errorMessages[errorCode] || 'An error occurred. Please try again.';
};
