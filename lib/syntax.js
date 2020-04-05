const writeIndex = require('./writeIndex');

module.exports = () => writeIndex(
  'syntax',
  (fileName, variable) => `import ${variable}, { entryName as ${variable}Name } from './${fileName}';`,
  (fileName, variable) => `[${variable}Name]: ${variable}()`
);
