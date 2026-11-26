import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof ArrayBuffer.prototype.transferToFixedLength === 'function'";
export default () => testExpression(expression);
