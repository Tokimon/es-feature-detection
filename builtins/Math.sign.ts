import testExpression from '../utils/testExpression';

export const expression = "return typeof Math.sign !== 'undefined'";
export default () => testExpression(expression);
