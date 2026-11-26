import _ArrayBuffer_prototype_detached from '@/builtins/ArrayBuffer.prototype.detached';
import _ArrayBuffer_prototype_resize from '@/builtins/ArrayBuffer.prototype.resize';
import _ArrayBuffer_prototype_transfer from '@/builtins/ArrayBuffer.prototype.transfer';
import _ArrayBuffer_prototype_transferToFixedLength from '@/builtins/ArrayBuffer.prototype.transferToFixedLength';
import _Atomics_waitAsync from '@/builtins/Atomics.waitAsync';
import _Map_groupBy from '@/builtins/Map.groupBy';
import _Object_groupBy from '@/builtins/Object.groupBy';
import _Promise_withResolvers from '@/builtins/Promise.withResolvers';

export const builtins = () => ({
  'ArrayBuffer.prototype.detached': _ArrayBuffer_prototype_detached(),
  'ArrayBuffer.prototype.resize': _ArrayBuffer_prototype_resize(),
  'ArrayBuffer.prototype.transfer': _ArrayBuffer_prototype_transfer(),
  'ArrayBuffer.prototype.transferToFixedLength':
    _ArrayBuffer_prototype_transferToFixedLength(),
  'Atomics.waitAsync': _Atomics_waitAsync(),
  'Map.groupBy': _Map_groupBy(),
  'Object.groupBy': _Object_groupBy(),
  'Promise.withResolvers': _Promise_withResolvers(),
});

// All features
export default () => ({
  ...builtins(),
});
