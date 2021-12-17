// Built-ins
import PromisePrototypeFinally from './builtins/Promise.prototype.finally';
import RegExpPrototypeDotAll from './builtins/RegExp.prototype.dotAll';
import RegExpPrototypeUnicode from './builtins/RegExp.prototype.unicode';
import SymbolAsyncIterator from './builtins/Symbol.asyncIterator';

// Syntax
import objectSpreadProperties from './syntax/objectSpreadProperties';
import regExpLookbehindAssertions from './syntax/regExpLookbehindAssertions';
import regExpNamedCaptureGroups from './syntax/regExpNamedCaptureGroups';
import TemplateLiteralRevision from './syntax/TemplateLiteralRevision';



export const builtins = () => ({
  'Promise.prototype.finally': PromisePrototypeFinally(),
  'RegExp.prototype.dotAll': RegExpPrototypeDotAll(),
  'RegExp.prototype.unicode': RegExpPrototypeUnicode(),
  'Symbol.asyncIterator': SymbolAsyncIterator()
});

export const syntax = () => ({
  objectSpreadProperties: objectSpreadProperties(),
  regExpLookbehindAssertions: regExpLookbehindAssertions(),
  regExpNamedCaptureGroups: regExpNamedCaptureGroups(),
  TemplateLiteralRevision: TemplateLiteralRevision()
});

// All features
export default () => ({
  ...builtins(),
  ...syntax()
});
