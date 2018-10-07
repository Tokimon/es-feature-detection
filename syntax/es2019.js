var testrunner = require('../lib/testrunner').testRunner;
var es2019Tests = require('./es2019.json');

module.exports = function es2019() {
  return testrunner(es2019Tests);
};
