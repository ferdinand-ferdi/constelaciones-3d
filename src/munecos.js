import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';

const geometries = {
  torso: new THREE.CapsuleGeometry(0.35, 0.9, 8, 16),
  pelvis: new THREE.CylinderGeometry(0.38, 0.42, 0.36, 14),
  leg: new THREE.CylinderGeometry(0.14, 0.16, 0.9, 12),
  arm: new THREE.CylinderGeometry(0.1, 0.11, 0.75, 12),
  head: new THREE.SphereGeometry(0.28, 16, 16),
  foot: new THREE.BoxGeometry(0.26, 0.12, 0.36),
  neck: new THREE.CylinderGeometry(0.12, 0.12, 0.12, 12)
};

const ALTURA_REFERENCIA = 2.8; // Altura aproximada del modelo base sin escalado global

class MunecoBase {
  constructor({
    altura = 1.65,
    colorRopa = 0x6b7280,
    colorPiel = 0xffdfc4,
    acentoColor = 0x374151,
    legScale = 1,
    torsoScale = 1,
    headScale = 1,
    armScale = 1,
    position
  } = {}) {
    this.altura = altura;
    this.legScale = legScale;
    this.torsoScale = torsoScale;
    this.headScale = headScale;
    this.armScale = armScale;
    this.materiales = this.crearMateriales(colorRopa, colorPiel, acentoColor);
    this.group = this.crearCuerpo();

    const escalaGlobal = this.altura / ALTURA_REFERENCIA;
    this.group.scale.setScalar(escalaGlobal);

    if (position) {
      this.group.position.copy(position);
    }
  }

  crearMateriales(colorRopa, colorPiel, acentoColor) {
    return {
      ropa: new THREE.MeshStandardMaterial({ color: colorRopa, roughness: 0.7, metalness: 0.08 }),
      piel: new THREE.MeshStandardMaterial({ color: colorPiel, roughness: 0.5, metalness: 0.1 }),
      acento: new THREE.MeshStandardMaterial({ color: acentoColor, roughness: 0.65, metalness: 0.12 })
    };
  }

  crearPierna(offsetX) {
    const pierna = new THREE.Group();
    const muslo = new THREE.Mesh(geometries.leg, this.materiales.ropa);
    muslo.scale.y = this.legScale;
    muslo.castShadow = true;
    muslo.position.y = 0.45 * this.legScale;

    const pie = new THREE.Mesh(geometries.foot, this.materiales.acento);
    pie.position.y = -0.39 * this.legScale;
    pie.castShadow = true;
    pie.receiveShadow = true;

    pierna.add(muslo, pie);
    pierna.position.set(offsetX, 0.06, 0);

    return pierna;
  }

  crearBrazo(offsetX) {
    const brazo = new THREE.Mesh(geometries.arm, this.materiales.ropa);
    brazo.castShadow = true;
    brazo.position.set(offsetX, 1.6, 0);
    brazo.scale.y = this.armScale;
    brazo.rotation.z = Math.PI / 16 * (offsetX < 0 ? 1 : -1);
    return brazo;
  }

  crearCuerpo() {
    const group = new THREE.Group();

    const piernaIzquierda = this.crearPierna(-0.18);
    const piernaDerecha = this.crearPierna(0.18);
    group.add(piernaIzquierda, piernaDerecha);

    const pelvis = new THREE.Mesh(geometries.pelvis, this.materiales.ropa);
    pelvis.castShadow = true;
    pelvis.receiveShadow = true;
    pelvis.position.y = 1.02;
    group.add(pelvis);

    const torso = new THREE.Mesh(geometries.torso, this.materiales.ropa);
    torso.castShadow = true;
    torso.receiveShadow = true;
    torso.position.y = 1.88;
    torso.scale.y = this.torsoScale;
    group.add(torso);

    const cuello = new THREE.Mesh(geometries.neck, this.materiales.piel);
    cuello.castShadow = true;
    cuello.position.y = 2.44 * this.torsoScale;
    group.add(cuello);

    const cabeza = new THREE.Mesh(geometries.head, this.materiales.piel);
    cabeza.castShadow = true;
    cabeza.position.y = 2.78 * this.torsoScale;
    cabeza.scale.setScalar(this.headScale);
    group.add(cabeza);

    const brazoIzq = this.crearBrazo(-0.66);
    const brazoDer = this.crearBrazo(0.66);
    group.add(brazoIzq, brazoDer);

    return group;
  }
}

export class MunecoAdulto extends MunecoBase {
  constructor(options = {}) {
    super({ altura: 1.72, headScale: 1.05, ...options });
  }
}

export class MunecoNino extends MunecoBase {
  constructor(options = {}) {
    super({
      altura: 1.2,
      headScale: 1.15,
      torsoScale: 0.9,
      legScale: 0.85,
      armScale: 0.9,
      colorRopa: 0x22c55e,
      acentoColor: 0x15803d,
      ...options
    });
  }
}

export class MunecoBebe extends MunecoBase {
  constructor(options = {}) {
    super({
      altura: 0.75,
      headScale: 1.35,
      torsoScale: 0.75,
      legScale: 0.6,
      armScale: 0.7,
      colorRopa: 0xf9a8d4,
      acentoColor: 0xec4899,
      ...options
    });
  }
}

export function crearMuneco(tipo = 'adulto', options = {}) {
  switch (tipo) {
    case 'adulto':
      return new MunecoAdulto(options).group;
    case 'nino':
    case 'niño':
      return new MunecoNino(options).group;
    case 'bebe':
    case 'bebé':
      return new MunecoBebe(options).group;
    default:
      return new MunecoAdulto(options).group;
  }
}
