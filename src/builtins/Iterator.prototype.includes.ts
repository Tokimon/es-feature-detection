import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof Iterator.prototype.includes === 'function'";
export default () => testExpression(expression);
