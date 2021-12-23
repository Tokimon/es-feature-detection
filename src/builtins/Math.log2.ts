import testExpression from '~/utils/testExpression';

export const expression = "return typeof Math.log2 !== 'undefined'";
export default () => testExpression(expression);
