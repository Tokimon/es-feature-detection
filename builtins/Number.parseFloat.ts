import testExpression from '~/utils/testExpression';

export const expression = "return typeof Number.parseFloat !== 'undefined'";
export default () => testExpression(expression);
