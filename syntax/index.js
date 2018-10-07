var assign = require('../lib/assign');

var es2015 = require('./es2015');
var es2016 = require('./es2016');
var es2017 = require('./es2017');
var es2018 = require('./es2018');
var es2019 = require('./es2019');

module.exports = function syntax() {
  var es2015Test = es2015();
  var es2016Test = es2016();
  var es2017Test = es2017();
  var es2018Test = es2018();
  var es2019Test = es2019();

  var result = assign(
    {
      es2015: es2015Test,
      es2016: es2016Test,
      es2017: es2017Test,
      es2018: es2018Test,
      es2019: es2019Test
    },
    es2015Test,
    es2016Test,
    es2017Test,
    es2018Test,
    es2019Test,
    {
      __all: (
        es2015Test.__all &&
        es2016Test.__all &&
        es2017Test.__all &&
        es2018Test.__all &&
        es2019Test.__all
      )
    }
  );

  return result;
};
