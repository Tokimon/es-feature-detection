import testExpression from '@/utils/testExpression';

export const expression = "return typeof Iterator.zip === 'function'";
export default () => testExpression(expression);
