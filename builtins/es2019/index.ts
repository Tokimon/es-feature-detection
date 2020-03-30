import SymbolPrototypeDescription from './Symbol.prototype.description';
import ObjectFromEntries from './Object.fromEntries';
import StringPrototypeTrimStart from './String.prototype.trimStart';
import StringPrototypeTrimEnd from './String.prototype.trimEnd';
import ArrayPrototypeFlat from './Array.prototype.flat';
import ArrayPrototypeFlatMap from './Array.prototype.flatMap';

export default () => ({
  'Array.prototype.flat': ArrayPrototypeFlat(),
  'Array.prototype.flatMap': ArrayPrototypeFlatMap(),
  'Object.fromEntries': ObjectFromEntries(),
  'Symbol.prototype.description': SymbolPrototypeDescription(),
  'String.prototype.trimStart': StringPrototypeTrimStart(),
  'String.prototype.trimEnd': StringPrototypeTrimEnd()
});
