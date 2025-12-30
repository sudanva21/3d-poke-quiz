# 3D Poké Quiz - Trainer's Manual

**Welcome, Trainer!**  
This document serves as your official guide to navigating the 3D Poké Quiz world. Whether you are here to test your algorithm skills or show off your web development knowledge, this manual will help you become a Pokémon Tech Master.

---

## 🚀 Getting Started

### 1. The Hub (3D Scene)
When you first enter the application, you are greeted by the **3D Poké Hub**.
- **Desktop**: 
    - **Scroll Down/Up** on your mouse wheel to rotate the Poké Ball and reveal different menu segments.
    - **Click** on glowing menu items (e.g., "QUIZ", "ABOUT") to open them.
- **Mobile**:
    - The experience is fully optimized for touch.
    - **Swipe** up/down to rotate the ball.
    - **Tap** on segments to navigate.

### 2. The Profile System
Your profile is your identity card in this league.
- **Accessing Profile**: Click on the **central button** of the 3D Poké Ball to open your Trainer Card.
- **Trainer Name**: 
    - Your name is displayed at the top.
    - **Edit Name**: Click the **pencil icon** next to your name to change it. Your new name is automatically saved to the cloud.
- **Stats & Rank**:
    - Your rank (e.g., Rookie, Veteran, Elite) is determined by the total number of quizzes you have completed.
    - **Mastery Bars**: These 5 colorful bars show your performance in specific domains (DSA, CS, Frontend, Backend, General).

**Navigation Tip**: To close the profile, simply click the **"X"** button or the **"Back to Hub"** button in the top-left corner.

---

## ⚡ Taking Quizzes

To start a battle of wits, follow these steps:
1.  Navigate to the **QUIZ** section from the main hub.
2.  **Select a Gym**: Choose from the available domains:
    -   🟡 **DSA (Algorithm Gym)**: Data Structures & Algorithms.
    -   🔵 **CS (System Gym)**: Operating Systems & Architecture.
    -   💠 **WEB (Frontend Gym)**: HTML, CSS, JavaScript & React.
    -   🟢 **SYS (Backend Gym)**: Databases, Node.js & APIs.
    -   ⚪ **WOW (General Gym)**: Tech Trivia & History.
3.  **The Battle**:
    -   You have **15 seconds** per question.
    -   Select the correct answer from the choices.
    -   **Hints**: Stuck? Click "Show Hint" for a clue (note: real trainers try without hints first!).
4.  **Results**:
    -   At the end, your score is displayed.
    -   Your performance is **instantly saved to the database** and updates your Profile Mastery Bars.

---

## 🛠️ Special Features

This isn't just a website; it's a modern web experience. Here are some of the technical features implemented:

### 📱 Responsive 3D Engine
The application uses **Three.js** to render a real-time 3D environment.
- On **Mobile**, the engine automatically adjusts the field of view and reduces the model size to ensure perfect visibility and performance on smaller screens.

### ☁️ Cloud Sync (Firebase)
- **Real-time Database**: Your scores, rank, and profile name are stored securely in the cloud.
- **Cross-Device**: Login on your phone, tablet, or desktop, and your progress follows you everywhere.

### ✨ Immersive UI
- **Glassmorphism**: The UI uses modern glass-like aesthetics for a premium feel.
- **Particle Effects**: Dynamic background particles react to your quizzes and navigation.
- **Holo-Theme**: The entire interface follows a consistent futuristic/holographic design language.

---

## ⚠️ Troubleshooting

- **"Logins not saving?"**: Ensure you have an active internet connection as the app communicates directly with the cloud database.
- **"3D too slow?"**: The app requires WebGL support. Most modern browsers (Chrome, Safari, Firefox) support this out of the box.

---

*Gotta Code 'Em All!*
**© 2024 Poké Quiz League**
