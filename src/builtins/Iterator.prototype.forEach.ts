import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof Iterator.prototype.forEach === 'function'";
export default () => testExpression(expression);
