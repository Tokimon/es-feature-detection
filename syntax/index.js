var assign = require('../lib/assign');

var es2015 = require('./es2015');
var es2016 = require('./es2016');
var es2017 = require('./es2017');

function syntax() {
  var es2015Test = es2015();
  var es2016Test = es2016();
  var es2017Test = es2017();

  var result = assign({
    es2015: es2015(),
    es2016: es2016(),
    es2017: es2017()
  }, es2015Test, es2016Test, es2017Test);

  result.__all = es2015Test.__all && es2016Test.__all && es2017Test.__all;

  return result;
}

module.exports = { syntax: syntax };
