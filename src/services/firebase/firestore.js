import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  setDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore'
import { db } from './config'

export const createDocument = async (collectionName, data, docId = null) => {
  try {
    const timestamp = serverTimestamp()
    const docData = {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    
    if (docId) {
      await setDoc(doc(db, collectionName, docId), docData)
      return docId
    } else {
      const docRef = await addDoc(collection(db, collectionName), docData)
      return docRef.id
    }
  } catch (error) {
    console.error('Create document error:', error)
    throw error
  }
}

export const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      return null
    }
  } catch (error) {
    console.error('Get document error:', error)
    throw error
  }
}

export const updateDocument = async (collectionName, docId, updates) => {
  try {
    const docRef = doc(db, collectionName, docId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('Update document error:', error)
    throw error
  }
}

export const deleteDocument = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId))
  } catch (error) {
    console.error('Delete document error:', error)
    throw error
  }
}

export const getDocuments = async (collectionName, options = {}) => {
  try {
    let q = collection(db, collectionName)
    
    const constraints = []
    
    if (options.where) {
      options.where.forEach(([field, operator, value]) => {
        constraints.push(where(field, operator, value))
      })
    }
    
    if (options.orderBy) {
      constraints.push(orderBy(options.orderBy.field, options.orderBy.direction || 'asc'))
    }
    
    if (options.limit) {
      constraints.push(limit(options.limit))
    }
    
    if (constraints.length > 0) {
      q = query(q, ...constraints)
    }
    
    const querySnapshot = await getDocs(q)
    const documents = []
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() })
    })
    
    return documents
  } catch (error) {
    console.error('Get documents error:', error)
    throw error
  }
}

export const subscribeToDocument = (collectionName, docId, callback) => {
  const docRef = doc(db, collectionName, docId)
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() })
    } else {
      callback(null)
    }
  })
}

export const subscribeToCollection = (collectionName, options = {}, callback) => {
  let q = collection(db, collectionName)
  
  const constraints = []
  
  if (options.where) {
    options.where.forEach(([field, operator, value]) => {
      constraints.push(where(field, operator, value))
    })
  }
  
  if (options.orderBy) {
    constraints.push(orderBy(options.orderBy.field, options.orderBy.direction || 'asc'))
  }
  
  if (options.limit) {
    constraints.push(limit(options.limit))
  }
  
  if (constraints.length > 0) {
    q = query(q, ...constraints)
  }
  
  return onSnapshot(q, (querySnapshot) => {
    const documents = []
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() })
    })
    callback(documents)
  })
}

// User-specific functions
export const createUserProfile = (userId, data) => {
  return createDocument('users', data, userId)
}

export const getUserProfile = (userId) => {
  return getDocument('users', userId)
}

export const updateUserProfile = (userId, updates) => {
  return updateDocument('users', userId, updates)
}

// Schedule-specific functions (using sessions collection)
export const getSchedule = (options = {}) => {
  return getDocuments('sessions', options)
}

export const getScheduleItem = (itemId) => {
  return getDocument('sessions', itemId)
}

export const subscribeToSchedule = (options, callback) => {
  return subscribeToCollection('sessions', options, callback)
}

// User registrations for sessions
export const registerForSession = async (userId, sessionId) => {
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)

    const payload = {
      registeredSessions: arrayUnion(sessionId),
      updatedAt: serverTimestamp(),
    }

    if (!userSnap.exists()) {
      payload.createdAt = serverTimestamp()
    }

    await setDoc(userRef, payload, { merge: true })
    return true
  } catch (error) {
    console.error('Register for session error:', error)
    throw error
  }
}

export const unregisterFromSession = async (userId, sessionId) => {
  try {
    const userRef = doc(db, 'users', userId)
    await setDoc(userRef, {
      registeredSessions: arrayRemove(sessionId),
      updatedAt: serverTimestamp(),
    }, { merge: true })
    return true
  } catch (error) {
    console.error('Unregister from session error:', error)
    throw error
  }
}

export const getUserRegistrations = async (userId) => {
  try {
    const userDoc = await getDocument('users', userId)
    return userDoc?.registeredSessions || []
  } catch (error) {
    console.error('Get user registrations error:', error)
    return []
  }
}

// Session feedback
export const submitSessionFeedback = async (userId, sessionId, { rating, comment, sessionTitle = '', sessionDate = null }) => {
  if (!userId || !sessionId) throw new Error('Missing userId or sessionId')
  const feedbackId = `${userId}_${sessionId}`
  const feedbackRef = doc(db, 'sessionFeedback', feedbackId)
  await setDoc(feedbackRef, {
    userId,
    sessionId,
    rating: Number(rating) || 0,
    comment: comment || '',
    sessionTitle,
    sessionDate,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  }, { merge: true })
  return feedbackId
}

// Speakers functions
export const getSpeakers = (options = {}) => {
  return getDocuments('speakers', options)
}

export const getSpeaker = (speakerId) => {
  return getDocument('speakers', speakerId)
}

// Participants functions
export const getParticipants = (options = {}) => {
  return getDocuments('users', options)
}

export const getEventInfo = async () => {
  try {
    const docRef = doc(db, 'event', 'info')
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? docSnap.data() : null
  } catch (error) {
    console.error('Get event info error:', error)
    throw error
  }
}

// Direct chat helpers
export const getOrCreateThread = async (userId, otherUserId) => {
  const threadKey = [userId, otherUserId].sort().join('_')
  const threadRef = doc(db, 'threads', threadKey)
  await setDoc(threadRef, {
    participants: [userId, otherUserId],
    updatedAt: serverTimestamp(),
  }, { merge: true })
  return threadKey
}

export const subscribeToThreadMessages = (threadId, callback) => {
  const messagesRef = collection(db, 'threads', threadId, 'messages')
  const q = query(messagesRef, orderBy('createdAt', 'asc'))
  return onSnapshot(q, (querySnapshot) => {
    const docs = []
    querySnapshot.forEach((doc) => {
      docs.push({ id: doc.id, ...doc.data() })
    })
    callback(docs)
  })
}

export const sendThreadMessage = async (threadId, message) => {
  const messagesRef = collection(db, 'threads', threadId, 'messages')
  const participants = [message.from, message.to].sort()
  await addDoc(messagesRef, {
    ...message,
    participants,
    createdAt: serverTimestamp(),
  })
  // Touch parent thread for ordering if needed later
  await updateDoc(doc(db, 'threads', threadId), { updatedAt: serverTimestamp() })
}

export function subscribeToUserThreads(userId, callback) {
  if (!userId) {
    callback([])
    return () => {}
  }

  const threadsRef = collection(db, 'threads')
  const q = query(
    threadsRef,
    where('participants', 'array-contains', userId)
  )

  return onSnapshot(q, (snapshot) => {
    const threads = snapshot.docs.map((docSnap) => {
      const threadData = docSnap.data()
      const otherUserId = threadData.participants.find(id => id !== userId)
      
      return {
        id: docSnap.id,
        ...threadData,
        otherUserId,
      }
    }).sort((a, b) => {
      const aTime = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : 0
      const bTime = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : 0
      return bTime - aTime
    })
    
    callback(threads)
  }, (error) => {
    console.error('Error fetching threads:', error)
    callback([])
  })
}
