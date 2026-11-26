import testExpression from '@/utils/testExpression';

export const expression = "return typeof Error.isError === 'function'";
export default () => testExpression(expression);
