import testExpression from '@/utils/testExpression';

export const expression = "return typeof Promise.try === 'function'";
export default () => testExpression(expression);
