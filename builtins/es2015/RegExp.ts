import RegExpPrototypeSticky from './RegExp.prototype.sticky';
import RegExpPrototypeUnicode from './RegExp.prototype.unicode';

export default () => ({
  'RegExp.prototype.sticky': RegExpPrototypeSticky(),
  'RegExp.prototype.unicode': RegExpPrototypeUnicode()
});
