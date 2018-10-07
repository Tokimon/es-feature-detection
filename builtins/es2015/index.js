var assign = require('../../lib/assign');

var array = require('./array.js');
var mapSet = require('./mapSet.js');
var math = require('./math.js');
var misc = require('./misc.js');
var number = require('./number.js');
var object = require('./object.js');
var string = require('./string.js');
var typedarrays = require('./typedarrays.js');

module.exports = () => {
  const arrayTest = array();
  const mapSetTest = mapSet();
  const mathTest = math();
  const miscTest = misc();
  const numberTest = number();
  const objectTest = object();
  const stringTest = string();
  const typedarraysTest = typedarrays();

  return assign(
    {},
    arrayTest,
    mapSetTest,
    mathTest,
    miscTest,
    numberTest,
    objectTest,
    stringTest,
    typedarraysTest,
    {
      __all: (
        arrayTest.__all &&
        mapSetTest.__all &&
        mathTest.__all &&
        miscTest.__all &&
        numberTest.__all &&
        objectTest.__all &&
        stringTest.__all &&
        typedarraysTest.__all
      )
    }
  );
};
