import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof Map.prototype.getOrInsert === 'function'";
export default () => testExpression(expression);
