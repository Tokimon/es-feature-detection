import testExpression from '~/utils/testExpression';

export const expression = "return typeof ''.trimEnd !== 'undefined'";
export default () => testExpression(expression);
