import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof Intl.DurationFormat.prototype.format === 'function'";
export default () => testExpression(expression);
