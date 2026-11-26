import testExpression from '@/utils/testExpression';

export const expression = "return typeof Object.groupBy === 'function'";
export default () => testExpression(expression);
