import testExpression from '~/utils/testExpression';

export const expression = "return typeof Object.is !== 'undefined'";
export default () => testExpression(expression);
