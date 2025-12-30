import * as THREE from 'three';

// --- Configuration ---
const OBJECT_SCALE = 2; // Base scale for standard objects
const ROTATION_SPEED = 0.01;

// --- State ---
let currentObject = null;
let currentType = null;

// --- Materials ---
const neonBlueMat = new THREE.MeshPhysicalMaterial({
    color: 0x00ffff, metalness: 0.1, roughness: 0.2, transmission: 0.6, thickness: 1.0, emissive: 0x002244
});
const neonGreenMat = new THREE.MeshPhysicalMaterial({
    color: 0x00ff00, metalness: 0.8, roughness: 0.2, wireframe: true, emissive: 0x004400
});
const wowMat = new THREE.MeshNormalMaterial({
    wireframe: false, transparent: true, opacity: 0.9
});

// --- Generators ---

function createDSATree() {
    const group = new THREE.Group();

    // Nodes
    const sphereGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const positions = [
        { x: 0, y: 1.5, z: 0 }, // Root
        { x: -1, y: 0.5, z: 0 },
        { x: 1, y: 0.5, z: 0 },
        { x: -1.5, y: -0.5, z: 0 },
        { x: -0.5, y: -0.5, z: 0 },
    ];

    positions.forEach(pos => {
        const mesh = new THREE.Mesh(sphereGeo, neonBlueMat);
        mesh.position.set(pos.x, pos.y, pos.z);
        group.add(mesh);
    });

    // Edges
    const points = [
        new THREE.Vector3(0, 1.5, 0), new THREE.Vector3(-1, 0.5, 0),
        new THREE.Vector3(0, 1.5, 0), new THREE.Vector3(1, 0.5, 0),
        new THREE.Vector3(-1, 0.5, 0), new THREE.Vector3(-1.5, -0.5, 0),
        new THREE.Vector3(-1, 0.5, 0), new THREE.Vector3(-0.5, -0.5, 0),
    ];
    // Use Cylinder or Line for edges. Line is simpler for "Hologram" feel
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x00ffff });
    const lines = new THREE.LineSegments(geometry, lineMat);
    group.add(lines);

    return group;
}

function createCSChip() {
    const group = new THREE.Group();

    // Main Body
    const boardGeo = new THREE.BoxGeometry(2, 2, 0.2);
    const board = new THREE.Mesh(boardGeo, new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 }));
    group.add(board);

    // Pins
    const pinGeo = new THREE.BoxGeometry(0.1, 0.3, 0.1);
    const pinMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 1.0 });

    for (let i = 0; i < 8; i++) {
        const pinTop = new THREE.Mesh(pinGeo, pinMat);
        pinTop.position.set(-0.8 + (i * 0.23), 1.1, 0);
        group.add(pinTop);

        const pinBottom = new THREE.Mesh(pinGeo, pinMat);
        pinBottom.position.set(-0.8 + (i * 0.23), -1.1, 0);
        group.add(pinBottom);
    }

    // Silicon Die
    const dieGeo = new THREE.BoxGeometry(0.8, 0.8, 0.05);
    const die = new THREE.Mesh(dieGeo, neonGreenMat);
    die.position.z = 0.15;
    group.add(die);

    return group;
}

function createWowShape() {
    const geometry = new THREE.IcosahedronGeometry(1.5, 1);
    const mesh = new THREE.Mesh(geometry, wowMat);

    // Add an outer wireframe cage
    const wireGeo = new THREE.IcosahedronGeometry(1.8, 1);
    const wireMesh = new THREE.Mesh(wireGeo, new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true }));
    mesh.add(wireMesh);

    return mesh;
}


// --- API ---

export function spawnObject(scene, type) {
    // Remove existing
    removeObject(scene);

    let obj;
    if (type === 'dsa') obj = createDSATree();
    else if (type === 'cs') obj = createCSChip();
    else if (type === 'wow') obj = createWowShape();
    else return;

    obj.position.set(0, 2, 0); // Center but slightly up
    scene.add(obj);
    currentObject = obj;
    currentType = type;

    // Entrance Animation (Scale Up)
    obj.scale.set(0, 0, 0);
}

export function update(time) {
    if (currentObject) {
        // Rotate
        currentObject.rotation.y += ROTATION_SPEED;
        currentObject.rotation.z += ROTATION_SPEED * 0.5;

        // Float
        currentObject.position.y = 2 + Math.sin(time * 2) * 0.2;

        // Scale In
        currentObject.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
}

export function removeObject(scene) {
    if (currentObject) {
        scene.remove(currentObject);
        // Dispose geometries to avoid leak? (Simplified for now)
        currentObject = null;
    }
}
