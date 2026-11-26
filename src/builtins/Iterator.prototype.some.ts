import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof Iterator.prototype.some === 'function'";
export default () => testExpression(expression);
