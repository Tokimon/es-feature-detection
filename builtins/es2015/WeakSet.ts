import testExpression from '../../utils/testExpression';

export const expression = "return typeof WeakSet !== 'undefined'";
export default () => testExpression(expression);
