import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof Intl.Locale.prototype.getTextInfo === 'function'";
export default () => testExpression(expression);
