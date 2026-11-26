import testExpression from '@/utils/testExpression';

export const expression = "return typeof Atomics.waitAsync === 'function'";
export default () => testExpression(expression);
