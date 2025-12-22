import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';

/**
 * Build a perspective camera sized to the given container.
 * @param {HTMLElement} container - DOM element used to derive aspect ratio.
 * @returns {THREE.PerspectiveCamera}
 */
export function createCamera(container) {
  const aspect = container.clientWidth / container.clientHeight;
  const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 500);
  camera.position.set(20, 18, 28);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  return camera;
}
