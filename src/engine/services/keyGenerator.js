const generatedKeysSet = new Set();

const randomHexString = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

export const nextKey = (prefix = '') => {
  let generated = null;

  while (generated === null || generatedKeysSet.has(generated)) {
    generated = randomHexString(16);
  }

  generatedKeysSet.add(generated);

  return (prefix.length > 0 ? `${prefix}-${generated}` : generated);
};

