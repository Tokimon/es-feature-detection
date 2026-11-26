import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof Set.prototype.intersection === 'function'";
export default () => testExpression(expression);
