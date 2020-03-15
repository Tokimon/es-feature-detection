import testExpression from '../../utils/testExpression';

export const expression = "return typeof Number.MIN_SAFE_INTEGER !== 'undefined'";
export default () => testExpression(expression);
