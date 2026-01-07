const functions = require('firebase-functions');
const admin = require('firebase-admin');

/**
 * Send notification when a new message is received
 */
exports.onNewMessage = functions.firestore
  .document('messages/{messageId}')
  .onCreate(async (snap) => {
    const message = snap.data();

    try {
      // Get receiver's profile to get push token
      const receiverDoc = await admin.firestore()
        .collection('users')
        .doc(message.receiverId)
        .get();

      if (!receiverDoc.exists) {
        console.log('Receiver not found');
        return null;
      }

      const receiver = receiverDoc.data();

      // Get sender's name
      const senderDoc = await admin.firestore()
        .collection('users')
        .doc(message.senderId)
        .get();

      const senderName = senderDoc.exists 
        ? senderDoc.data().displayName || 'Someone'
        : 'Someone';

      // Send notification if receiver has a push token
      if (receiver.pushToken) {
        const notification = {
          notification: {
            title: `New message from ${senderName}`,
            body: message.text || 'You have a new message',
          },
          data: {
            messageId: snap.id,
            senderId: message.senderId,
            type: 'new_message',
          },
          token: receiver.pushToken,
        };

        await admin.messaging().send(notification);
        console.log(`Sent message notification to ${message.receiverId}`);
      }

      return null;
    } catch (error) {
      console.error('Error sending message notification:', error);
      return null;
    }
  });

/**
 * Send notification when a connection request is received
 */
exports.onConnectionRequest = functions.firestore
  .document('connections/{connectionId}')
  .onCreate(async (snap) => {
    const connection = snap.data();

    // Only send notification for pending requests
    if (connection.status !== 'pending') {
      return null;
    }

    try {
      // Get receiver's profile to get push token
      const receiverDoc = await admin.firestore()
        .collection('users')
        .doc(connection.receiverId)
        .get();

      if (!receiverDoc.exists) {
        console.log('Receiver not found');
        return null;
      }

      const receiver = receiverDoc.data();

      // Get sender's name
      const senderDoc = await admin.firestore()
        .collection('users')
        .doc(connection.senderId)
        .get();

      const senderName = senderDoc.exists 
        ? senderDoc.data().displayName || 'Someone'
        : 'Someone';

      // Send notification if receiver has a push token
      if (receiver.pushToken) {
        const notification = {
          notification: {
            title: 'New Connection Request',
            body: `${senderName} wants to connect with you`,
          },
          data: {
            connectionId: snap.id,
            senderId: connection.senderId,
            type: 'connection_request',
          },
          token: receiver.pushToken,
        };

        await admin.messaging().send(notification);
        console.log(`Sent connection request notification to ${connection.receiverId}`);
      }

      return null;
    } catch (error) {
      console.error('Error sending connection request notification:', error);
      return null;
    }
  });
