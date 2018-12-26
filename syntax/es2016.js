var testrunner = require('../lib/testrunner').testRunner;
module.exports = function() { return testrunner(require('./es2016.json')); };
