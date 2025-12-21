import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  addDoc,
} from 'firebase/firestore';
import { db } from './config';
import { COLLECTIONS } from '../../utils/constants';

/**
 * Create a new document in a collection
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID (optional)
 * @param {Object} data - Document data
 * @returns {Promise}
 */
export const createDocument = async (collectionName, data, docId = null) => {
  try {
    const timestamp = serverTimestamp();
    const docData = {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    
    if (docId) {
      await setDoc(doc(db, collectionName, docId), docData);
      return docId;
    } else {
      const docRef = await addDoc(collection(db, collectionName), docData);
      return docRef.id;
    }
  } catch (error) {
    console.error('Create document error:', error);
    throw error;
  }
};

/**
 * Get a document by ID
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @returns {Promise<Object>} Document data
 */
export const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Get document error:', error);
    throw error;
  }
};

/**
 * Update a document
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @param {Object} updates - Updates to apply
 * @returns {Promise}
 */
export const updateDocument = async (collectionName, docId, updates) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Update document error:', error);
    throw error;
  }
};

/**
 * Delete a document
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @returns {Promise}
 */
export const deleteDocument = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error) {
    console.error('Delete document error:', error);
    throw error;
  }
};

/**
 * Get all documents from a collection
 * @param {string} collectionName - Collection name
 * @param {Object} options - Query options (where, orderBy, limit)
 * @returns {Promise<Array>} Array of documents
 */
export const getDocuments = async (collectionName, options = {}) => {
  try {
    let q = collection(db, collectionName);
    
    // Apply query constraints
    const constraints = [];
    
    if (options.where) {
      options.where.forEach(([field, operator, value]) => {
        constraints.push(where(field, operator, value));
      });
    }
    
    if (options.orderBy) {
      constraints.push(orderBy(options.orderBy.field, options.orderBy.direction || 'asc'));
    }
    
    if (options.limit) {
      constraints.push(limit(options.limit));
    }
    
    if (constraints.length > 0) {
      q = query(q, ...constraints);
    }
    
    const querySnapshot = await getDocs(q);
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    
    return documents;
  } catch (error) {
    console.error('Get documents error:', error);
    throw error;
  }
};

/**
 * Listen to document changes
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export const subscribeToDocument = (collectionName, docId, callback) => {
  const docRef = doc(db, collectionName, docId);
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    } else {
      callback(null);
    }
  });
};

/**
 * Listen to collection changes
 * @param {string} collectionName - Collection name
 * @param {Object} options - Query options
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export const subscribeToCollection = (collectionName, options = {}, callback) => {
  let q = collection(db, collectionName);
  
  // Apply query constraints
  const constraints = [];
  
  if (options.where) {
    options.where.forEach(([field, operator, value]) => {
      constraints.push(where(field, operator, value));
    });
  }
  
  if (options.orderBy) {
    constraints.push(orderBy(options.orderBy.field, options.orderBy.direction || 'asc'));
  }
  
  if (options.limit) {
    constraints.push(limit(options.limit));
  }
  
  if (constraints.length > 0) {
    q = query(q, ...constraints);
  }
  
  return onSnapshot(q, (querySnapshot) => {
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    callback(documents);
  });
};

// User-specific functions
export const createUserProfile = (userId, data) => {
  return createDocument(COLLECTIONS.USERS, data, userId);
};

export const getUserProfile = (userId) => {
  return getDocument(COLLECTIONS.USERS, userId);
};

export const updateUserProfile = (userId, updates) => {
  return updateDocument(COLLECTIONS.USERS, userId, updates);
};

// Session-specific functions
export const getSessions = (options) => {
  return getDocuments(COLLECTIONS.SESSIONS, options);
};

export const getSession = (sessionId) => {
  return getDocument(COLLECTIONS.SESSIONS, sessionId);
};

export const subscribeToSessions = (options, callback) => {
  return subscribeToCollection(COLLECTIONS.SESSIONS, options, callback);
};

// Speaker-specific functions
export const getSpeakers = (options) => {
  return getDocuments(COLLECTIONS.SPEAKERS, options);
};

export const getSpeaker = (speakerId) => {
  return getDocument(COLLECTIONS.SPEAKERS, speakerId);
};
