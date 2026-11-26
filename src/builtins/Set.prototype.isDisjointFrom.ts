import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof Set.prototype.isDisjointFrom === 'function'";
export default () => testExpression(expression);
