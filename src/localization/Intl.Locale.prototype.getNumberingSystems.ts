import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof Intl.Locale.prototype.getNumberingSystems === 'function'";
export default () => testExpression(expression);
