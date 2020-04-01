import testExpression from '../utils/testExpression';

export const expression = "return typeof WeakMap !== 'undefined'";
export default () => testExpression(expression);
