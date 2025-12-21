const functions = require('firebase-functions');
const admin = require('firebase-admin');

/**
 * Update speaker vote count when a vote is added or removed
 */
exports.updateSpeakerVoteCount = functions.firestore
  .document('votes/{voteId}')
  .onWrite(async (change, context) => {
    const voteData = change.after.exists ? change.after.data() : null;
    const previousVoteData = change.before.exists ? change.before.data() : null;

    try {
      // Vote was created
      if (!previousVoteData && voteData) {
        await admin.firestore()
          .collection('speakers')
          .doc(voteData.speakerId)
          .update({
            voteCount: admin.firestore.FieldValue.increment(1),
          });
        console.log(`Incremented vote count for speaker ${voteData.speakerId}`);
      }

      // Vote was deleted
      if (previousVoteData && !voteData) {
        await admin.firestore()
          .collection('speakers')
          .doc(previousVoteData.speakerId)
          .update({
            voteCount: admin.firestore.FieldValue.increment(-1),
          });
        console.log(`Decremented vote count for speaker ${previousVoteData.speakerId}`);
      }

      return null;
    } catch (error) {
      console.error('Error updating speaker vote count:', error);
      return null;
    }
  });

/**
 * Prevent duplicate votes
 * This is a callable function to create a vote with validation
 */
exports.createVote = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to vote'
    );
  }

  const { speakerId } = data;
  const userId = context.auth.uid;

  try {
    // Check if user has already voted for this speaker
    const existingVote = await admin.firestore()
      .collection('votes')
      .where('userId', '==', userId)
      .where('speakerId', '==', speakerId)
      .get();

    if (!existingVote.empty) {
      throw new functions.https.HttpsError(
        'already-exists',
        'You have already voted for this speaker'
      );
    }

    // Create the vote
    const voteRef = await admin.firestore().collection('votes').add({
      userId,
      speakerId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, voteId: voteRef.id };
  } catch (error) {
    console.error('Error creating vote:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});
