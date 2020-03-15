import testExpression from '../../utils/testExpression';

export const expression = "return typeof String.raw !== 'undefined'";
export default () => testExpression(expression);
