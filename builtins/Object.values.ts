import testExpression from '~/utils/testExpression';

export const expression = "return typeof Object.values !== 'undefined'";
export default () => testExpression(expression);
