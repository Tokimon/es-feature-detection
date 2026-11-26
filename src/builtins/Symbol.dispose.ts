import testExpression from '@/utils/testExpression';

export const expression = "return typeof Symbol.dispose !== 'undefined'";
export default () => testExpression(expression);
