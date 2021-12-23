import testExpression from '~/utils/testExpression';

export const expression = "return typeof ({}).__proto__ !== 'undefined'";
export default () => testExpression(expression);
