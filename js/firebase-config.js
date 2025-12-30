// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCZaKfJhOniQfYrOUQFMYpL8MccyclDpgk",
    authDomain: "quiz-web8055.firebaseapp.com",
    projectId: "quiz-web8055",
    storageBucket: "quiz-web8055.firebasestorage.app",
    messagingSenderId: "492448939646",
    appId: "1:492448939646:web:476560713e06a08206e22f",
    measurementId: "G-LZTNCHJH5M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db, analytics };
