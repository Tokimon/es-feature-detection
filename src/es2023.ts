import _WeakMap_symbolKeys from '@/builtins/WeakMap.symbolKeys';

export const builtins = () => ({
  'WeakMap.symbolKeys': _WeakMap_symbolKeys(),
});

// All features
export default () => ({
  ...builtins(),
});
