import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof Set.prototype.symmetricDifference === 'function'";
export default () => testExpression(expression);
