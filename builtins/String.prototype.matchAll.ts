import testExpression from '../utils/testExpression';

export const expression = "return typeof ''.matchAll !== 'undefined'";
export default () => testExpression(expression);
