import config from '/src/config';

export const info = (...args) => console.log(...args);

export const debug = (...args) => config.debug && info(...args);

