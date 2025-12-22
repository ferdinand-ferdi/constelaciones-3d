import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';

function createBaseMaterial(color) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.35,
    metalness: 0.15,
  });
}

export function createDoll(color, id = crypto.randomUUID()) {
  const group = new THREE.Group();
  group.userData = {
    id,
    color,
    isDoll: true,
  };

  const bodyMaterial = createBaseMaterial(color);
  const accentMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.45, metalness: 0.05 });
  const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.7, metalness: 0.05 });

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1, 0.14, 28), baseMaterial);
  base.position.y = 0.07;
  base.receiveShadow = true;
  group.add(base);

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.6, 1.6, 12, 24), bodyMaterial);
  body.position.y = 1.1;
  body.castShadow = true;
  group.add(body);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.48, 28, 24), accentMaterial);
  head.position.y = 2.2;
  head.castShadow = true;
  group.add(head);

  const faceMark = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.1, 16), bodyMaterial);
  faceMark.rotation.x = Math.PI / 2;
  faceMark.position.set(0, 2.2, 0.45);
  faceMark.castShadow = true;
  group.add(faceMark);

  return group;
}

export function createSelectionRing() {
  const ringGeo = new THREE.RingGeometry(1.05, 1.25, 32);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x2563eb, side: THREE.DoubleSide, transparent: true, opacity: 0.75 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.02;
  ring.visible = false;
  ring.userData.isHelper = true;
  return ring;
}

export function serializeDoll(doll) {
  return {
    id: doll.userData.id,
    color: doll.userData.color,
    position: {
      x: doll.position.x,
      y: doll.position.y,
      z: doll.position.z,
    },
    rotationY: doll.rotation.y,
  };
}

export function applyDollState(doll, state) {
  doll.position.set(state.position.x, state.position.y, state.position.z);
  doll.rotation.y = state.rotationY;
}

export function getDollRoot(object) {
  let current = object;
  while (current && !current.userData?.isDoll) {
    current = current.parent;
  }
  return current;
}
