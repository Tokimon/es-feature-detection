import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof Intl.Locale.prototype.getCalendars === 'function'";
export default () => testExpression(expression);
