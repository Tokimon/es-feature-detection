import _Array_fromAsync from '@/builtins/Array.fromAsync';
import _Error_isError from '@/builtins/Error.isError';
import _Iterator_concat from '@/builtins/Iterator.concat';
import _JSON_isRawJSON from '@/builtins/JSON.isRawJSON';
import _JSON_rawJSON from '@/builtins/JSON.rawJSON';
import _Map_prototype_getOrInsert from '@/builtins/Map.prototype.getOrInsert';
import _Map_prototype_getOrInsertComputed from '@/builtins/Map.prototype.getOrInsertComputed';
import _Math_sumPrecise from '@/builtins/Math.sumPrecise';
import _Uint8Array_fromBase64 from '@/builtins/Uint8Array.fromBase64';
import _Uint8Array_fromHex from '@/builtins/Uint8Array.fromHex';
import _Uint8Array_prototype_setFromBase64 from '@/builtins/Uint8Array.prototype.setFromBase64';
import _Uint8Array_prototype_setFromHex from '@/builtins/Uint8Array.prototype.setFromHex';
import _Uint8Array_prototype_toBase64 from '@/builtins/Uint8Array.prototype.toBase64';
import _Uint8Array_prototype_toHex from '@/builtins/Uint8Array.prototype.toHex';
import _WeakMap_prototype_getOrInsert from '@/builtins/WeakMap.prototype.getOrInsert';
import _WeakMap_prototype_getOrInsertComputed from '@/builtins/WeakMap.prototype.getOrInsertComputed';

export const builtins = () => ({
  'Array.fromAsync': _Array_fromAsync(),
  'Error.isError': _Error_isError(),
  'Iterator.concat': _Iterator_concat(),
  'JSON.isRawJSON': _JSON_isRawJSON(),
  'JSON.rawJSON': _JSON_rawJSON(),
  'Map.prototype.getOrInsert': _Map_prototype_getOrInsert(),
  'Map.prototype.getOrInsertComputed': _Map_prototype_getOrInsertComputed(),
  'Math.sumPrecise': _Math_sumPrecise(),
  'Uint8Array.fromBase64': _Uint8Array_fromBase64(),
  'Uint8Array.fromHex': _Uint8Array_fromHex(),
  'Uint8Array.prototype.setFromBase64': _Uint8Array_prototype_setFromBase64(),
  'Uint8Array.prototype.setFromHex': _Uint8Array_prototype_setFromHex(),
  'Uint8Array.prototype.toBase64': _Uint8Array_prototype_toBase64(),
  'Uint8Array.prototype.toHex': _Uint8Array_prototype_toHex(),
  'WeakMap.prototype.getOrInsert': _WeakMap_prototype_getOrInsert(),
  'WeakMap.prototype.getOrInsertComputed':
    _WeakMap_prototype_getOrInsertComputed(),
});

// All features
export default () => ({
  ...builtins(),
});
