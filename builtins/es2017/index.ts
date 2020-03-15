import _Object from './Object';
import _String from './String';
import _Atomics from './Atomics';
import _SharedArrayBuffer from './SharedArrayBuffer';

export default () => ({
  Atomics: _Atomics(),
  SharedArrayBuffer: _SharedArrayBuffer(),
  ..._Object(),
  ..._String()
});
