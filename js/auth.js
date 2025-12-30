import { auth, db } from './firebase-config.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const authService = {
    // Signup
    async signup(email, password, username) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update Display Name
            await updateProfile(user, { displayName: username });

            // Create User Document in Firestore
            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: email,
                createdAt: new Date().toISOString(),
                scores: []
            });

            return { success: true, user };
        } catch (error) {
            console.error("Signup Error:", error);
            return { success: false, message: error.message };
        }
    },

    // Login
    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            console.error("Login Error:", error);
            return { success: false, message: error.message };
        }
    },

    // Google Login
    async loginWithGoogle() {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user exists in Firestore, if not create doc
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    username: user.displayName,
                    email: user.email,
                    createdAt: new Date().toISOString(),
                    scores: []
                });
            }

            return { success: true, user };
        } catch (error) {
            console.error("Google Login Error:", error);
            return { success: false, message: error.message };
        }
    },

    // Logout
    async logout() {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            console.error("Logout Error:", error);
            return { success: false, message: error.message };
        }
    },

    // Update Username
    async updateUsername(newName) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("No user logged in");

            // 1. Update Auth Profile
            await updateProfile(user, { displayName: newName });

            // 2. Update Firestore Document
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { username: newName });

            return { success: true };
        } catch (error) {
            console.error("Update Profile Error:", error);
            return { success: false, message: error.message };
        }
    },

    // Auth State Monitor
    monitorAuth(callback) {
        onAuthStateChanged(auth, (user) => {
            callback(user);
        });
    },

    // Get Current User (Synchronous check possible if already initialized, generally use monitorAuth)
    getCurrentUser() {
        return auth.currentUser;
    }
};
