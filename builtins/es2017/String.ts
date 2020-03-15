import StringPrototypePadEnd from './String.prototype.padEnd';
import StringPrototypePadStart from './String.prototype.padStart';

export default () => ({
  'String.prototype.padEnd': StringPrototypePadEnd(),
  'String.prototype.padStart': StringPrototypePadStart()
});
