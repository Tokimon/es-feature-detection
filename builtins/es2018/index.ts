import PromisePrototypeFinally from './Promise.prototype.finally';
import RegExpPrototypeDotAll from './RegExp.prototype.dotAll';
import RegExpPrototypeUnicode from './RegExp.prototype.unicode';
import SymbolAsyncIterator from './Symbol.asyncIterator';

export default () => ({
  'Promise.prototype.finally': PromisePrototypeFinally(),
  'RegExp.prototype.dotAll': RegExpPrototypeDotAll(),
  'RegExp.prototype.unicode': RegExpPrototypeUnicode(),
  'Symbol.asyncIterator': SymbolAsyncIterator()
});
