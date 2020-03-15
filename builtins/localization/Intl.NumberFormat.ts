import testExpression from '../../utils/testExpression';

export const expression = "return typeof Intl.NumberFormat !== 'undefined'";
export default () => testExpression(expression);
