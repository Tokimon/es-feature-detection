// Built-ins
import _Atomics from './builtins/Atomics';
import ObjectEntries from './builtins/Object.entries';
import ObjectGetOwnPropertyDescriptors from './builtins/Object.getOwnPropertyDescriptors';
import ObjectValues from './builtins/Object.values';
import _SharedArrayBuffer from './builtins/SharedArrayBuffer';
import StringPrototypePadEnd from './builtins/String.prototype.padEnd';
import StringPrototypePadStart from './builtins/String.prototype.padStart';

// Syntax
import asyncAwait, { entryName as asyncAwaitName } from './syntax/asyncAwait';
import trailingParameterCommas, { entryName as trailingParameterCommasName } from './syntax/trailingParameterCommas';



export const builtins = () => ({
  Atomics: _Atomics(),
  'Object.entries': ObjectEntries(),
  'Object.getOwnPropertyDescriptors': ObjectGetOwnPropertyDescriptors(),
  'Object.values': ObjectValues(),
  SharedArrayBuffer: _SharedArrayBuffer(),
  'String.prototype.padEnd': StringPrototypePadEnd(),
  'String.prototype.padStart': StringPrototypePadStart()
});

export const syntax = () => ({
  [asyncAwaitName]: asyncAwait(),
  [trailingParameterCommasName]: trailingParameterCommas()
});

// All features
export default () => ({
  ...builtins(),
  ...syntax()
});
