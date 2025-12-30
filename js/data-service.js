import { db, auth } from './firebase-config.js';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const dataService = {
    // 1. Fetch Quiz Data (from Firestore)
    async getQuiz(type) {
        try {
            const docRef = doc(db, 'quizzes', type);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data().questions;
            } else {
                console.warn(`No quiz found for type: ${type}`);
                return [];
            }
        } catch (error) {
            console.error("Error getting quiz:", error);
            return [];
        }
    },

    // 2. Save Score
    async saveScore(quizType, score, total) {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, 'users', user.uid);
        const newScore = {
            quizType,
            score,
            total,
            date: new Date().toISOString()
        };

        try {
            await updateDoc(userRef, {
                scores: arrayUnion(newScore)
            });
            console.log("Score saved!");
        } catch (error) {
            console.error("Error saving score:", error);
        }
    },

    // 3. Get User Profile (Scores)
    async getUserProfile(uid) {
        try {
            const userRef = doc(db, 'users', uid);
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                return docSnap.data();
            }
            return null;
        } catch (error) {
            console.error("Error loading profile:", error);
            return null;
        }
    },

    // TEMP: Seed Data Function
    async seedQuizzes(localData) {
        for (const [key, questions] of Object.entries(localData)) {
            await setDoc(doc(db, 'quizzes', key), {
                questions: questions
            });
            console.log(`Seeded ${key} quiz.`);
        }
    }
};
