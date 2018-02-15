var testrunner = require('../lib/testrunner').testRunner;

var es2015 = require('./es2015.json');
var es2016 = require('./es2016.json');
var es2017 = require('./es2017.json');

function syntax() {
  var es2015Test = testrunner(es2015, 'es2015');
  var es2016Test = testrunner(es2016, 'es2015');
  var es2017Test = testrunner(es2017, 'es2015');

  var result = Object.assign({
    es2015: es2015Test,
    es2016: es2016Test,
    es2017: es2017Test
  }, es2015Test, es2016Test, es2017Test);

  result.__all = es2015Test.__all && es2016Test.__all && es2017Test.__all;

  return result;
}

module.exports = { syntax };
