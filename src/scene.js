import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';

/**
 * Creates a neutral scene with a large floor plane and grid.
 * @returns {THREE.Scene}
 */
export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xeeeeee);

  // Soft ambient environment
  scene.fog = new THREE.Fog(0xeeeeee, 40, 180);

  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xf3f3f3, roughness: 0.9, metalness: 0 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const grid = new THREE.GridHelper(200, 40, 0x9e9e9e, 0xcfcfcf);
  grid.position.y = 0.01;
  scene.add(grid);

  return scene;
}
