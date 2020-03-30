import ObjectEntries from './Object.entries';
import ObjectGetOwnPropertyDescriptors from './Object.getOwnPropertyDescriptors';
import ObjectValues from './Object.values';
import StringPrototypePadEnd from './String.prototype.padEnd';
import StringPrototypePadStart from './String.prototype.padStart';
import _Atomics from './Atomics';
import _SharedArrayBuffer from './SharedArrayBuffer';

export default () => ({
  Atomics: _Atomics(),
  'Object.entries': ObjectEntries(),
  'Object.getOwnPropertyDescriptors': ObjectGetOwnPropertyDescriptors(),
  'Object.values': ObjectValues(),
  SharedArrayBuffer: _SharedArrayBuffer(),
  'String.prototype.padEnd': StringPrototypePadEnd(),
  'String.prototype.padStart': StringPrototypePadStart()
});
