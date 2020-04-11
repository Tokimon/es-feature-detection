import testExpression from '../utils/testExpression';

export const expression = "return typeof Promise !== 'undefined'";
export default () => testExpression(expression);
