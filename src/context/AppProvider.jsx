import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useAppStore } from '../store/appStore'

export const AppProvider = ({ children }) => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth)
  const loadEventInfo = useAppStore((state) => state.loadEventInfo)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const unsubscribeAuth = initializeAuth()
    loadEventInfo()
    setInitialized(true)
    
    return () => {
      if (unsubscribeAuth) unsubscribeAuth()
    }
  }, [initializeAuth, loadEventInfo])

  return children
}
