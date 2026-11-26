import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof Iterator.prototype.windows === 'function'";
export default () => testExpression(expression);
