import { InteractionManager } from './interaction-manager.js';
import { StageManager } from './stage-manager.js';

const container = document.getElementById('board');

const stageManager = new StageManager(container);
const interactionManager = new InteractionManager(stageManager);

interactionManager.start();
