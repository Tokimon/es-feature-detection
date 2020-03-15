import testExpression from '../../utils/testExpression';

export const expression = "return typeof Math.expm1 !== 'undefined'";
export default () => testExpression(expression);
