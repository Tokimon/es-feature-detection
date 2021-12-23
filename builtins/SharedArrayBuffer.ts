import testExpression from '~/utils/testExpression';

export const expression = "return typeof SharedArrayBuffer !== 'undefined'";
export default () => testExpression(expression);
