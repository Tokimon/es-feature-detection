// Built-ins
import ArrayFrom from './builtins/Array.from';
import ArrayOf from './builtins/Array.of';
import ArrayPrototypeCopyWithin from './builtins/Array.prototype.copyWithin';
import ArrayPrototypeEntries from './builtins/Array.prototype.entries';
import ArrayPrototypeFill from './builtins/Array.prototype.fill';
import ArrayPrototypeFind from './builtins/Array.prototype.find';
import ArrayPrototypeFindIndex from './builtins/Array.prototype.findIndex';
import ArrayPrototypeKeys from './builtins/Array.prototype.keys';
import _ArrayBuffer from './builtins/ArrayBuffer';
import _atob from './builtins/atob';
import _btoa from './builtins/btoa';
import _DataView from './builtins/DataView';
import _Float32Array from './builtins/Float32Array';
import _Float64Array from './builtins/Float64Array';
import _Int8Array from './builtins/Int8Array';
import _Int16Array from './builtins/Int16Array';
import _Int32Array from './builtins/Int32Array';
import _Map from './builtins/Map';
import MathAcosh from './builtins/Math.acosh';
import MathAsinh from './builtins/Math.asinh';
import MathCbrt from './builtins/Math.cbrt';
import MathClz32 from './builtins/Math.clz32';
import MathCosh from './builtins/Math.cosh';
import MathExpm1 from './builtins/Math.expm1';
import MathFround from './builtins/Math.fround';
import MathHypot from './builtins/Math.hypot';
import MathImul from './builtins/Math.imul';
import MathLog1p from './builtins/Math.log1p';
import MathLog2 from './builtins/Math.log2';
import MathLog10 from './builtins/Math.log10';
import MathSign from './builtins/Math.sign';
import MathSinh from './builtins/Math.sinh';
import MathTanh from './builtins/Math.tanh';
import MathTrunc from './builtins/Math.trunc';
import newTarget from './builtins/new.target';
import NumberEpsilon from './builtins/Number.EPSILON';
import NumberIsFinite from './builtins/Number.isFinite';
import NumberIsInteger from './builtins/Number.isInteger';
import NumberIsNaN from './builtins/Number.isNaN';
import NumberIsSafeInteger from './builtins/Number.isSafeInteger';
import NumberMaxSafeInteger from './builtins/Number.MAX_SAFE_INTEGER';
import NumberMinSafeInteger from './builtins/Number.MIN_SAFE_INTEGER';
import NumberParseInt from './builtins/Number.parseInt';
import NumberParseFloat from './builtins/Number.parseFloat';
import ObjectAssign from './builtins/Object.assign';
import ObjectGetOwnPropertySymbols from './builtins/Object.getOwnPropertySymbols';
import ObjectIs from './builtins/Object.is';
import ObjectPrototypeProto from './builtins/Object.prototype.__proto__';
import ObjectSetPrototypeOf from './builtins/Object.setPrototypeOf';
import _Promise from './builtins/Promise';
import _Proxy from './builtins/Proxy';
import _Reflect from './builtins/Reflect';
import RegExpPrototypeSticky from './builtins/RegExp.prototype.sticky';
import _Set from './builtins/Set';
import StringFromCodePoint from './builtins/String.fromCodePoint';
import StringPrototypeCodePointAt from './builtins/String.prototype.codePointAt';
import StringPrototypeEndsWith from './builtins/String.prototype.endsWith';
import StringPrototypeIncludes from './builtins/String.prototype.includes';
import StringPrototypeNormalize from './builtins/String.prototype.normalize';
import StringPrototypeRepeat from './builtins/String.prototype.repeat';
import StringPrototypeStartsWith from './builtins/String.prototype.startsWith';
import StringRaw from './builtins/String.raw';
import _Symbol from './builtins/Symbol';
import _Uint8Array from './builtins/Uint8Array';
import _Uint8ClampedArray from './builtins/Uint8ClampedArray';
import _Uint16Array from './builtins/Uint16Array';
import _Uint32Array from './builtins/Uint32Array';
import _WeakMap from './builtins/WeakMap';
import _WeakSet from './builtins/WeakSet';

// Syntax
import arrowFunction from './syntax/arrowFunction';
import binaryLiterals from './syntax/binaryLiterals';
import blockLevelFunctionDeclaration from './syntax/blockLevelFunctionDeclaration';
import _class from './syntax/class';
import computedProperty from './syntax/computedProperty';
import constLet from './syntax/constLet';
import defaultParameters from './syntax/defaultParameters';
import destructuring from './syntax/destructuring';
import forOf from './syntax/forOf';
import generatorFunction from './syntax/generatorFunction';
import octalLiterals from './syntax/octalLiterals';
import restParameters from './syntax/restParameters';
import shorthandMethod from './syntax/shorthandMethod';
import shorthandProperty from './syntax/shorthandProperty';
import spreadArray from './syntax/spreadArray';
import spreadFunctionCall from './syntax/spreadFunctionCall';
import templateStrings from './syntax/templateStrings';



export const builtins = () => ({
  'Array.from': ArrayFrom(),
  'Array.of': ArrayOf(),
  'Array.prototype.copyWithin': ArrayPrototypeCopyWithin(),
  'Array.prototype.entries': ArrayPrototypeEntries(),
  'Array.prototype.fill': ArrayPrototypeFill(),
  'Array.prototype.find': ArrayPrototypeFind(),
  'Array.prototype.findIndex': ArrayPrototypeFindIndex(),
  'Array.prototype.keys': ArrayPrototypeKeys(),
  ArrayBuffer: _ArrayBuffer(),
  atob: _atob(),
  btoa: _btoa(),
  DataView: _DataView(),
  Float32Array: _Float32Array(),
  Float64Array: _Float64Array(),
  Int8Array: _Int8Array(),
  Int16Array: _Int16Array(),
  Int32Array: _Int32Array(),
  Map: _Map(),
  'Math.acosh': MathAcosh(),
  'Math.asinh': MathAsinh(),
  'Math.cosh': MathCosh(),
  'Math.cbrt': MathCbrt(),
  'Math.clz32': MathClz32(),
  'Math.expm1': MathExpm1(),
  'Math.fround': MathFround(),
  'Math.hypot': MathHypot(),
  'Math.imul': MathImul(),
  'Math.log1p': MathLog1p(),
  'Math.log2': MathLog2(),
  'Math.log10': MathLog10(),
  'Math.sign': MathSign(),
  'Math.sinh': MathSinh(),
  'Math.tanh': MathTanh(),
  'Math.trunc': MathTrunc(),
  'new.target': newTarget(),
  'Number.EPSILON': NumberEpsilon(),
  'Number.isFinite': NumberIsFinite(),
  'Number.isInteger': NumberIsInteger(),
  'Number.isNaN': NumberIsNaN(),
  'Number.isSafeInteger': NumberIsSafeInteger(),
  'Number.MAX_SAFE_INTEGER': NumberMaxSafeInteger(),
  'Number.MIN_SAFE_INTEGER': NumberMinSafeInteger(),
  'Number.parseInt': NumberParseInt(),
  'Number.parseFloat': NumberParseFloat(),
  'Object.assign': ObjectAssign(),
  'Object.getOwnPropertySymbols': ObjectGetOwnPropertySymbols(),
  'Object.is': ObjectIs(),
  'Object.prototype.__proto__': ObjectPrototypeProto(),
  'Object.setPrototypeOf': ObjectSetPrototypeOf(),
  Promise: _Promise(),
  Proxy: _Proxy(),
  Reflect: _Reflect(),
  'RegExp.prototype.sticky': RegExpPrototypeSticky(),
  Set: _Set(),
  'String.fromCodePoint': StringFromCodePoint(),
  'String.prototype.codePointAt': StringPrototypeCodePointAt(),
  'String.prototype.endsWith': StringPrototypeEndsWith(),
  'String.prototype.includes': StringPrototypeIncludes(),
  'String.prototype.normalize': StringPrototypeNormalize(),
  'String.prototype.repeat': StringPrototypeRepeat(),
  'String.prototype.startsWith': StringPrototypeStartsWith(),
  'String.raw': StringRaw(),
  Symbol: _Symbol(),
  Uint8Array: _Uint8Array(),
  Uint8ClampedArray: _Uint8ClampedArray(),
  Uint16Array: _Uint16Array(),
  Uint32Array: _Uint32Array(),
  WeakMap: _WeakMap(),
  WeakSet: _WeakSet()
});

export const syntax = () => ({
  arrowFunction: arrowFunction(),
  binaryLiterals: binaryLiterals(),
  blockLevelFunctionDeclaration: blockLevelFunctionDeclaration(),
  _class: _class(),
  computedProperty: computedProperty(),
  constLet: constLet() ,
  defaultParameters: defaultParameters(),
  destructuring: destructuring(),
  forOf: forOf(),
  generatorFunction: generatorFunction(),
  octalLiterals: octalLiterals(),
  restParameters: restParameters(),
  shorthandMethod: shorthandMethod(),
  shorthandProperty: shorthandProperty(),
  spreadArray: spreadArray(),
  spreadFunctionCall: spreadFunctionCall(),
  templateStrings: templateStrings()
});

// All features
export default () => ({
  ...builtins(),
  ...syntax()
});
