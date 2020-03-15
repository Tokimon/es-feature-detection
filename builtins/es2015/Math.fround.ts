import testExpression from '../../utils/testExpression';

export const expression = "return typeof Math.fround !== 'undefined'";
export default () => testExpression(expression);
