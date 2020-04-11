// Built-ins
import _BigInt from './builtins/BigInt';
import _globalThis from './builtins/globalThis';
import PromiseAllSettled from './builtins/Promise.allSettled';
import StringPrototypeMatchAll from './builtins/String.prototype.matchAll';

// Syntax
import DynamicImport, { entryName as DynamicImportName } from './syntax/DynamicImport';
import NullishCoalescing, { entryName as NullishCoalescingName } from './syntax/NullishCoalescing';
import OptionalChaining, { entryName as OptionalChainingName } from './syntax/OptionalChaining';



export const builtins = () => ({
  'BigInt': _BigInt(),
  'globalThis': _globalThis(),
  'Promise.allSettled': PromiseAllSettled(),
  'String.prototype.matchAll': StringPrototypeMatchAll()
});

export const syntax = () => ({
  [DynamicImportName]: DynamicImport(),
  [NullishCoalescingName]: NullishCoalescing(),
  [OptionalChainingName]: OptionalChaining()
});

// All features
export default () => ({
  ...builtins(),
  ...syntax()
});
