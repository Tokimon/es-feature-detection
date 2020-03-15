import StringFromCodePoint from './String.fromCodePoint';
import StringPrototypeCodePointAt from './String.prototype.codePointAt';
import StringPrototypeStartsWith from './String.prototype.startsWith';
import StringPrototypeEndsWith from './String.prototype.endsWith';
import StringPrototypeIncludes from './String.prototype.includes';
import StringPrototypeRepeat from './String.prototype.repeat';
import StringPrototypeNormalize from './String.prototype.normalize';
import StringRaw from './String.raw';

export default () => ({
  'String.fromCodePoint': StringFromCodePoint(),
  'String.prototype.codePointAt': StringPrototypeCodePointAt(),
  'String.prototype.startsWith': StringPrototypeStartsWith(),
  'String.prototype.endsWith': StringPrototypeEndsWith(),
  'String.prototype.includes': StringPrototypeIncludes(),
  'String.prototype.repeat': StringPrototypeRepeat(),
  'String.prototype.normalize': StringPrototypeNormalize(),
  'String.raw': StringRaw()
});
