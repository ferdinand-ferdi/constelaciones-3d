import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/controls/OrbitControls.js';

/**
 * Configure orbit controls for the provided camera and renderer.
 * @param {import('https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js').PerspectiveCamera} camera - Camera to orbit.
 * @param {import('https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js').WebGLRenderer} renderer - Renderer whose DOM element receives input events.
 * @returns {OrbitControls}
 */
export function createControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 5;
  controls.maxDistance = 120;
  controls.maxPolarAngle = Math.PI / 2.05; // Keep a slightly elevated view
  return controls;
}
