import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof Intl.DurationFormat.prototype.resolvedOptions === 'function'";
export default () => testExpression(expression);
