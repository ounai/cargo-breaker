import engineInit from '/src/engine/core/init';
import config from '/src/config';

console.log('Initializing...');

const { width, height } = config.game;

engineInit({ width, height });

