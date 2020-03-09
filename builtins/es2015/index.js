import assign from '../../lib/assign';

import array from './array.js';
import customEvent from './CustomEvent.js';
import mapSet from './mapSet.js';
import math from './math.js';
import misc from './misc.js';
import number from './number.js';
import object from './object.js';
import string from './string.js';
import typedarrays from './typedarrays.js';

export default () => {
  const arrayTest = array();
  const customEventTest = customEvent();
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
    customEventTest,
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
        customEventTest.__all &&
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
