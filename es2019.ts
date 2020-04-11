// Built-ins
import ArrayPrototypeFlat from './builtins/Array.prototype.flat';
import ArrayPrototypeFlatMap from './builtins/Array.prototype.flatMap';
import ObjectFromEntries from './builtins/Object.fromEntries';
import StringPrototypeTrimEnd from './builtins/String.prototype.trimEnd';
import StringPrototypeTrimStart from './builtins/String.prototype.trimStart';
import SymbolPrototypeDescription from './builtins/Symbol.prototype.description';

// Syntax
import JSONSuperset, { entryName as JSONSupersetName } from './syntax/JSONSuperset';
import optionalCatchBinding, { entryName as optionalCatchBindingName } from './syntax/optionalCatchBinding';
import WellFormedJsonStringify, { entryName as WellFormedJsonStringifyName } from './syntax/WellFormedJsonStringify';



export const builtins = () => ({
  'Array.prototype.flat': ArrayPrototypeFlat(),
  'Array.prototype.flatMap': ArrayPrototypeFlatMap(),
  'Object.fromEntries': ObjectFromEntries(),
  'String.prototype.trimEnd': StringPrototypeTrimEnd(),
  'String.prototype.trimStart': StringPrototypeTrimStart(),
  'Symbol.prototype.description': SymbolPrototypeDescription()
});

export const syntax = () => ({
  [JSONSupersetName]: JSONSuperset(),
  [optionalCatchBindingName]: optionalCatchBinding(),
  [WellFormedJsonStringifyName]: WellFormedJsonStringify()
});

// All features
export default () => ({
  ...builtins(),
  ...syntax()
});
