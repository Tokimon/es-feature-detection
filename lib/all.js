const builtins = require('./builtins');
const dom = require('./dom');
const localization = require('./localization');
const syntax = require('./syntax');

Promise.all([
  builtins(),
  dom(),
  localization(),
  syntax()
])
  .then(() => console.log('All index files built!'))
