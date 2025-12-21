const functions = require('firebase-functions');
const admin = require('firebase-admin');

/**
 * Send session reminder notifications
 * Triggered 15 minutes before a session starts
 */
exports.sendSessionReminder = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    const reminderTime = new Date(now.toDate().getTime() + 15 * 60000); // 15 minutes from now

    try {
      // Get sessions starting in 15 minutes
      const sessionsSnapshot = await admin.firestore()
        .collection('sessions')
        .where('startTime', '>=', now)
        .where('startTime', '<=', admin.firestore.Timestamp.fromDate(reminderTime))
        .get();

      if (sessionsSnapshot.empty) {
        console.log('No upcoming sessions');
        return null;
      }

      // For each session, send notifications to users who have it in their agenda
      const notificationPromises = [];
      
      for (const sessionDoc of sessionsSnapshot.docs) {
        const session = sessionDoc.data();
        
        // Get users who have this session in their agenda
        const usersSnapshot = await admin.firestore()
          .collection('users')
          .where('myAgenda', 'array-contains', sessionDoc.id)
          .get();

        for (const userDoc of usersSnapshot.docs) {
          const user = userDoc.data();
          
          // Send notification if user has a push token
          if (user.pushToken) {
            const message = {
              notification: {
                title: 'Session Reminder',
                body: `${session.title} starts in 15 minutes!`,
              },
              data: {
                sessionId: sessionDoc.id,
                type: 'session_reminder',
              },
              token: user.pushToken,
            };
            
            notificationPromises.push(admin.messaging().send(message));
          }
        }
      }

      await Promise.all(notificationPromises);
      console.log(`Sent ${notificationPromises.length} session reminders`);
      return null;
    } catch (error) {
      console.error('Error sending session reminders:', error);
      return null;
    }
  });

/**
 * Send announcement notification to all users
 */
exports.sendAnnouncementNotification = functions.firestore
  .document('announcements/{announcementId}')
  .onCreate(async (snap, context) => {
    const announcement = snap.data();

    try {
      // Get all users with push tokens
      const usersSnapshot = await admin.firestore()
        .collection('users')
        .where('pushToken', '!=', null)
        .get();

      const notificationPromises = usersSnapshot.docs.map((userDoc) => {
        const user = userDoc.data();
        
        const message = {
          notification: {
            title: 'New Announcement',
            body: announcement.title,
          },
          data: {
            announcementId: snap.id,
            type: 'announcement',
          },
          token: user.pushToken,
        };
        
        return admin.messaging().send(message);
      });

      await Promise.all(notificationPromises);
      console.log(`Sent ${notificationPromises.length} announcement notifications`);
      return null;
    } catch (error) {
      console.error('Error sending announcement notifications:', error);
      return null;
    }
  });
