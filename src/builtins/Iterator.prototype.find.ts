import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof Iterator.prototype.find === 'function'";
export default () => testExpression(expression);
