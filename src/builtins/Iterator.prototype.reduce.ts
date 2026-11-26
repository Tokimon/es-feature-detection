import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof Iterator.prototype.reduce === 'function'";
export default () => testExpression(expression);
