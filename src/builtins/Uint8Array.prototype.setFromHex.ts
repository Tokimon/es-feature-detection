import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof Uint8Array.prototype.setFromHex === 'function'";
export default () => testExpression(expression);
