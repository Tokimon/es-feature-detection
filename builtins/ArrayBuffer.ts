import testExpression from '~/utils/testExpression';

export const expression = "return typeof ArrayBuffer !== 'undefined'";
export default () => testExpression(expression);
