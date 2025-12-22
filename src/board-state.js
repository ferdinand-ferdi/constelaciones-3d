import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';

const boardState = {
  dolls: []
};

function cloneVector(vector = {}) {
  const safeNumber = (value) => {
    const numeric = Number(value ?? 0);
    return Number.isFinite(numeric) ? numeric : 0;
  };

  return {
    x: safeNumber(vector.x),
    y: safeNumber(vector.y),
    z: safeNumber(vector.z)
  };
}

function ensureDoll(id) {
  const doll = boardState.dolls.find((entry) => entry.id === id);
  if (!doll) {
    throw new Error(`No existe un muñeco con id "${id}" en el tablero.`);
  }
  return doll;
}

export function createDoll({ id, tipo, position, rotation }) {
  if (!id) {
    throw new Error('Debe especificarse un id para el muñeco.');
  }

  const existing = boardState.dolls.find((entry) => entry.id === id);
  const normalizedPosition = cloneVector(position);
  const normalizedRotation = cloneVector(rotation);

  if (existing) {
    existing.tipo = tipo ?? existing.tipo;
    existing.position = normalizedPosition;
    existing.rotation = normalizedRotation;
    return existing;
  }

  const doll = {
    id,
    tipo: tipo ?? 'desconocido',
    position: normalizedPosition,
    rotation: normalizedRotation
  };

  boardState.dolls.push(doll);
  return doll;
}

export function moveDoll(id, position) {
  const doll = ensureDoll(id);
  doll.position = cloneVector(position);
  return doll;
}

export function rotateDoll(id, rotation) {
  const doll = ensureDoll(id);
  doll.rotation = cloneVector(rotation);
  return doll;
}

export function removeDoll(id) {
  const index = boardState.dolls.findIndex((entry) => entry.id === id);
  if (index === -1) {
    return null;
  }
  const [removed] = boardState.dolls.splice(index, 1);
  return removed;
}

export function getBoardState() {
  return JSON.parse(JSON.stringify(boardState));
}

export function getBoardStateAsVector3() {
  return boardState.dolls.map((entry) => ({
    ...entry,
    position: new THREE.Vector3(entry.position.x, entry.position.y, entry.position.z),
    rotation: new THREE.Euler(entry.rotation.x, entry.rotation.y, entry.rotation.z)
  }));
}
