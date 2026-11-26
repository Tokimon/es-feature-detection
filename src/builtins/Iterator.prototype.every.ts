import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof Iterator.prototype.every === 'function'";
export default () => testExpression(expression);
