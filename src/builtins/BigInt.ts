import testExpression from '~/utils/testExpression';

export const expression = "return typeof BigInt !== 'undefined'";
export default () => testExpression(expression);
