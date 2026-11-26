import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof DataView.prototype.getFloat16 === 'function'";
export default () => testExpression(expression);
