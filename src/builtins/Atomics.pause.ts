import testExpression from '@/utils/testExpression';

export const expression = "return typeof Atomics.pause === 'function'";
export default () => testExpression(expression);
