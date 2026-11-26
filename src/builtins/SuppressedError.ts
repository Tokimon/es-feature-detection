import testExpression from '@/utils/testExpression';

export const expression = "return typeof SuppressedError === 'function'";
export default () => testExpression(expression);
