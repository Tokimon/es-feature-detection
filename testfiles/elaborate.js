// import/export test
import something, { somethingElse, another as ant } from 'something';
import * as all from 'something';

const exportMe = 'val';
export default function exp() {};
export { exportMe as exported };
export const _var = 42;


// Arrow function test
const arrow = () => 'arrow';

const $ = () => { return { is() { return true; }, toJSON() { return {}; } }; }
const obj = { toJSON() {} };

function toJSON() {}

$('nevermind').is('whatever');

const somedate = new Date();
const finaldate = somedate;

const json = toJSON('{ a: 1 }');
const json2 = $().toJSON('{ a: 1 }');
const json3 = obj.toJSON('{ a: 1 }');


const jsonDate = (new Date()).toJSON();
const jsonDate2 = somedate.toJSON();
const jsonDate3 = finaldate.toJSON();

Object.is(null, null);

function arrowThisTest() {
  this.b = 1;
  this.c = function(arr) { return arr.map((n) => this.b + n) }
}

// blockScope tests
{ let a = 1 }


// Class test
class A extends Array {
  static a() {}
  constructor() { this._b=1; }
  get b() {return this._b}
  set b(c) {this_.b=c}
}

class B extends A {
  constructor() {
    super()
  }
}

// Dataset (data-* attribute)
document.body.dataset.someInput = 'test';
const body = document.body;
const inp = body.dataset.someInput;

// Constant test
const a=1; a=2

// Let test
arr = null;
let arr=[], i=0;
for(let i=1;i<=3;i++){ arr.push(function(){return i}); }

// Template strings
const cool = 'are cool';
`Template string ${cool}`;

function ctm(b, c) {
  return b[0]+c;
}

ctm`d${1}`;

// Destructuring
const [a,b,u]=[1,2];
const {c, d:e, e:{f:g}, h='i'} = {c:1,d:2, e:{f:3}};

function dsArr([b,c]){}
function dsObj({b,c}){}

dsArr([1,2]);
dsObj({b:2, c:3});

// Enhanced properties
const prop = 'property';
const obj = {
  prop,
  ['parsed' + 123]: 123,
  method() {}
};

// Binary
(0b10===2)

// Octal
(0o10===8)

// For of test
for(let a of [1,2]) {}

// Object function name
{ a() {} }.a.name;

// Generators
function *gen() { yield; }

// Rest params
function a(...b) { return b.length }

// Sticky RegExp
const y=/./y.sticky;

// Spread param
const spread=[1,2], newArr=[3,...spread];
(function cb(d,e,f){})(...newArr);

// Symbol
const sym = Symbol("a");
sym +'';
const sym2 = Symbol.for("b.c");
Symbol.keyFor(sym2) === "b.c";


function test(x) { return x.codePointAt(1); }

const cc = document.querySelector('canvas');
cc.getContext('2d');


// Features
const features = {
  'Array': {
    'from': () => Array.from(),
    'isArray': () => Array.isArray(),
    'of': () => () => Array.of(),
    'concat': () => () => [].concat(),
    'copyWithin': () => [].copyWithin(),
    'entries': () => [].entries(),
    'every': () => [].every(),
    'fill': () => [].fill(),
    'filter': () => [].filter(),
    'find': () => [].find(),
    'findIndex': () => [].findIndex(),
    'forEach': () => [].forEach(),
    'includes': () => [].includes(),
    'indexOf': () => [].indexOf(),
    'keys': () => [].keys(),
    'lastIndexOf': () => [].lastIndexOf(),
    'map': () => [].map(),
    'reduce': () => [].reduce(),
    'reduceRight': () => [].reduceRight(),
    'some': () => [].some(),
    'values': () => [].values()
  },

  'Math': {
    'imul': () => Math.imul(),
    'clz32': () => Math.clz32(),
    'fround': () => Math.fround(),
    'log10': () => Math.log10(),
    'log2': () => Math.log2(),
    'log1p': () => Math.log1p(),
    'expm1': () => Math.expm1(),
    'cosh': () => Math.cosh(),
    'sinh': () => Math.sinh(),
    'tanh': () => Math.tanh(),
    'acosh': () => Math.acosh(),
    'asinh': () => Math.asinh(),
    'atanh': () => Math.atanh(),
    'hypot': () => Math.hypot(),
    'trunc': () => Math.trunc(),
    'sign': () => Math.sign(),
    'cbrt': () => Math.cbrt()
  },

  'Object': {
    'assign': () => Object.assign(),
    'create': () => Object.create(),
    'entries': () => Object.entries(),
    'getPrototypeOf': () => Object.getPrototypeOf(),
    'is': () => Object.is(),
    'keys': () => Object.keys(),
    'setPrototypeOf': () => Object.setPrototypeOf(),
    'values': () => Object.values()
  },

  'String': {
    'fromCodePoint': () => String.fromCodePoint(),
    //'codePointAt': () => ''.codePointAt(),
    'endsWith': () => ''.endsWith(),
    'includes': () => ''.includes(),
    'localeCompare': () => ''.localeCompare(),
    'normalize': () => ''.normalize(),
    'padEnd': () => ''.padEnd(),
    'padStart': () => ''.padStart(),
    'repeat': () => ''.repeat(),
    'search': () => ''.search(),
    'startsWith': () => ''.startsWith(),
    'trim': () => ''.trim(),
    'trimLeft': () => ''.trimLeft(),
    'trimRight': () => ''.trimRight(),
    'raw': () => String.raw(),
  },

  'Intl': () => new Intl.Collator(),

  'ArrayBuffer': () => new ArrayBuffer(),
  'DataView': () => new DataView(),
  'Float32Array': () => new Float32Array(),
  'Float64Array': () => new Float64Array(),
  'Int16Array': () => new Int16Array(),
  'Int32Array': () => new Int32Array(),
  'Int8Array': () => new Int8Array(),
  'Map': () => new Map(),
  'Promise': () => new Promise(),
  'Proxy': () => new Proxy(),
  'Reflect': () => new Reflect(),
  'RegExp': () => new RegExp(),
  'Set': () => new Set(),
  'Symbol': () => new Symbol(),
  'Uint16Array': () => new Uint16Array(),
  'Uint32Array': () => new Uint32Array(),
  'Uint8Array': () => new Uint8Array(),
  'Uint8ClampedArray': () => new Uint8ClampedArray(),
  'WeakMap': () => new WeakMap(),
  'WeakSet': new WeakSet()
};
