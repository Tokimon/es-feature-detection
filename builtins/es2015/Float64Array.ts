import testExpression from '../../utils/testExpression';

export const expression = "return typeof Float64Array !== 'undefined'";
export default () => testExpression(expression);
