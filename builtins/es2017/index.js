var assign = require('../../lib/assign');

var misc = require('./misc.js');
var object = require('./object.js');
var string = require('./string.js');

module.exports = () => {
  const miscTest = misc();
  const objectTest = object();
  const stringTest = string();

  return assign(
    {},
    miscTest,
    objectTest,
    stringTest,
    {
      __all: (
        miscTest.__all &&
        objectTest.__all &&
        stringTest.__all
      )
    }
  );
};
