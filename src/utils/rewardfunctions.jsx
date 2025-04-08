// E:\Blockchain project\EduX\src\utils\rewardfunctions.jsxx

import firestore from '@react-native-firebase/firestore';

/**
 * Records a quiz attempt for a given user and updates their total reward.
 *
 * @param {string} userId - The Firestore document ID for the user.
 * @param {string} courseId - The ID of the course.
 * @param {string} quizId - A unique identifier for the quiz.
 * @param {number} score - The score obtained in the quiz.
 * @returns {Promise<boolean>} - Resolves to true if the attempt was recorded successfully.
 */
export const recordQuizAttempt = async (userId, courseId, quizId, score) => {
  try {
    // Ensure score is a number; default to 0 if undefined or not a number.
    const validScore = typeof score === 'number' ? score : 0;
    const userRef = firestore().collection('users').doc(userId);
    
    // Prepare the quiz attempt data
    const quizAttempt = {
      score: validScore,
      timestamp: new Date().toISOString(),
      quizTaken: true,
    };

    // Use a transaction to safely update both the quizAttempts and reward fields
    await firestore().runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      let currentReward = 0;
      if (userDoc.exists) {
        const data = userDoc.data();
        if (typeof data.reward === 'number') {
          currentReward = data.reward;
        }
      }
      const newReward = currentReward + validScore;
      
      // Set the new quiz attempt and update the reward field
      transaction.set(
        userRef,
        {
          quizAttempts: {
            [courseId]: {
              [quizId]: quizAttempt,
            },
          },
          reward: newReward,
        },
        { merge: true }
      );
    });

    console.log("Quiz attempt recorded successfully for user:", userId);
    return true;
  } catch (error) {
    console.error("Error recording quiz attempt:", error);
    return false;
  }
};

/**
 * Checks if the user has already attempted a specific quiz.
 *
 * @param {string} userId - The Firestore document ID for the user.
 * @param {string} courseId - The ID of the course.
 * @param {string} quizId - A unique identifier for the quiz.
 * @returns {Promise<boolean>} - Resolves to true if the quiz has been attempted.
 */
export const hasQuizBeenAttempted = async (userId, courseId, quizId) => {
  try {
    const userRef = firestore().collection('users').doc(userId);
    const doc = await userRef.get();
    if (doc.exists) {
      const data = doc.data();
      if (data.quizAttempts && data.quizAttempts[courseId] && data.quizAttempts[courseId][quizId]) {
        console.log("Quiz attempt already exists for user:", userId);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Error checking quiz attempt:", error);
    return false;
  }
};
