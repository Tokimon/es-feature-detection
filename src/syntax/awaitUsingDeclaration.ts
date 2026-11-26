import testExpression from '@/utils/testExpression';

export const expression = 'async function f() { await using a = null; }';
export default () => testExpression(expression);
