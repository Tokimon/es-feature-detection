var testrunner = require('../lib/testrunner').testRunner;
var es2016Tests = require('./es2016.json');

module.exports = function es2016() {
  return testrunner(es2016Tests);
};
