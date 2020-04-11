import testExpression from '../utils/testExpression';

export const expression = "return typeof Promise.allSettled !== 'undefined'";
export default () => testExpression(expression);
