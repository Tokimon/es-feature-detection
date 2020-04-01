import testExpression from '../utils/testExpression';

export const expression = "return typeof Math.trunc !== 'undefined'";
export default () => testExpression(expression);
