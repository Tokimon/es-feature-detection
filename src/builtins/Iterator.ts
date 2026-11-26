import testExpression from '@/utils/testExpression';

export const expression = "return typeof Iterator === 'function'";
export default () => testExpression(expression);
