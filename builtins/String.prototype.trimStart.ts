import testExpression from '../utils/testExpression';

export const expression = "return typeof ''.trimStart !== 'undefined'";
export default () => testExpression(expression);
