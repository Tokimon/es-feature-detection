import Int8ArrayIncludes from './Int8Array.prototype.includes';
import Uint8ArrayIncludes from './Uint8Array.prototype.includes';
import Uint8ClampedArrayIncludes from './Uint8ClampedArray.prototype.includes';
import Int16ArrayIncludes from './Int16Array.prototype.includes';
import Uint16ArrayIncludes from './Uint16Array.prototype.includes';
import Int32ArrayIncludes from './Int32Array.prototype.includes';
import UInt32ArrayIncludes from './UInt32Array.prototype.includes';
import Float32ArrayIncludes from './Float32Array.prototype.includes';
import Float64ArrayIncludes from './Float64Array.prototype.includes';

export default () => ({
  'Float32Array.prototype.includes': Float32ArrayIncludes(),
  'Float64Array.prototype.includes': Float64ArrayIncludes(),
  'Int8Array.prototype.includes': Int8ArrayIncludes(),
  'Int16Array.prototype.includes': Int16ArrayIncludes(),
  'Int32Array.prototype.includes': Int32ArrayIncludes(),
  'Uint8Array.prototype.includes': Uint8ArrayIncludes(),
  'Uint8ClampedArray.prototype.includes': Uint8ClampedArrayIncludes(),
  'Uint16Array.prototype.includes': Uint16ArrayIncludes(),
  'Uint32Array.prototype.includes': UInt32ArrayIncludes()
});
