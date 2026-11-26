import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof Set.prototype.isSubsetOf === 'function'";
export default () => testExpression(expression);
