import testExpression from '../utils/testExpression';

export const expression = "return typeof Reflect !== 'undefined'";
export default () => testExpression(expression);
