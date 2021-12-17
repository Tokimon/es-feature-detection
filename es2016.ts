// Built-ins
import ArrayIncludes from './builtins/Array.prototype.includes';
import Float32ArrayIncludes from './builtins/Float32Array.prototype.includes';
import Float64ArrayIncludes from './builtins/Float64Array.prototype.includes';
import Int8ArrayIncludes from './builtins/Int8Array.prototype.includes';
import Int16ArrayIncludes from './builtins/Int16Array.prototype.includes';
import Int32ArrayIncludes from './builtins/Int32Array.prototype.includes';
import Uint8ArrayIncludes from './builtins/Uint8Array.prototype.includes';
import Uint8ClampedArrayIncludes from './builtins/Uint8ClampedArray.prototype.includes';
import Uint16ArrayIncludes from './builtins/Uint16Array.prototype.includes';
import Uint32ArrayIncludes from './builtins/Uint32Array.prototype.includes';

// Syntax
import exponentiationOperator from './syntax/exponentiationOperator';
import nestedRestDestructuring from './syntax/nestedRestDestructuring';
import restParameterDestructuring from './syntax/restParameterDestructuring';



export const builtins = () => ({
  'Array.prototype.includes': ArrayIncludes(),
  'Float32Array.prototype.includes': Float32ArrayIncludes(),
  'Float64Array.prototype.includes': Float64ArrayIncludes(),
  'Int8Array.prototype.includes': Int8ArrayIncludes(),
  'Int16Array.prototype.includes': Int16ArrayIncludes(),
  'Int32Array.prototype.includes': Int32ArrayIncludes(),
  'Uint8Array.prototype.includes': Uint8ArrayIncludes(),
  'Uint8ClampedArray.prototype.includes': Uint8ClampedArrayIncludes(),
  'Uint16Array.prototype.includes': Uint16ArrayIncludes(),
  'Uint32Array.prototype.includes': Uint32ArrayIncludes()
});

export const syntax = () => ({
  exponentiationOperator: exponentiationOperator(),
  nestedRestDestructuring: nestedRestDestructuring(),
  restParameterDestructuring: restParameterDestructuring()
});

// All features
export default () => ({
  ...builtins(),
  ...syntax()
});
