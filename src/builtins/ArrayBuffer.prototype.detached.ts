import testExpression from '@/utils/testExpression';

export const expression =
  "return typeof new ArrayBuffer(1).detached === 'boolean'";
export default () => testExpression(expression);
