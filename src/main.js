import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';
import { createScene } from './scene.js';
import { createCamera } from './camera.js';
import { addLights } from './lights.js';
import { createRenderer } from './renderer.js';
import { createControls } from './controls.js';

const container = document.getElementById('board');

const scene = createScene();
const camera = createCamera(container);
const renderer = createRenderer(container);
addLights(scene);

const controls = createControls(camera, renderer);
const axes = new THREE.AxesHelper(3);
axes.visible = false; // Toggle to true while debugging orientation
scene.add(axes);

window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

function render() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
