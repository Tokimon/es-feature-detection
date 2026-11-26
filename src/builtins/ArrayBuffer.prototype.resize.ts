import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof ArrayBuffer.prototype.resize === 'function'";
export default () => testExpression(expression);
