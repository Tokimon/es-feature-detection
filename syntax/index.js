var testrunner = require('../lib/testrunner');

var es2015 = require('./es2015.json');
var es2016 = require('./es2016.json');
var es2017 = require('./es2017.json');

module.exports = function syntax() {
  const es2015ok = testrunner(es2015);
  const es2016ok = testrunner(es2016);
  const es2017ok = testrunner(es2017);

  return {
    es2015: es2015ok,
    es2016: es2016ok,
    es2017: es2017ok
  };
};
