import { createCamera } from './camera.js';
import { createRenderer } from './renderer.js';
import { createScene } from './scene.js';
import { addLights } from './lights.js';

/**
 * Encapsulates the creation and maintenance of the core Three.js objects.
 */
export class StageManager {
  /**
   * @param {HTMLElement} container - DOM container used for sizing and attaching the renderer.
   */
  constructor(container) {
    this.container = container;
    this.scene = createScene();
    this.camera = createCamera(container);
    this.renderer = createRenderer(container);

    addLights(this.scene);
  }

  /**
   * Resize camera and renderer to stay in sync with the container dimensions.
   */
  resize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }
}
