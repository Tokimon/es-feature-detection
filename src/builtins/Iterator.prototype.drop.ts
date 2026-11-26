import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof Iterator.prototype.drop === 'function'";
export default () => testExpression(expression);
