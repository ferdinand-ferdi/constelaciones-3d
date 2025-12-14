import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';

export function addLights(scene) {
  const hemi = new THREE.HemisphereLight(0xffffff, 0xdedede, 0.65);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xffffff, 0.55);
  key.position.set(30, 60, 20);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 10;
  key.shadow.camera.far = 120;
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xffffff, 0.25);
  fill.position.set(-20, 30, -25);
  scene.add(fill);
}
