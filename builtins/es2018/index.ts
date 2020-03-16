import RegExpPrototypeDotAll from './RegExp.prototype.dotAll';
import SymbolAsyncIterator from './Symbol.asyncIterator';

export default () => ({
  'RegExp.prototype.dotAll': RegExpPrototypeDotAll(),
  'Symbol.asyncIterator': SymbolAsyncIterator()
});
