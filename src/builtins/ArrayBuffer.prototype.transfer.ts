import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof ArrayBuffer.prototype.transfer === 'function'";
export default () => testExpression(expression);
