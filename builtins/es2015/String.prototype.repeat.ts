import testExpression from '../../utils/testExpression';

export const expression = "return typeof ''.repeat !== 'undefined'";
export default () => testExpression(expression);
