var assign = require('../lib/assign');

var es2015 = require('./es2015');
var es2016 = require('./es2016');
var es2017 = require('./es2017');
var localization = require('./localization');

module.exports = function builtins() {
  var es2015Test = es2015();
  var es2016Test = es2016();
  var es2017Test = es2017();
  var localizationTest = localization();

  var result = assign(
    {
      es2015: es2015Test,
      es2016: es2016Test,
      es2017: es2017Test,
      localization: localizationTest
    },
    es2015Test,
    es2016Test,
    es2017Test,
    localizationTest
  );

  result.__all = es2015Test.__all && es2016Test.__all && es2017Test.__all && localizationTest.__all;

  return result;
};
