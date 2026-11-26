import testExpression from '@/utils/testExpression';

export const expression = "return typeof Array.fromAsync === 'function'";
export default () => testExpression(expression);
