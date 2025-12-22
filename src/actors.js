import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';

const DEFAULT_COLOR = 0x4a90e2;

function buildBody(color) {
  const bodyGeometry = new THREE.CylinderGeometry(0.6, 0.8, 2.4, 24);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.1 });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.castShadow = true;
  body.receiveShadow = true;
  return body;
}

function buildHead(color) {
  const headGeometry = new THREE.SphereGeometry(0.55, 24, 16);
  const headMaterial = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.4, metalness: 0 });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.y = 1.55;
  head.castShadow = true;
  head.receiveShadow = true;
  head.userData.isHead = true;
  return head;
}

export function createDoll({ name = 'Representante', color = DEFAULT_COLOR } = {}) {
  const group = new THREE.Group();
  group.name = name;
  group.userData = { name, color };

  const body = buildBody(color);
  const head = buildHead(color);
  group.add(body, head);

  return group;
}

export function addDoll(scene, { name = 'Representante', color = DEFAULT_COLOR, position = { x: 0, y: 0, z: 0 } } = {}) {
  const doll = createDoll({ name, color });
  doll.position.set(position.x, position.y, position.z);
  scene.add(doll);
  return doll;
}

export function exportDollsState(dolls) {
  return dolls.map((doll) => ({
    name: doll.userData?.name ?? '',
    color: doll.userData?.color ?? DEFAULT_COLOR,
    position: {
      x: doll.position.x,
      y: doll.position.y,
      z: doll.position.z,
    },
  }));
}
