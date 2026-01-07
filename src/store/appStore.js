import { create } from 'zustand'
import { 
  getSchedule, 
  getSpeakers, 
  getParticipants,
  getEventInfo,
  subscribeToSchedule,
  registerForSession,
  unregisterFromSession,
  getUserRegistrations
} from '../services/firebase/firestore'

export const useAppStore = create((set, get) => ({
  schedule: [],
  speakers: [],
  participants: [],
  eventInfo: null,
  registeredSessions: [],
  loading: false,
  error: null,
  
  loadSchedule: async () => {
    try {
      set({ loading: true, error: null })
      const data = await getSchedule()
      set({ schedule: data, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
  
  loadSpeakers: async () => {
    try {
      set({ loading: true, error: null })
      const data = await getSpeakers()
      set({ speakers: data, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
  
  loadParticipants: async () => {
    try {
      set({ loading: true, error: null })
      const data = await getParticipants()
      set({ participants: data, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
  
  loadEventInfo: async () => {
    try {
      const data = await getEventInfo()
      set({ eventInfo: data })
    } catch (error) {
      // Silently fail - event info is optional
      set({ eventInfo: null })
    }
  },
  
  subscribeToScheduleUpdates: () => {
    return subscribeToSchedule({ orderBy: { field: 'startTime', direction: 'asc' } }, (data) => {
      set({ schedule: data })
    })
  },
  
  loadUserRegistrations: async (userId) => {
    try {
      const registrations = await getUserRegistrations(userId)
      set({ registeredSessions: registrations })
    } catch (error) {
      console.error('Load registrations error:', error)
    }
  },
  
  registerForEvent: async (userId, sessionId) => {
    try {
      await registerForSession(userId, sessionId)
      const registeredSessions = get().registeredSessions
      set({ registeredSessions: [...registeredSessions, sessionId] })
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },
  
  unregisterFromEvent: async (userId, sessionId) => {
    try {
      await unregisterFromSession(userId, sessionId)
      const registeredSessions = get().registeredSessions.filter(id => id !== sessionId)
      set({ registeredSessions })
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },
  
  clearError: () => set({ error: null })
}))
