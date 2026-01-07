import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { storage } from './config'

export const uploadFile = async (path, file, onProgress = null) => {
  try {
    const storageRef = ref(storage, path)
    
    if (onProgress) {
      const uploadTask = uploadBytesResumable(storageRef, file)
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            onProgress(progress)
          },
          (error) => {
            reject(error)
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
            resolve(downloadURL)
          }
        )
      })
    } else {
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)
      return downloadURL
    }
  } catch (error) {
    console.error('Upload file error:', error)
    throw error
  }
}

export const uploadProfilePicture = async (userId, file) => {
  return uploadFile(`profile-pictures/${userId}`, file)
}

export const deleteFile = async (path) => {
  try {
    const fileRef = ref(storage, path)
    await deleteObject(fileRef)
  } catch (error) {
    console.error('Delete file error:', error)
    throw error
  }
};

/**
 * Delete a file from Firebase Storage
 * @param {string} path - Storage path
 * @returns {Promise}
 */
export const deleteFile = async (path) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Delete file error:', error);
    throw error;
  }
};

/**
 * Get download URL for a file
 * @param {string} path - Storage path
 * @returns {Promise<string>} Download URL
 */
export const getFileURL = async (path) => {
  try {
    const storageRef = ref(storage, path);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Get file URL error:', error);
    throw error;
  }
};

/**
 * Upload profile picture
 * @param {string} userId - User ID
 * @param {Blob|File} file - Image file
 * @param {Function} onProgress - Progress callback (optional)
 * @returns {Promise<string>} Download URL
 */
export const uploadProfilePicture = async (userId, file, onProgress = null) => {
  const path = `profile-pictures/${userId}/${Date.now()}.jpg`;
  return uploadFile(path, file, onProgress);
};

/**
 * Delete profile picture
 * @param {string} url - Profile picture URL
 * @returns {Promise}
 */
export const deleteProfilePicture = async (url) => {
  try {
    // Extract path from URL
    const path = url.split('/o/')[1].split('?')[0];
    const decodedPath = decodeURIComponent(path);
    await deleteFile(decodedPath);
  } catch (error) {
    console.error('Delete profile picture error:', error);
    throw error;
  }
};
