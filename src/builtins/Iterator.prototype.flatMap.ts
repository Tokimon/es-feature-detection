import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof Iterator.prototype.flatMap === 'function'";
export default () => testExpression(expression);
