import testExpression from '../../utils/testExpression';

export const expression = "return typeof Number.isInteger !== 'undefined'";
export default () => testExpression(expression);
