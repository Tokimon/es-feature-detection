import testExpression from '@/utils/testExpression';

export const expression = "return typeof Set.prototype.union === 'function'";
export default () => testExpression(expression);
