import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';
import { createScene } from './scene.js';
import { createCamera } from './camera.js';
import { addLights } from './lights.js';
import { createRenderer } from './renderer.js';
import { createControls } from './controls.js';
import { MunecoManager } from './board/munecoManager.js';
import { crearMuneco } from './munecos.js';

const container = document.getElementById('board');

const stageManager = new StageManager(container);
const interactionManager = new InteractionManager(stageManager);

const controls = createControls(camera, renderer);
const munecoManager = new MunecoManager(scene);
const axes = new THREE.AxesHelper(3);
axes.visible = false; // Toggle to true while debugging orientation
scene.add(axes);

// Agrega un muñeco inicial para mostrar el uso del gestor.
munecoManager.addMuneco('cubo', {
  position: { x: 0, y: 0.5, z: 0 },
  color: 0xff7043,
  size: 1.2,
});

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
