// Collections
import ArrayIncludes from './Array.prototype.includes';
import TypedArrayIncludes from './typedArrays.prototype.includes';

export default () => ({
  'Array.prototype.includes': ArrayIncludes(),
  ...TypedArrayIncludes()
});
