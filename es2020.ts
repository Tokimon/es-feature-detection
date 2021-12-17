// Built-ins
import _BigInt from './builtins/BigInt';
import _globalThis from './builtins/globalThis';
import PromiseAllSettled from './builtins/Promise.allSettled';
import StringPrototypeMatchAll from './builtins/String.prototype.matchAll';

// Syntax
import DynamicImport from './syntax/DynamicImport';
import NullishCoalescing from './syntax/NullishCoalescing';
import OptionalChaining from './syntax/OptionalChaining';



export const builtins = () => ({
  'BigInt': _BigInt(),
  'globalThis': _globalThis(),
  'Promise.allSettled': PromiseAllSettled(),
  'String.prototype.matchAll': StringPrototypeMatchAll()
});

export const syntax = () => ({
  DynamicImport: DynamicImport(),
  NullishCoalescing: NullishCoalescing(),
  OptionalChaining: OptionalChaining()
});

// All features
export default () => ({
  ...builtins(),
  ...syntax()
});
