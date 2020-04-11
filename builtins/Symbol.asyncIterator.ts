import testExpression from '../utils/testExpression';

export const expression = "return typeof Symbol.asyncIterator !== 'undefined'";
export default () => testExpression(expression);
