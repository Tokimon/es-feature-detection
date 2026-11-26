import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof WeakMap.prototype.getOrInsert === 'function'";
export default () => testExpression(expression);
