import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof Iterator.prototype.join === 'function'";
export default () => testExpression(expression);
