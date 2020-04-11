import testExpression from '../utils/testExpression';

export const expression = "return typeof Number.MAX_SAFE_INTEGER !== 'undefined'";
export default () => testExpression(expression);
