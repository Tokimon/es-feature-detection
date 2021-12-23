import testExpression from '~/utils/testExpression';

export const expression = "return typeof [].fill !== 'undefined'";
export default () => testExpression(expression);
