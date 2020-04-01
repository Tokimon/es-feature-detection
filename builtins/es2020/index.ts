import _BigInt from './BigInt';
import _globalThis from './globalThis';
import PromiseAllSettled from './Promise.allSettled';
import StringPrototypeMatchAll from './String.prototype.matchAll';

export default () => ({
  'BigInt': _BigInt(),
  'globalThis': _globalThis(),
  'Promise.allSettled': PromiseAllSettled(),
  'String.prototype.matchAll': StringPrototypeMatchAll()
});
