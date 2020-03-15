import NumberIsNaN from './Number.isNaN';
import NumberIsFinite from './Number.isFinite';
import NumberIsInteger from './Number.isInteger';
import NumberParseInt from './Number.parseInt';
import NumberParseFloat from './Number.parseFloat';
import NumberEpsilon from './Number.EPSILON';
import NumberMaxSafeInteger from './Number.MAX_SAFE_INTEGER';
import NumberMinSafeInteger from './Number.MIN_SAFE_INTEGER';
import NumberIsSafeInteger from './Number.isSafeInteger';

export default () => ({
  'Number.isNaN': NumberIsNaN(),
  'Number.isFinite': NumberIsFinite(),
  'Number.isInteger': NumberIsInteger(),
  'Number.parseInt': NumberParseInt(),
  'Number.parseFloat': NumberParseFloat(),
  'Number.EPSILON': NumberEpsilon(),
  'Number.MAX_SAFE_INTEGER': NumberMaxSafeInteger(),
  'Number.MIN_SAFE_INTEGER': NumberMinSafeInteger(),
  'Number.isSafeInteger': NumberIsSafeInteger()
});
