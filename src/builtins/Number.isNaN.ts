import testExpression from '~/utils/testExpression';

export const expression = "return typeof Number.isNaN !== 'undefined'";
export default () => testExpression(expression);
