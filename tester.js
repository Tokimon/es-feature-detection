const path = require('path');

const detect = require('./lib/detectFeatures');
const filter = require('./lib/filterFeatures');
const parser = require('./lib/featureTestParser');

detect(path.resolve('./testfiles/elaborate.js'))
  .then((tests) => { console.log('detected', tests); return tests })
  .then((tests) => filter(tests, ['last 2 versions']))
  .then((tests) => { console.log('filtered', tests); return tests })
  .then((tests) => {
    parser.compose(tests)
      .then((composed) => console.log(composed.lines.join('\n')))

    return tests;
  })
  .then((tests) => parser.write(tests, 'out/featuretest.js'))
  .catch((err) => console.log(err, err.stack || ''));
