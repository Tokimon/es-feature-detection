import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof Intl.Locale.prototype.getHourCycles === 'function'";
export default () => testExpression(expression);
