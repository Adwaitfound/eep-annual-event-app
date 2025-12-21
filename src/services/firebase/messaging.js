import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Request notification permissions
 * @returns {Promise<boolean>} True if permissions granted
 */
export const requestNotificationPermissions = async () => {
  try {
    if (!Device.isDevice) {
      console.warn('Notifications only work on physical devices');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Failed to get push notification permissions');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Request notification permissions error:', error);
    return false;
  }
};

/**
 * Get push notification token
 * @returns {Promise<string|null>} Push token or null
 */
export const getPushToken = async () => {
  try {
    if (!Device.isDevice) {
      return null;
    }

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return null;
    }

    const token = await Notifications.getExpoPushTokenAsync({
      projectId: 'your-project-id', // Replace with your EAS project ID
    });

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token.data;
  } catch (error) {
    console.error('Get push token error:', error);
    return null;
  }
};

/**
 * Schedule a local notification
 * @param {Object} notification - Notification content
 * @param {Object} trigger - Notification trigger
 * @returns {Promise<string>} Notification ID
 */
export const scheduleNotification = async (notification, trigger) => {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        sound: true,
      },
      trigger,
    });
    return id;
  } catch (error) {
    console.error('Schedule notification error:', error);
    throw error;
  }
};

/**
 * Cancel a scheduled notification
 * @param {string} notificationId - Notification ID
 * @returns {Promise}
 */
export const cancelNotification = async (notificationId) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Cancel notification error:', error);
    throw error;
  }
};

/**
 * Cancel all scheduled notifications
 * @returns {Promise}
 */
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Cancel all notifications error:', error);
    throw error;
  }
};

/**
 * Add notification received listener
 * @param {Function} callback - Callback function
 * @returns {Object} Subscription object
 */
export const addNotificationReceivedListener = (callback) => {
  return Notifications.addNotificationReceivedListener(callback);
};

/**
 * Add notification response listener (when user taps notification)
 * @param {Function} callback - Callback function
 * @returns {Object} Subscription object
 */
export const addNotificationResponseListener = (callback) => {
  return Notifications.addNotificationResponseReceivedListener(callback);
};

/**
 * Schedule session reminder notification
 * @param {Object} session - Session object
 * @returns {Promise<string>} Notification ID
 */
export const scheduleSessionReminder = async (session) => {
  try {
    const reminderTime = new Date(session.startTime);
    reminderTime.setMinutes(reminderTime.getMinutes() - 15);

    // Only schedule if reminder time is in the future
    if (reminderTime > new Date()) {
      const id = await scheduleNotification(
        {
          title: 'Session Reminder',
          body: `${session.title} starts in 15 minutes`,
          data: { sessionId: session.id, type: 'session_reminder' },
        },
        { date: reminderTime }
      );
      return id;
    }
    return null;
  } catch (error) {
    console.error('Schedule session reminder error:', error);
    throw error;
  }
};
