import testExpression from '~/utils/testExpression';

export const expression = "return typeof ''.padStart !== 'undefined'";
export default () => testExpression(expression);
