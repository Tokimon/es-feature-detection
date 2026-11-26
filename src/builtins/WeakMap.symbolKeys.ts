import testExpression from '@/utils/testExpression';

export const expression = "new WeakMap().set(Symbol('a'), 1)";
export default () => testExpression(expression);
