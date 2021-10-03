import { debug } from '/src/engine/services/log';

import Game from '/src/engine/core/Game';

const requireAll = r => {
  const required = [];

  for (let key of r.keys()) {
    required.push(r(key).default);
  }

  return required;
};

const loadScenes = () => {
  debug('[init] Loading scenes...');

  // eslint-disable-next-line no-undef
  const scenes = requireAll(require.context('/src/game/scenes', true, /\.js$/));

  debug('[init] Loaded', scenes.length, 'scenes');

  return scenes;
};

const createGame = (config = {}) => {
  debug('[init] Creating game...');

  new Game({ ...config, scene: loadScenes() });
};

const initializeEngine = config => {
  debug('[init] Initializing engine...');

  createGame(config);

  debug('[init] Engine initialized!');
};

export default initializeEngine;

