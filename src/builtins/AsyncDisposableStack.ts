import testExpression from '@/utils/testExpression';

export const expression = "return typeof AsyncDisposableStack === 'function'";
export default () => testExpression(expression);
