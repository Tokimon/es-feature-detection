import _Atomics from '@/builtins/Atomics';
import _SharedArrayBuffer from '@/builtins/SharedArrayBuffer';

export const builtins = () => ({
  Atomics: _Atomics(),
  SharedArrayBuffer: _SharedArrayBuffer(),
});

// All features
export default () => ({
  ...builtins(),
});
