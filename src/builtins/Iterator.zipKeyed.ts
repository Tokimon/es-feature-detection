import testExpression from '@/utils/testExpression';

export const expression = "return typeof Iterator.zipKeyed === 'function'";
export default () => testExpression(expression);
