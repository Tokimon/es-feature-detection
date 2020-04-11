const writeIndex = require('./writeIndex');



Promise.all([
  writeIndex('builtins'),
  writeIndex('dom'),
  writeIndex('localization'),
  writeIndex('syntax', true)
])
  .then(() => console.log('All index files built!'))
