import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof WeakMap.prototype.getOrInsertComputed === 'function'";
export default () => testExpression(expression);
