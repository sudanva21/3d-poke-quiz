import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as Quiz3D from './quiz-3d.js';

// --- Configuration ---
// --- Configuration ---
const RADIUS = 5;
const REGMENTS = 64; // Wait, original was SEGMENTS.
const SEGMENTS = 64;
const GAP = 0.2;

// --- State ---
export const state = {
    scrollProgress: 0, // 0 to 1
    targetProgress: 0,
    isNavigating: false,
    gyro: { beta: 0, gamma: 0, active: false }
};

// --- Gyroscope Logic ---
function handleOrientation(event) {
    // We only care about beta (tilt front/back) and gamma (tilt left/right)
    state.gyro.beta = event.beta || 0;
    state.gyro.gamma = event.gamma || 0;
    state.gyro.active = true;
}

async function requestGyroPermission() {
    if (state.gyro.active) return; // Already running or requested

    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
            const permission = await DeviceOrientationEvent.requestPermission();
            if (permission === 'granted') {
                window.addEventListener('deviceorientation', handleOrientation);
            }
        } catch (e) { console.warn("Gyro permission failed:", e); }
    } else {
        window.addEventListener('deviceorientation', handleOrientation);
    }
}

// --- Scene Setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f0f13); // New Background
scene.fog = new THREE.FogExp2(0x0f0f13, 0.02); // New Fog

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 24);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// --- Controls ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = false;
controls.minDistance = 15;
controls.maxDistance = 30;

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 1.8);
mainLight.position.set(5, 10, 7); // Updated position
mainLight.castShadow = true;
scene.add(mainLight);

const rimLight = new THREE.SpotLight(0x00f0ff, 2.0); // Cyan rim (Holo-Blue)
rimLight.position.set(-10, 0, -5);
rimLight.lookAt(0, 0, 0);
scene.add(rimLight);

// Internal Glow Light (Visible when opened)
const innerLight = new THREE.PointLight(0x00f0ff, 0, 15); // Cyan glow matched to new style
innerLight.position.set(0, 0, 0);
scene.add(innerLight);

// --- Materials (From Profile) ---
const redMaterial = new THREE.MeshStandardMaterial({
    color: 0xe61919, roughness: 0.2, metalness: 0.3, side: THREE.DoubleSide
});
const whiteMaterial = new THREE.MeshStandardMaterial({
    color: 0xf0f0f0, roughness: 0.2, metalness: 0.3, side: THREE.DoubleSide
});
const blackMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111, roughness: 0.5, metalness: 0.1
});
const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0x00f0ff, transparent: true, opacity: 0.8
});
// Inner core can stay same or simply be the black void
const innerCoreMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111, emissive: 0x001111, metalness: 0.8, roughness: 0.2
});


// --- Poké Ball Construction ---
const pokeBall = new THREE.Group();
scene.add(pokeBall);

// 1. Inner Energy Core / Void
// Scaled to match Radius 5 logic (Profile was 1.5 -> 0.95 ratio)
const innerGeo = new THREE.SphereGeometry(RADIUS * 0.95, SEGMENTS, SEGMENTS);
const innerMesh = new THREE.Mesh(innerGeo, blackMaterial); // Using black material for the "void" look
pokeBall.add(innerMesh);

// 2. Top Shell Group
const topGroup = new THREE.Group();
pokeBall.add(topGroup);

const topCutTheta = (Math.PI / 2) - (GAP / 2);
const topHeigth = RADIUS * Math.cos(topCutTheta);
const topCutRadius = RADIUS * Math.sin(topCutTheta);

const topGeometry = new THREE.SphereGeometry(RADIUS, SEGMENTS, SEGMENTS, 0, Math.PI * 2, 0, topCutTheta);
const topMesh = new THREE.Mesh(topGeometry, redMaterial);
topMesh.castShadow = true;
topMesh.receiveShadow = true;
topGroup.add(topMesh);

// Top Cap (Thickness)
const topCapGeo = new THREE.RingGeometry(RADIUS * 0.90, topCutRadius, SEGMENTS);
const topCapMesh = new THREE.Mesh(topCapGeo, redMaterial);
topCapMesh.rotation.x = Math.PI / 2;
topCapMesh.position.y = topHeigth;
topGroup.add(topCapMesh);

// 3. Bottom Shell Group
const bottomGroup = new THREE.Group();
pokeBall.add(bottomGroup);

const bottomCutTheta = (Math.PI / 2) + (GAP / 2);
const bottomHeight = RADIUS * Math.cos(bottomCutTheta); // Will be negative
const bottomCutRadius = RADIUS * Math.sin(bottomCutTheta);

// Note: Bottom hemisphere parameters: phiStart=0, phiLen=2PI, thetaStart=PI/2, thetaLen=PI/2
const bottomGeometry = new THREE.SphereGeometry(RADIUS, SEGMENTS, SEGMENTS, 0, Math.PI * 2, bottomCutTheta, (Math.PI - bottomCutTheta));
const bottomMesh = new THREE.Mesh(bottomGeometry, whiteMaterial);
bottomMesh.castShadow = true;
bottomMesh.receiveShadow = true;
bottomGroup.add(bottomMesh);

// Bottom Cap (Thickness)
const bottomCapGeo = new THREE.RingGeometry(RADIUS * 0.90, bottomCutRadius, SEGMENTS);
const bottomCapMesh = new THREE.Mesh(bottomCapGeo, whiteMaterial);
bottomCapMesh.rotation.x = -Math.PI / 2; // Face up
bottomCapMesh.position.y = bottomHeight;
bottomGroup.add(bottomCapMesh);

// 4. Band (Torus) - Attached to Bottom Group in new design
// Profile: radius * 0.96, tube 0.15. Scaled up: 5 * 0.96 = 4.8. Tube ~ 0.5
const torusGeo = new THREE.TorusGeometry(RADIUS * 0.96, 0.5, 16, 100);
const bandMesh = new THREE.Mesh(torusGeo, blackMaterial);
bandMesh.rotation.x = Math.PI / 2;
bottomGroup.add(bandMesh);

// 5. Button Group - Attached to Bottom Group in new design
// In Main.js original, button lifted with Top. In Profile.js, button stays on Bottom.
// We must choose. Logic says button stays on bottom usually? 
// Actually Profile.js puts button on bottomGroup. Let's follow Profile.js.
const buttonGroup = new THREE.Group();
// Scaled dimensions (approx 3.33x from profile)
const btnOuter = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.6, 32), blackMaterial);
btnOuter.rotation.x = Math.PI / 2;
btnOuter.position.z = RADIUS * 0.92;

const btnInner = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.7, 32), whiteMaterial);
btnInner.rotation.x = Math.PI / 2;
btnInner.position.z = RADIUS * 0.92;
btnInner.userData = { isButton: true }; // Keep click interaction

// Core Glow Light Mesh (visual representation of light source)
const coreLightMesh = new THREE.Mesh(new THREE.SphereGeometry(1.0, 16, 16), glowMaterial);
coreLightMesh.position.set(0, 0, 0);
coreLightMesh.visible = false; // Controlled by animation
pokeBall.add(coreLightMesh);

buttonGroup.add(btnOuter);
buttonGroup.add(btnInner);

bottomGroup.add(buttonGroup);


// --- Particle System (New) ---
const particlesGeo = new THREE.BufferGeometry();
const particlesCount = 900; // More for the larger scene
const posArray = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 60; // Wide spread
}
particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMat = new THREE.PointsMaterial({
    size: 0.1, color: 0x00f0ff, transparent: true, opacity: 0.5
});
const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
scene.add(particlesMesh);


import { authService } from './auth.js';

// ... (previous imports)

// ... (scene setup - no changes needed until navData)

// --- Navigation Sprites (Pokémon Styled) ---
function createNavSprite(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Style Config
    const borderW = 15;
    const x = borderW, y = borderW;
    const w = 512 - borderW * 2;
    const h = 256 - borderW * 2;
    const r = 40;

    // 1. Background (White)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();

    // 2. Border (Pokemon Blue)
    ctx.strokeStyle = '#2a75bb';
    ctx.lineWidth = borderW;
    ctx.stroke();

    // 3. Inner Shadow/Glow (Subtle)
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10;

    // 4. Text (Pokemon Yellow with Blue Outline)
    ctx.shadowColor = 'transparent'; // Reset shadow for text
    ctx.font = '900 80px "Verdana", sans-serif'; // Heavy font
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Text Stroke
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#2a75bb'; // Blue Stroke
    ctx.strokeText(text.toUpperCase(), 256, 128);

    // Text Fill
    ctx.fillStyle = '#ffcb05'; // Yellow Fill
    ctx.fillText(text.toUpperCase(), 256, 128);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0 });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(4, 2, 1);
    return sprite;
}

// Dynamic Navigation Setup
const navGroup = new THREE.Group();
scene.add(navGroup);
const navSprites = [];

function updateNavigation(user) {
    // Clear existing sprites
    navSprites.forEach(sprite => navGroup.remove(sprite));
    navSprites.length = 0;

    const navData = [];

    // Push sprites further out (Ball Radius is 5)
    // Left Side: Auth Button
    if (user) {
        navData.push({ label: 'Profile', url: 'profile.html', pos: { x: -10, y: 4, z: 2 }, isLink: true });
    } else {
        navData.push({ label: 'Login', url: 'login.html', pos: { x: -10, y: 4, z: 2 }, isLink: true });
    }

    // Right Side: About
    navData.push({ label: 'About', url: '#about', pos: { x: 10, y: 4, z: 2 } });

    // Center/Lower: Quizzes
    navData.push({ label: 'Quizzes', url: '#quizzes', pos: { x: 0, y: -6, z: 9 } });

    // Generate Sprites
    navData.forEach(data => {
        const sprite = createNavSprite(data.label);
        sprite.userData = {
            isNav: true,
            label: data.label,
            url: data.url,
            isLink: data.isLink // Flag for external links
        };
        // Store target pos
        sprite.userData.targetPos = new THREE.Vector3(data.pos.x, data.pos.y, data.pos.z);
        sprite.position.set(0, 0, 0); // Start at center
        navGroup.add(sprite);
        navSprites.push(sprite);
    });
}

// Initial Load & Subscribe to Auth Changes
// Note: monitorAuth might trigger immediately or after a delay. 
// We can render a default state or wait. 
// For now, let's just let it update when it can.
authService.monitorAuth((user) => {
    updateNavigation(user);
});



// --- Smoke Effect System ---
const smokeParticles = [];
const particleGeo = new THREE.PlaneGeometry(1, 1);

// Generate soft smoke texture
function createSmokeTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255,255,255,0.8)');
    grad.addColorStop(0.4, 'rgba(220,220,220,0.4)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
}

const smokeMaterial = new THREE.MeshBasicMaterial({
    map: createSmokeTexture(),
    transparent: true,
    opacity: 0.6,
    depthWrite: false
});

function spawnSmoke(position) {
    for (let i = 0; i < 15; i++) {
        const particle = new THREE.Mesh(particleGeo, smokeMaterial.clone());
        particle.position.copy(position);

        // Random spread
        particle.position.x += (Math.random() - 0.5) * 2;
        particle.position.y += (Math.random() - 0.5) * 2;
        particle.position.z += (Math.random() - 0.5) * 2;

        // Random rotation
        particle.rotation.z = Math.random() * Math.PI;

        scene.add(particle);

        smokeParticles.push({
            mesh: particle,
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2
            ),
            scaleSpeed: 0.05 + Math.random() * 0.05,
            life: 1.0 // opacity
        });
    }
}

// --- Input Handling ---
window.addEventListener('wheel', (event) => {
    if (state.isNavigating) return;
    const delta = Math.sign(event.deltaY) * 0.12;
    state.targetProgress = Math.max(0, Math.min(1, state.targetProgress + delta));

    const scrollBar = document.getElementById('scroll-bar');
    if (scrollBar) scrollBar.style.height = (state.targetProgress * 100) + '%';

    const instructionText = document.getElementById('instruction-text');
    if (instructionText) instructionText.style.opacity = state.targetProgress > 0.1 ? 0 : 1;
});

// Listen for UI closing to reset navigation state
window.addEventListener('nav-closed', () => {
    state.isNavigating = false;
});

// Quiz Integration
window.addEventListener('quiz-3d-action', (e) => {
    const { action, payload } = e.detail;

    if (action === 'spawn-quiz') {
        Quiz3D.spawnObject(scene, payload);
    } else if (action === 'clear-quiz') {
        Quiz3D.removeObject(scene);
    } else if (action === 'smoke-burst') {
        spawnSmoke(new THREE.Vector3(0, 2, 0));
    }
});

// Touch Support
let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
});

window.addEventListener('touchmove', (e) => {
    if (state.isNavigating) return;

    // DISABLE SCROLL OPEN ON MOBILE
    if (window.innerWidth < 600) return;

    const touchY = e.touches[0].clientY;
    const deltaY = touchStartY - touchY;

    // Sensitivity factor
    const delta = deltaY * 0.005;

    state.targetProgress = Math.max(0, Math.min(1, state.targetProgress + delta));

    // Update touchStart to allow continuous scrolling
    touchStartY = touchY;

    // UI Updates
    const scrollBar = document.getElementById('scroll-bar');
    if (scrollBar) scrollBar.style.height = (state.targetProgress * 100) + '%';

    const instructionText = document.getElementById('instruction-text');
    if (instructionText) instructionText.style.opacity = state.targetProgress > 0.1 ? 0 : 1;
});

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('pointerdown', (event) => {
    // Request gyro permission on first interaction (required for mobile)
    requestGyroPermission();

    // Prevent interaction if clicking on UI
    if (event.target !== renderer.domElement) return;

    if (state.isNavigating) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Check Nav Links
    if (state.scrollProgress > 0.5) {
        const navIntersects = raycaster.intersectObjects(navGroup.children);
        if (navIntersects.length > 0) {
            const hit = navIntersects[0].object;
            handleNavClick(hit);
            return;
        }
    }

    // Check Button to Open
    const ballIntersects = raycaster.intersectObjects(pokeBall.children, true);
    if (ballIntersects.length > 0) {
        const obj = ballIntersects[0].object;

        // Mobile: Click ANY part of the ball to open. Desktop: Click button only.
        const isMobile = window.innerWidth < 600;

        if (obj.userData.isButton || isMobile) {
            // Toggle
            state.targetProgress = state.targetProgress < 0.5 ? 1 : 0;
            const scrollBar = document.getElementById('scroll-bar');
            if (scrollBar) scrollBar.style.height = (state.targetProgress * 100) + '%';
        }
    }
});

function handleNavClick(sprite) {
    state.isNavigating = true;

    // --- AUTH PROTECTION ---
    // If accessing Quiz, check if user is logged in
    if (sprite.userData.label.toLowerCase() === 'quizzes') {
        const user = authService.getCurrentUser();
        if (!user) {
            console.log("User not logged in, redirecting to login...");
            window.location.href = 'login.html';
            return;
        }
    }
    // -----------------------

    // 1. Spawn Smoke at sprite position
    spawnSmoke(sprite.position);

    // 2. Check for External Link
    if (sprite.userData.isLink) {
        // Direct Divert
        setTimeout(() => {
            window.location.href = sprite.userData.url;
        }, 500); // Small delay for effect
        return;
    }

    // 3. Visual feedback (Internal Nav)
    // Dispatch Custom Event for UI to handle
    const event = new CustomEvent('nav-click', { detail: { label: sprite.userData.label, url: sprite.userData.url } });
    window.dispatchEvent(event);

    // 4. Reset after delay if needed
    setTimeout(() => {
        state.isNavigating = false;
    }, 2000);
}

// --- Resize Handling ---
function handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);

    // Mobile Adjustments
    if (width < 600) {
        // Smaller ball on mobile
        if (typeof ballGroup !== 'undefined') ballGroup.scale.set(0.65, 0.65, 0.65);
        if (typeof navGroup !== 'undefined') navGroup.scale.set(0.7, 0.7, 0.7);
        // Adjust camera to fit
        camera.position.z = 28;
    } else {
        // Reset for desktop
        if (typeof ballGroup !== 'undefined') ballGroup.scale.set(1, 1, 1);
        if (typeof navGroup !== 'undefined') navGroup.scale.set(1, 1, 1);
        camera.position.z = 24;
    }
}

window.addEventListener('resize', handleResize);

// Initial Call
handleResize();

// --- Animation Loop ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Scroll Animation
    state.scrollProgress += (state.targetProgress - state.scrollProgress) * 0.1;

    // Gyro Parallax (Mobile only)
    if (state.gyro.active && window.innerWidth < 600) {
        // Natural tilt is roughly 45-60 degrees for beta
        const tiltX = (state.gyro.beta - 50) * 0.01;
        const tiltZ = -state.gyro.gamma * 0.01;

        // Subtly tilt the ball
        pokeBall.rotation.x = THREE.MathUtils.lerp(pokeBall.rotation.x, tiltX, 0.1);
        pokeBall.rotation.z = THREE.MathUtils.lerp(pokeBall.rotation.z, tiltZ, 0.1);

        // Move background particles for parallax depths
        particlesMesh.position.x = THREE.MathUtils.lerp(particlesMesh.position.x, -state.gyro.gamma * 0.2, 0.1);
        particlesMesh.position.y = THREE.MathUtils.lerp(particlesMesh.position.y, (state.gyro.beta - 50) * 0.2, 0.1);
    } else {
        // Smoothly return to default if gyro inactive.
        pokeBall.rotation.x = THREE.MathUtils.lerp(pokeBall.rotation.x, 0, 0.05);
        pokeBall.rotation.z = THREE.MathUtils.lerp(pokeBall.rotation.z, 0, 0.05);
        particlesMesh.position.x = THREE.MathUtils.lerp(particlesMesh.position.x, 0, 0.05);
        particlesMesh.position.y = THREE.MathUtils.lerp(particlesMesh.position.y, 0, 0.05);
    }

    // Ball mechanics
    // Lift top shell
    topGroup.position.y = state.scrollProgress * 4.0;
    // In new design, button is on bottom, so we don't lift it.
    // Rotate top slightly back
    topGroup.rotation.x = -state.scrollProgress * 0.5;

    // Lower bottom shell
    bottomGroup.position.y = -state.scrollProgress * 3.5;
    bottomGroup.rotation.x = state.scrollProgress * 0.2; // Slight tilt

    // Rotation
    // Slower rotation when open
    const rotSpeed = 0.002 * (1 - state.scrollProgress * 0.8);
    pokeBall.rotation.y += rotSpeed;
    pokeBall.rotation.z = Math.sin(time) * 0.05;

    // Lights and Effects
    // Pulse the core light material and visibility
    if (state.scrollProgress > 0.1) {
        coreLightMesh.visible = true;
        const scale = 1 + Math.sin(time * 5) * 0.2;
        coreLightMesh.scale.setScalar(scale);
        innerLight.intensity = state.scrollProgress * 15;
    } else {
        coreLightMesh.visible = false;
        innerLight.intensity = 0;
    }

    // Particle Animation
    particlesMesh.rotation.y = -time * 0.05;
    particlesMesh.rotation.x = time * 0.02;

    // Update Quiz Objects
    Quiz3D.update(time);

    // Nav Sprites Animation
    navSprites.forEach((sprite, i) => {
        if (state.scrollProgress < 0.1) {
            sprite.visible = false;
        } else {
            sprite.visible = true;
            // Fade in
            sprite.material.opacity = Math.max(0, (state.scrollProgress - 0.3) * 1.5);

            // Move out from center
            const target = sprite.userData.targetPos;
            sprite.position.x = THREE.MathUtils.lerp(0, target.x, state.scrollProgress);
            sprite.position.y = THREE.MathUtils.lerp(0, target.y, state.scrollProgress) + Math.sin(time * 2 + i) * 0.1;
            sprite.position.z = THREE.MathUtils.lerp(0, target.z, state.scrollProgress);

            // Scale effect
            const scale = (4 * state.scrollProgress);
            sprite.scale.set(scale, scale * 0.5, 1);
        }
    });

    // Smoke Particles Animation
    for (let i = smokeParticles.length - 1; i >= 0; i--) {
        const p = smokeParticles[i];
        p.life -= 0.02;

        if (p.life <= 0) {
            scene.remove(p.mesh);
            smokeParticles.splice(i, 1);
            continue;
        }

        p.mesh.position.add(p.velocity);
        p.mesh.scale.addScalar(p.scaleSpeed);
        p.mesh.rotation.z += 0.05;
        p.mesh.material.opacity = p.life * 0.6;
        p.mesh.lookAt(camera.position); // Billboarding
    }

    controls.update();
    renderer.render(scene, camera);
}

animate();
