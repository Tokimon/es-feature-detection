import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof Set.prototype.difference === 'function'";
export default () => testExpression(expression);
