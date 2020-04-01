import testExpression from '../utils/testExpression';

export const expression = "return typeof DataView !== 'undefined'";
export default () => testExpression(expression);
