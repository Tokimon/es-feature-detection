const writeTestFile = require('./writeTestFile');



Promise.all([
  writeTestFile('builtins'),
  writeTestFile('dom'),
  writeTestFile('localization'),
  writeTestFile('syntax', 'testEntry')
])
  .then(() => console.log('All test files built!'))
