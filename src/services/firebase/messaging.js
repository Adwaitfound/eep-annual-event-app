import { messaging } from './config'
import { getToken, onMessage } from 'firebase/messaging'

let unsubscribe = null

export const initializeMessaging = async () => {
  try {
    if (!messaging) {
      console.log('Messaging not available')
      return null
    }

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
    })

    console.log('FCM Token:', token)

    unsubscribe = onMessage(messaging, payload => {
      console.log('Message received:', payload)
      if (Notification.permission === 'granted') {
        new Notification(payload.notification?.title || 'New message', {
          body: payload.notification?.body || 'You have a new message',
          icon: payload.notification?.image
        })
      }
    })

    return token
  } catch (error) {
    console.error('Error initializing messaging:', error)
    return null
  }
}

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      return await initializeMessaging()
    }
    return null
  } catch (error) {
    console.error('Error requesting permission:', error)
    return null
  }
}

export const cleanupMessaging = () => {
  if (unsubscribe) {
    unsubscribe()
  }
}
