import testExpression from '../utils/testExpression';

export const expression = "return typeof Number.EPSILON !== 'undefined'";
export default () => testExpression(expression);
