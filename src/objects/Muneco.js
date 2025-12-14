import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';

const DEFAULT_COLOR = 0xbdbdbd;
const DEFAULT_TYPE = 'capsule';
const MATERIAL_PROPS = {
  roughness: 0.7,
  metalness: 0.05,
};

const builders = {
  capsule: createCapsuleFigure,
  monolith: createMonolithFigure,
  orb: createOrbFigure,
};

function applyShadowSettings(mesh) {
  mesh.castShadow = true;
  mesh.receiveShadow = true;
}

function createCapsuleFigure(material) {
  const group = new THREE.Group();

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.55, 1.1, 12, 16), material);
  applyShadowSettings(body);
  group.add(body);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.2, 18), material);
  base.position.y = -0.65;
  applyShadowSettings(base);
  group.add(base);

  const shoulders = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.08, 12, 24), material);
  shoulders.rotation.x = Math.PI / 2;
  shoulders.position.y = 0.35;
  applyShadowSettings(shoulders);
  group.add(shoulders);

  return group;
}

function createMonolithFigure(material) {
  const group = new THREE.Group();

  const body = new THREE.Mesh(new THREE.BoxGeometry(1, 1.8, 0.5), material);
  body.position.y = 0.4;
  applyShadowSettings(body);
  group.add(body);

  const base = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.2, 0.6), material);
  base.position.y = -0.5;
  applyShadowSettings(base);
  group.add(base);

  return group;
}

function createOrbFigure(material) {
  const group = new THREE.Group();

  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.75, 28, 18), material);
  applyShadowSettings(orb);
  group.add(orb);

  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.8, 12), material);
  stand.position.y = -0.9;
  applyShadowSettings(stand);
  group.add(stand);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.6, 0.25, 16), material);
  base.position.y = -1.25;
  applyShadowSettings(base);
  group.add(base);

  return group;
}

function normalizeScale(scale) {
  if (typeof scale === 'number') {
    return new THREE.Vector3(scale, scale, scale);
  }

  if (scale && typeof scale === 'object') {
    const { x = 1, y = 1, z = 1 } = scale;
    return new THREE.Vector3(x, y, z);
  }

  return new THREE.Vector3(1, 1, 1);
}

export class Muneco {
  constructor({ type = DEFAULT_TYPE, scale = 1, color = DEFAULT_COLOR, id } = {}) {
    this.type = type in builders ? type : DEFAULT_TYPE;
    this.id = id || `muneco-${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`;

    this.material = new THREE.MeshStandardMaterial({ color, ...MATERIAL_PROPS });
    this.mesh = builders[this.type](this.material);

    const scaleVector = normalizeScale(scale);
    this.mesh.scale.copy(scaleVector);
  }

  setPosition(x, y, z) {
    this.mesh.position.set(x, y, z);
  }

  setRotation(x, y, z) {
    this.mesh.rotation.set(x, y, z);
  }

  serialize() {
    const { position, rotation } = this.mesh;

    return {
      id: this.id,
      type: this.type,
      position: { x: position.x, y: position.y, z: position.z },
      rotation: { x: rotation.x, y: rotation.y, z: rotation.z },
    };
  }
}
