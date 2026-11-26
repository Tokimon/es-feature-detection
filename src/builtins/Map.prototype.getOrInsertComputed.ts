import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof Map.prototype.getOrInsertComputed === 'function'";
export default () => testExpression(expression);
