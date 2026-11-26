import testExpression from '@/utils/testExpression';

export const expression = "return typeof Symbol.asyncDispose !== 'undefined'";
export default () => testExpression(expression);
