# 3D Poké Quiz 

> **Gotta Code 'Em All!**  
> *A 3D Gamified Learning Platform for Developers.*

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg) ![License](https://img.shields.io/badge/license-MIT-green.svg) ![Year](https://img.shields.io/badge/copyright-2025-lightgrey.svg)

## 📖 Overview

The **3D Poké Quiz** is an immersive, interactive web application designed to test and improve technical knowledge in a fun, gamified environment. Inspired by the Pokémon universe, it features a fully 3D navigable interface where "Trainers" (users) can explore different domains of computer science—from Algorithms (DSA) to System Design—and earn rankings based on their performance.

This project demonstrates the power of combining **3D Web Graphics** with **Real-time Cloud Architecture** to create engaging educational experiences.

---

## 🛠️ Tech Stack

This project is built using modern, performance-oriented web technologies:

### **Frontend Core**
-   **HTML5 & CSS3**: Semantic markup with a custom **Glassmorphism** design system.
-   **JavaScript (ES6+)**: Pure, modular Vanilla JS for maximum performance and zero build-step complexity.
-   **Three.js (r128)**: The core engine powering the 3D Poké Ball scene, lighting, and particle effects.

### **Backend & Cloud (Serverless)**
-   **Firebase Authentication**: Secure email/password and **Google One-Tap** login.
-   **Cloud Firestore**: NoSQL real-time database for storing:
    -   User Profiles (Ranks, Titles).
    -   Quiz Scores & Mastery Stats.
    -   Quiz Content (Questions, Options, Answers).
-   **Firebase Hosting**: Production-grade static asset hosting.

### **Design & Assets**
-   **Fonts**: *Outfit* (Google Fonts) for UI, *Press Start 2P* for retro gaming vibes.
-   **Icons**: FontAwesome 6.0.
-   **Responsiveness**: Custom media queries ensuring seamless experience from 4K Desktops to Mobile phones.

---

## 📂 Project Structure

```bash
📦 3D-Poke-Quiz
├── 📄 index.html          # Main Entry (3D Hub)
├── 📄 login.html          # Auth Portal (Glass UI)
├── 📄 profile.html        # User Dashboard (Stats & Edit)
├── 📂 css/
│   └── 🎨 style.css       # Global Styles & Animations
├── 📂 js/
│   ├── 🎮 main.js         # Three.js Scene Logic (The "Brain")
│   ├── 🔥 firebase-config.js # App Initialization
│   ├── 🔐 auth.js         # Auth wrappers (Login/Signup/Logout)
│   ├── 💾 data-service.js # Firestore CRUD operations
│   ├── 🧩 quiz-3d.js      # Quiz Logic & State Management
│   ├── 📝 quiz-data.js    # Initial seed data
│   └── 💻 ui.js           # DOM manipulation helpers
└── 📜 README.md           # You are here
```

---

## 🚀 Setup & Installation

Since this project uses **ES Modules** and **CORS-bound capabilities**, it requires a local server.

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/sudanva21/3d-poke-quiz.git
    cd 3d-poke-quiz
    ```

2.  **Run with Live Server**
    -   If using **VS Code**: Install the "Live Server" extension and click "Go Live".
    -   **Python**: `python -m http.server 8000`
    -   **Node**: `npx serve .`

3.  **Firebase Configuration**
    -   The project expects a valid `firebase-config.js`.
    -   Create a project in [Firebase Console](https://console.firebase.google.com/).
    -   Enable **Auth** (Email/Password) and **Firestore**.
    -   Copy your config keys into `js/firebase-config.js`.

## 🌍 Deployment

### ⚠️ Critical Step: Firebase Google Auth & Whitelisting
After deploying to **Vercel**, you MUST:

1.  Go to [Firebase Console](https://console.firebase.google.com/).
2.  Navigate to **Authentication** > **Settings** > **Authorized Domains**.
3.  Add your Vercel URL (e.g., `3d-poke-quiz.vercel.app`).
4.  Navigate to **Authentication** > **Sign-in method** > **Google** and ensure it's enabled.

---

## 🌟 Key Features

1.  **3D Interactive Hub**: A high-brightness rotating Poké Ball menu system.
2.  **Smart Navigation**: 
    -   **Desktop**: Scroll to rotate, click button to open.
    -   **Mobile**: Click anywhere on the ball to toggle.
3.  **Gyroscope Parallax**: Real-time device orientation tracking on mobile for immersive depth.
4.  **Authorized Access**: Quizzes are protected via Auth guards; only authenticated Trainers can battle!
5.  **Dynamic Profile System**: 
    -   Real-time rank updates (Rookie -> Elite -> Master).
    -   Visual mastery bars for different tech stacks.
6.  **Scalable Content**: New quizzes can be added via the database without code changes.

---

## 📄 License & Copyright

**© 2025 Poké Quiz League.**  
Licensed under the [MIT License](LICENSE).

*Disclaimer: Pokémon is a trademark of Nintendo/Creatures Inc./GAME FREAK inc. This is a fan-made educational project and is not affiliated with Nintendo.*
