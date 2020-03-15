import testExpression from '../../utils/testExpression';

export const expression = "return typeof Number.isSafeInteger !== 'undefined'";
export default () => testExpression(expression);
