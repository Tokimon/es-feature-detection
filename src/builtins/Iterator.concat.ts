import testExpression from '@/utils/testExpression';

export const expression = "return typeof Iterator.concat === 'function'";
export default () => testExpression(expression);
