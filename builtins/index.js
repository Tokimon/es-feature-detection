var assign = require('../lib/assign');
var testrunner = require('../lib/testrunner').testRunner;

var es2015 = require('./es2015');
var es2016 = require('./es2016');
var es2017 = require('./es2017');
var localization = require('./localization');

function builtins() {
  var es2015Test = testrunner(es2015);
  var es2016Test = testrunner(es2016);
  var es2017Test = testrunner(es2017);
  var localizationTest = testrunner(localization);

  var result = assign({
    es2015: es2015Test,
    es2016: es2016Test,
    es2017: es2017Test,
    localization: localizationTest
  }, es2015Test, es2016Test, es2017Test, localizationTest);

  result.__all = es2015Test.__all && es2016Test.__all && es2017Test.__all && localizationTest.__all;

  return result;
}

module.exports = { builtins: builtins };
