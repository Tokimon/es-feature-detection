import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof Intl.Locale.prototype.getWeekInfo === 'function'";
export default () => testExpression(expression);
