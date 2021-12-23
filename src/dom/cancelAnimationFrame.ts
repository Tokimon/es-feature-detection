import testExpression from '~/utils/testExpression';

export const expression = "return typeof cancelAnimationFrame !== 'undefined'";
export default () => testExpression(expression);
