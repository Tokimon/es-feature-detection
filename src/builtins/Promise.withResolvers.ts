import testExpression from '@/utils/testExpression';

export const expression = "return typeof Promise.withResolvers === 'function'";
export default () => testExpression(expression);
