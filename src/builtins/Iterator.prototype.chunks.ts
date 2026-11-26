import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof Iterator.prototype.chunks === 'function'";
export default () => testExpression(expression);
