var testrunner = require('../lib/testrunner').testRunner;
module.exports = () => testrunner(require('./es2017.json'));
