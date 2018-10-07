var testrunner = require('../lib/testrunner').testRunner;
var es2018Tests = require('./es2018.json');

module.exports = function es2018() {
  return testrunner(es2018Tests);
};
