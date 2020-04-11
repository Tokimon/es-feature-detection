import testExpression from '../utils/testExpression';

export const expression = "return typeof [].find !== 'undefined'";
export default () => testExpression(expression);
