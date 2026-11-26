import testExpression from '@/utils/testExpression';

export const expression = "return typeof Map.groupBy === 'function'";
export default () => testExpression(expression);
