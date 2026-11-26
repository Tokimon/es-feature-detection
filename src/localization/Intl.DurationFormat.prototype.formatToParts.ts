import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof Intl.DurationFormat.prototype.formatToParts === 'function'";
export default () => testExpression(expression);
