var testrunner = require('../lib/testrunner').testRunner;
var es2015Tests = require('./es2015.json');

module.exports = function es2015() {
  return testrunner(es2015Tests);
};
