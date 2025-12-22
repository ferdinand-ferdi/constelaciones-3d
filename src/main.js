import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';
import { createScene } from './scene.js';
import { createCamera } from './camera.js';
import { addLights } from './lights.js';
import { createRenderer } from './renderer.js';
import { createControls } from './controls.js';
import { applyDollState, createDoll, createSelectionRing, getDollRoot, serializeDoll } from './dolls.js';

const container = document.getElementById('board');
const addDollButton = document.getElementById('addDoll');
const deleteDollButton = document.getElementById('deleteDoll');
const clearAllButton = document.getElementById('clearAll');
const rotationSelect = document.getElementById('rotation');
const applyRotationButton = document.getElementById('applyRotation');
const dollColorInput = document.getElementById('dollColor');
const statusBox = document.getElementById('status');

const scene = createScene();
const camera = createCamera(container);
const renderer = createRenderer(container);
addLights(scene);

const controls = createControls(camera, renderer);
const axes = new THREE.AxesHelper(3);
axes.visible = false; // Toggle to true while debugging orientation
scene.add(axes);

const selectionRing = createSelectionRing();
scene.add(selectionRing);

const dolls = new Map();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const dragOffset = new THREE.Vector3();
let dragging = false;
let selectedDoll = null;
const STORAGE_KEY = 'constelarte:dolls';

window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

function updateStatus(message) {
  if (statusBox) {
    statusBox.textContent = message;
  }
}

function saveState() {
  const payload = Array.from(dolls.values()).map((doll) => serializeDoll(doll));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  updateStatus('Estado guardado: posición, color y rotación de los muñecos.');
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    updateStatus('Añade tu primer muñeco para iniciar.');
    return;
  }

  try {
    const parsed = JSON.parse(saved);
    parsed.forEach((state) => {
      const doll = createDoll(state.color, state.id);
      applyDollState(doll, state);
      scene.add(doll);
      dolls.set(state.id, doll);
    });
    if (parsed.length > 0) {
      updateStatus(`Se restauraron ${parsed.length} muñecos desde el almacenamiento local.`);
    }
  } catch (error) {
    console.error('No se pudo restaurar el estado guardado', error);
    updateStatus('No se pudo restaurar el estado guardado. Añade nuevos muñecos.');
  }
}

function setSelection(doll) {
  selectedDoll = doll;
  if (!doll) {
    selectionRing.visible = false;
    deleteDollButton.disabled = true;
    return;
  }

  selectionRing.visible = true;
  selectionRing.position.set(doll.position.x, 0.02, doll.position.z);
  selectionRing.rotation.z = 0;
  selectionRing.rotation.y = doll.rotation.y;
  deleteDollButton.disabled = false;
}

function addNewDoll() {
  const color = dollColorInput.value || '#2563eb';
  const doll = createDoll(color);
  doll.position.set((Math.random() - 0.5) * 6, 0, (Math.random() - 0.5) * 6);
  scene.add(doll);
  dolls.set(doll.userData.id, doll);
  setSelection(doll);
  saveState();
  updateStatus('Muñeco añadido. Haz click para seleccionarlo y arrastra para posicionarlo.');
}

function deleteSelected() {
  if (!selectedDoll) return;
  scene.remove(selectedDoll);
  dolls.delete(selectedDoll.userData.id);
  setSelection(null);
  saveState();
  updateStatus('El muñeco seleccionado se eliminó del tablero.');
}

function clearAll() {
  dolls.forEach((doll) => scene.remove(doll));
  dolls.clear();
  setSelection(null);
  saveState();
  updateStatus('Se limpiaron todos los muñecos del tablero.');
}

function applyRotation() {
  if (!selectedDoll) return;
  const degrees = Number(rotationSelect.value);
  selectedDoll.rotation.y = THREE.MathUtils.degToRad(degrees);
  selectionRing.rotation.y = selectedDoll.rotation.y;
  saveState();
  updateStatus('Rotación aplicada al muñeco seleccionado.');
}

function getGroundPoint(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const target = new THREE.Vector3();
  return raycaster.ray.intersectPlane(plane, target) ? target : null;
}

function handlePointerDown(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersections = raycaster.intersectObjects(Array.from(dolls.values()), true);
  const hit = intersections.find((item) => getDollRoot(item.object));

  if (hit) {
    const doll = getDollRoot(hit.object);
    setSelection(doll);
    const point = getGroundPoint(event);
    if (point) {
      dragOffset.copy(point).sub(doll.position);
      dragging = true;
      controls.enabled = false;
      updateStatus('Arrastra para mover al muñeco seleccionado.');
    }
    return;
  }

  setSelection(null);
}

function handlePointerMove(event) {
  if (!dragging || !selectedDoll) return;
  const point = getGroundPoint(event);
  if (!point) return;
  const newPosition = point.sub(dragOffset);
  selectedDoll.position.x = newPosition.x;
  selectedDoll.position.z = newPosition.z;
  selectionRing.position.set(selectedDoll.position.x, 0.02, selectedDoll.position.z);
}

function handlePointerUp() {
  if (!dragging) return;
  dragging = false;
  controls.enabled = true;
  saveState();
}

renderer.domElement.addEventListener('pointerdown', handlePointerDown);
renderer.domElement.addEventListener('pointermove', handlePointerMove);
window.addEventListener('pointerup', handlePointerUp);

addDollButton?.addEventListener('click', addNewDoll);
deleteDollButton?.addEventListener('click', deleteSelected);
clearAllButton?.addEventListener('click', clearAll);
applyRotationButton?.addEventListener('click', applyRotation);

loadState();

function render() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
