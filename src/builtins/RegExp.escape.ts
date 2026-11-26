import testExpression from '@/utils/testExpression';

export const expression = "return typeof RegExp.escape === 'function'";
export default () => testExpression(expression);
