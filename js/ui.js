import { dataService } from './data-service.js';
import { authService } from './auth.js';
import { quizData } from './quiz-data.js'; // Import local data

// Auto-seed (Update Firestore with new quizzes)
// Auto-seed (Update Firestore with new quizzes)
// dataService.seedQuizzes(quizData).catch(console.error);

console.log('UI Wrapper Loaded');

// --- Quiz State ---
let currentQuizType = null;
let currentQuestionIndex = 0;
let userScore = 0;
let timerInterval = null;
let timeLeft = 15;
let isAnswered = false;
let currentQuestions = []; // Store fetched questions here

// --- DOM Elements ---
const quizStart = document.getElementById('quiz-selection');
const quizQuestion = document.getElementById('quiz-question-view');
const quizResult = document.getElementById('quiz-result-view');
const quizTitle = document.getElementById('quiz-title');
const quizProgress = document.getElementById('quiz-progress');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const scoreSpan = document.getElementById('final-score');
const totalSpan = document.getElementById('total-questions');

// New Elements
const timerDisplay = document.getElementById('timer-display');
const mediaContainer = document.getElementById('media-container');
const questionImage = document.getElementById('question-image');
const hintSection = document.getElementById('hint-section');
const hintBtn = document.getElementById('hint-btn');
const hintText = document.getElementById('hint-text');
const feedbackSection = document.getElementById('feedback-section');
const explanationText = document.getElementById('explanation-text');
const nextBtn = document.getElementById('next-btn');

// Loading Elements
const quizLoading = document.getElementById('quiz-loading');
const quizContent = document.getElementById('quiz-content');


window.addEventListener('nav-click', (e) => {
    const { label, url } = e.detail;
    console.log('UI received nav-click:', label, url);

    // 1. Identify Target
    const targetId = `overlay-${url.replace('#', '')}`;
    const overlay = document.getElementById(targetId);

    if (overlay) {
        // --- AUTH PROTECTION ---
        if (url === '#quizzes' && !authService.getCurrentUser()) {
            window.location.href = 'login.html';
            return;
        }
        // -----------------------

        // Close any open overlays
        document.querySelectorAll('.content-overlay.active').forEach(el => el.classList.remove('active'));

        // Open new one
        overlay.classList.add('active');

        // Reset 3D Quiz Object if specific overlay
        if (url === '#quizzes') {
            // Show selection screen by default
            resetQuizUI();
        } else {
            // Clear any 3D quiz objects if navigating away from quiz
            dispatch3DEvent('clear-quiz');
        }

    } else {
        console.warn('No overlay found for:', targetId);
        // Reset navigation state if fail
        window.dispatchEvent(new CustomEvent('nav-closed'));
    }
});

// Close Button Logic
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('close-btn') || e.target.classList.contains('content-overlay')) {
        const overlay = e.target.closest('.content-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            window.dispatchEvent(new CustomEvent('nav-closed'));
            dispatch3DEvent('clear-quiz');
            stopTimer();
        }
    }

    // Quiz Option Click
    if (e.target.classList.contains('quiz-btn')) {
        const type = e.target.getAttribute('data-type');
        startQuiz(type);
    }

    // Answer Click
    if (e.target.classList.contains('option-btn')) {
        const index = parseInt(e.target.getAttribute('data-index'));
        handleAnswer(index, e.target);
    }

    // Hint Click
    if (e.target.id === 'hint-btn') {
        hintText.style.display = 'block';
        hintBtn.style.display = 'none';
    }

    // Next Button Click
    if (e.target.id === 'next-btn') {
        goToNextQuestion();
    }

    // Restart Click
    if (e.target.id === 'restart-quiz-btn') {
        resetQuizUI();
        dispatch3DEvent('clear-quiz');
    }

    // TEMP: Seeding Button (Hidden feature for dev)
    if (e.target.id === 'seed-btn') { import('./quiz-data.js').then(m => dataService.seedQuizzes(m.quizData)); }
});


async function startQuiz(type) {
    currentQuizType = type;
    currentQuestionIndex = 0;
    userScore = 0;
    currentQuestions = [];

    // UI Switch to Loading
    quizStart.style.display = 'none';
    quizQuestion.style.display = 'block';

    // Check if loading elements exist (they might not be in index.html yet, so fallback)
    if (quizLoading) quizLoading.style.display = 'block';
    if (quizContent) quizContent.style.display = 'none';

    // Fetch Data
    const questions = await dataService.getQuiz(type);

    if (!questions || questions.length === 0) {
        if (quizLoading) quizLoading.innerHTML = '<p style="text-align:center; color:red;">Failed to load quiz. Please check internet connection or try again.</p>';
        return;
    }

    currentQuestions = questions;

    // Restore UI structure
    if (quizLoading) quizLoading.style.display = 'none';
    if (quizContent) quizContent.style.display = 'block';

    quizResult.style.display = 'none';
    quizTitle.innerText = type === 'dsa' ? 'DSA Challenge' : type === 'cs' ? 'CS Core' : 'Wow Factor';

    dispatch3DEvent('spawn-quiz', type);
    loadQuestion();
}

function loadQuestion() {
    isAnswered = false;
    const data = currentQuestions[currentQuestionIndex];

    // Reset UI Elements
    feedbackSection.style.display = 'none';
    hintText.style.display = 'none';
    hintBtn.style.display = data.hint ? 'inline-block' : 'none';
    hintSection.style.display = data.hint ? 'block' : 'none';

    // Image Handling
    if (data.image) {
        mediaContainer.style.display = 'block';
        questionImage.src = data.image;
    } else {
        mediaContainer.style.display = 'none';
    }

    questionText.innerText = data.question;
    optionsContainer.innerHTML = '';

    data.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.setAttribute('data-index', idx);
        optionsContainer.appendChild(btn);
    });

    // Update Progress
    const progress = ((currentQuestionIndex) / currentQuestions.length) * 100;
    quizProgress.style.width = `${progress}%`;

    // Trigger Smoke Effect on question change
    if (currentQuestionIndex > 0) {
        dispatch3DEvent('smoke-burst');
    }

    // Start Timer
    startTimer(data.timer || 15);
}

function startTimer(seconds) {
    stopTimer();
    timeLeft = seconds;
    updateTimerDisplay();
    timerDisplay.classList.remove('warning');

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 5) {
            timerDisplay.classList.add('warning');
        }

        if (timeLeft <= 0) {
            stopTimer();
            handleTimeUp();
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
}

function updateTimerDisplay() {
    timerDisplay.innerText = timeLeft;
}

function handleTimeUp() {
    handleAnswer(-1, null); // -1 indicates no answer/wrong
}

function handleAnswer(selectedIndex, btnElement) {
    if (isAnswered) return;
    isAnswered = true;
    stopTimer();

    const data = currentQuestions[currentQuestionIndex];
    const isCorrect = selectedIndex === data.answer;

    // Visual Feedback on Buttons
    const buttons = optionsContainer.querySelectorAll('.option-btn');
    buttons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === data.answer) {
            btn.style.background = 'rgba(76, 175, 80, 0.6)'; // Green
            btn.style.borderColor = '#4CAF50';
        } else if (idx === selectedIndex) {
            btn.style.background = 'rgba(244, 67, 54, 0.6)'; // Red
            btn.style.borderColor = '#F44336';
        } else {
            btn.style.opacity = '0.5';
        }
    });

    if (isCorrect) {
        userScore++;
    }

    // Show Explanation
    explanationText.innerText = data.explanation || (isCorrect ? "Correct!" : "Incorrect.");
    feedbackSection.style.display = 'block';
}

function goToNextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < currentQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    quizQuestion.style.display = 'none';
    quizResult.style.display = 'block';

    scoreSpan.innerText = userScore;
    totalSpan.innerText = currentQuestions.length;

    quizProgress.style.width = '100%';

    // Save Score
    dataService.saveScore(currentQuizType, userScore, currentQuestions.length);

    // Celebration Smoke
    dispatch3DEvent('smoke-burst');
}

function resetQuizUI() {
    stopTimer();
    quizStart.style.display = 'block';
    quizQuestion.style.display = 'none';
    quizResult.style.display = 'none';
    if (quizLoading) quizLoading.style.display = 'none';
    if (quizContent) quizContent.style.display = 'block';
    currentQuestions = []; // Clear questions
}

function dispatch3DEvent(action, payload = null) {
    window.dispatchEvent(new CustomEvent('quiz-3d-action', { detail: { action, payload } }));
}
