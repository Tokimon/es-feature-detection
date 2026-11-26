import testExpression from '@/utils/testExpression';

export const expression = "return typeof Math.sumPrecise === 'function'";
export default () => testExpression(expression);
