const path = require('path');

const detect = require('./lib/detectFeatures');
const filter = require('./lib/filterFeatures');
const write = require('./lib/featureTestParser').write;

detect(path.resolve('./testfiles/elaborate.js'))
  .then((tests) => { console.log('detected', tests); return tests })
  .then((tests) => filter(tests, ['last 2 versions']))
  .then((tests) => { console.log('filtered', tests); return tests })
  .then((tests) => write(tests, './reducedFeaturesTests.js'))
  .catch((err) => console.log(err, err.stack));
