import testExpression from '~/utils/testExpression';

export const expression = '/(?<!a)b(?<=b)c/';
export default () => testExpression(expression);
