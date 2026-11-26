import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof Intl.Locale.prototype.getCollations === 'function'";
export default () => testExpression(expression);
