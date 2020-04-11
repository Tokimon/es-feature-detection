// Built-ins
import PromisePrototypeFinally from './builtins/Promise.prototype.finally';
import RegExpPrototypeDotAll from './builtins/RegExp.prototype.dotAll';
import RegExpPrototypeUnicode from './builtins/RegExp.prototype.unicode';
import SymbolAsyncIterator from './builtins/Symbol.asyncIterator';

// Syntax
import objectSpreadProperties, { entryName as objectSpreadPropertiesName } from './syntax/objectSpreadProperties';
import regExpLookbehindAssertions, { entryName as regExpLookbehindAssertionsName } from './syntax/regExpLookbehindAssertions';
import regExpNamedCaptureGroups, { entryName as regExpNamedCaptureGroupsName } from './syntax/regExpNamedCaptureGroups';
import TemplateLiteralRevision, { entryName as TemplateLiteralRevisionName } from './syntax/TemplateLiteralRevision';



export const builtins = () => ({
  'Promise.prototype.finally': PromisePrototypeFinally(),
  'RegExp.prototype.dotAll': RegExpPrototypeDotAll(),
  'RegExp.prototype.unicode': RegExpPrototypeUnicode(),
  'Symbol.asyncIterator': SymbolAsyncIterator()
});

export const syntax = () => ({
  [objectSpreadPropertiesName]: objectSpreadProperties(),
  [regExpLookbehindAssertionsName]: regExpLookbehindAssertions(),
  [regExpNamedCaptureGroupsName]: regExpNamedCaptureGroups(),
  [TemplateLiteralRevisionName]: TemplateLiteralRevision()
});

// All features
export default () => ({
  ...builtins(),
  ...syntax()
});
