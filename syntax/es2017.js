var testrunner = require('../lib/testrunner').testRunner;
var es2017Tests = require('./es2017.json');

module.exports = function es2017() {
  return testrunner(es2017Tests);
};
