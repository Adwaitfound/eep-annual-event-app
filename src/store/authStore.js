import { create } from 'zustand'
import { onAuthChange, signUp, signIn, logOut } from '../services/firebase/auth'
import { createUserProfile } from '../services/firebase/firestore'

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,
  
  initializeAuth: () => {
    const unsubscribe = onAuthChange((user) => {
      set({ user, loading: false })
    })
    return unsubscribe
  },
  
  register: async (email, password, displayName, phone) => {
    try {
      set({ loading: true, error: null })
      const trimmedPhone = phone?.trim()
      if (!trimmedPhone) {
        throw new Error('Phone number is required to complete sign up')
      }

      const userCredential = await signUp(email, password, displayName)
      const createdUser = userCredential.user

      await createUserProfile(createdUser.uid, {
        email: createdUser.email,
        displayName: createdUser.displayName || displayName,
        phone: trimmedPhone,
        role: 'participant',
      })

      set({ user: createdUser, loading: false })
      return createdUser
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },
  
  login: async (email, password) => {
    try {
      set({ loading: true, error: null })
      const userCredential = await signIn(email, password)
      set({ user: userCredential.user, loading: false })
      return userCredential.user
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },
  
  logout: async () => {
    try {
      set({ loading: true, error: null })
      await logOut()
      set({ user: null, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },
  
  clearError: () => set({ error: null })
}))
