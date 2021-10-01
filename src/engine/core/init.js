import Game from '/src/engine/core/Game';

const requireAll = r => {
  const required = [];

  for (let key of r.keys()) {
    required.push(r(key).default);
  }

  return required;
};

const loadScenes = () => {
  console.log('Loading scenes...');

  const scenes = requireAll(require.context('/src/game/scenes', true, /\.js$/));

  console.log('Loaded', scenes.length, 'scenes');

  return scenes;
};

const createGame = (config = {}) => {
  console.log('Creating game...');

  new Game({ ...config, scene: loadScenes() });
};

const initializeEngine = config => {
  console.log('Initializing engine...');

  createGame(config);

  console.log('Engine initialized!');
};

export default initializeEngine;

