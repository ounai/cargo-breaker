import engineInit from '/src/engine/core/init';
import config from '/src/config';

console.log('Initializing...');

engineInit(config.game);

console.log('Init done, commence game!');

