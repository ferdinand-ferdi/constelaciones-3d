import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';
import { createControls } from './controls.js';

/**
 * Handles user interaction, camera controls, and the render loop.
 */
export class InteractionManager {
  /**
   * @param {import('./stage-manager.js').StageManager} stageManager - Stage manager containing the scene, camera, and renderer.
   */
  constructor(stageManager) {
    this.stageManager = stageManager;
    this.controls = createControls(stageManager.camera, stageManager.renderer);
    this.axesHelper = new THREE.AxesHelper(3);

    this.axesHelper.visible = false; // Toggle to true while debugging orientation
    this.stageManager.scene.add(this.axesHelper);

    this.handleResize = this.handleResize.bind(this);
    this.render = this.render.bind(this);
  }

  /**
   * Attach events and start rendering.
   */
  start() {
    window.addEventListener('resize', this.handleResize);
    this.render();
  }

  /**
   * Keep renderer and camera matched to container size.
   */
  handleResize() {
    this.stageManager.resize();
  }

  /**
   * Update camera controls and render the scene continuously.
   */
  render() {
    this.controls.update();
    this.stageManager.renderer.render(this.stageManager.scene, this.stageManager.camera);
    requestAnimationFrame(this.render);
  }
}
