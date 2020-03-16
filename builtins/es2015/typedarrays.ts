import _ArrayBuffer from './ArrayBuffer';
import _DataView from './DataView';
import _Int8Array from './Int8Array';
import _Uint8Array from './Uint8Array';
import _Uint8ClampedArray from './Uint8ClampedArray';
import _Int16Array from './Int16Array';
import _Uint16Array from './Uint16Array';
import _Int32Array from './Int32Array';
import _Uint32Array from './Uint32Array';
import _Float32Array from './Float32Array';
import _Float64Array from './Float64Array';

export default () => ({
  ArrayBuffer: _ArrayBuffer(),
  DataView: _DataView(),
  Int8Array: _Int8Array(),
  Uint8Array: _Uint8Array(),
  Uint8ClampedArray: _Uint8ClampedArray(),
  Int16Array: _Int16Array(),
  Uint16Array: _Uint16Array(),
  Int32Array: _Int32Array(),
  Uint32Array: _Uint32Array(),
  Float32Array: _Float32Array(),
  Float64Array: _Float64Array()
});
