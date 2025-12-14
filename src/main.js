import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';
import { createScene } from './scene.js';
import { createCamera } from './camera.js';
import { addLights } from './lights.js';
import { createRenderer } from './renderer.js';
import { createControls } from './controls.js';
import { crearMuneco } from './munecos.js';

const container = document.getElementById('board');

const scene = createScene();
const camera = createCamera(container);
const renderer = createRenderer(container);
addLights(scene);

const controls = createControls(camera, renderer);
const axes = new THREE.AxesHelper(3);
axes.visible = false; // Toggle to true while debugging orientation
scene.add(axes);

const adulto = crearMuneco('adulto', { colorRopa: 0x2563eb, acentoColor: 0x1d4ed8 });
adulto.position.set(-3.25, 0, 1.5);
scene.add(adulto);

const nino = crearMuneco('nino', { colorRopa: 0x22c55e, acentoColor: 0x15803d });
nino.position.set(0, 0, -1.25);
scene.add(nino);

const bebe = crearMuneco('bebe', { colorRopa: 0xf9a8d4, acentoColor: 0xec4899 });
bebe.position.set(2.75, 0, 2.4);
scene.add(bebe);

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
