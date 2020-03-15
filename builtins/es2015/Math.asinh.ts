
import testExpression from '../../utils/testExpression';

export const expression = "return typeof Math.asinh !== 'undefined'";
export default () => testExpression(expression);
