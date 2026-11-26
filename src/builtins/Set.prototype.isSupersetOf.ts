import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof Set.prototype.isSupersetOf === 'function'";
export default () => testExpression(expression);
