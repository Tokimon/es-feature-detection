import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof Uint8Array.prototype.toHex === 'function'";
export default () => testExpression(expression);
