import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof Iterator.prototype.take === 'function'";
export default () => testExpression(expression);
