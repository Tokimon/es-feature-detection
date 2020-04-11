import testExpression from '../utils/testExpression';

export const expression = "return typeof Array.of !== 'undefined'";
export default () => testExpression(expression);
