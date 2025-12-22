import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';

/**
 * Gestiona la creación y eliminación de muñecos dentro de una escena Three.js.
 */
export class MunecoManager {
  constructor(scene) {
    this.scene = scene;
    this.munecos = new Map();
    this.nextId = 1;
  }

  /**
   * Crea un nuevo muñeco y lo agrega a la escena.
   * @param {string} tipo - Tipo de muñeco (cubo o esfera).
   * @param {object} opts - Opciones de configuración.
   * @returns {string} id único del muñeco creado.
   */
  addMuneco(tipo, opts = {}) {
    const { position = { x: 0, y: 0.5, z: 0 }, color = 0x2194ce, size = 1 } = opts;

    const mesh = this.#crearMalla(tipo, size, color);
    mesh.position.set(position.x, position.y, position.z);

    const id = `${tipo}-${this.nextId++}`;
    this.munecos.set(id, { id, tipo, mesh, opts: { position, color, size } });

    this.scene.add(mesh);

    return id;
  }

  /**
   * Elimina un muñeco existente tanto de la escena como de la memoria.
   * @param {string} id - Identificador del muñeco.
   * @returns {boolean} true si se eliminó, false si no existía.
   */
  removeMuneco(id) {
    const record = this.munecos.get(id);
    if (!record) return false;

    this.scene.remove(record.mesh);
    record.mesh.geometry.dispose();
    if (record.mesh.material.dispose) record.mesh.material.dispose();

    this.munecos.delete(id);
    return true;
  }

  #crearMalla(tipo, size, color) {
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.1 });

    if (tipo === 'esfera' || tipo === 'sphere') {
      return new THREE.Mesh(new THREE.SphereGeometry(size * 0.6, 32, 16), material);
    }

    // Por defecto, un cubo.
    const geometry = new THREE.BoxGeometry(size, size, size);
    return new THREE.Mesh(geometry, material);
  }
}
