import assign from '../../lib/assign';

import misc from './misc.js';
import object from './object.js';
import string from './string.js';

export default () => {
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
