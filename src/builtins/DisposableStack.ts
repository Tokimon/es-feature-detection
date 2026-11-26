import testExpression from '@/utils/testExpression';

export const expression = "return typeof DisposableStack === 'function'";
export default () => testExpression(expression);
