import testExpression from '~/utils/testExpression';

export const expression = "return typeof (new Int8Array()).includes !== 'undefined'";
export default () => testExpression(expression);
