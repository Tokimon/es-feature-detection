// Built-ins
import ArrayPrototypeFlat from './builtins/Array.prototype.flat';
import ArrayPrototypeFlatMap from './builtins/Array.prototype.flatMap';
import ObjectFromEntries from './builtins/Object.fromEntries';
import StringPrototypeTrimEnd from './builtins/String.prototype.trimEnd';
import StringPrototypeTrimStart from './builtins/String.prototype.trimStart';
import SymbolPrototypeDescription from './builtins/Symbol.prototype.description';

// Syntax
import JSONSuperset from './syntax/JSONSuperset';
import optionalCatchBinding from './syntax/optionalCatchBinding';
import WellFormedJsonStringify from './syntax/WellFormedJsonStringify';



export const builtins = () => ({
  'Array.prototype.flat': ArrayPrototypeFlat(),
  'Array.prototype.flatMap': ArrayPrototypeFlatMap(),
  'Object.fromEntries': ObjectFromEntries(),
  'String.prototype.trimEnd': StringPrototypeTrimEnd(),
  'String.prototype.trimStart': StringPrototypeTrimStart(),
  'Symbol.prototype.description': SymbolPrototypeDescription()
});

export const syntax = () => ({
  JSONSuperset: JSONSuperset(),
  optionalCatchBinding: optionalCatchBinding(),
  WellFormedJsonStringify: WellFormedJsonStringify()
});

// All features
export default () => ({
  ...builtins(),
  ...syntax()
});
