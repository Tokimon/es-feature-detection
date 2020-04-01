import testExpression from '../utils/testExpression';

export const expression = "return typeof String.fromCodePoint !== 'undefined'";
export default () => testExpression(expression);
