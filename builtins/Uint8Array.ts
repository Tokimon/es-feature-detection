import testExpression from '../utils/testExpression';

export const expression = "return typeof Uint8Array !== 'undefined'";
export default () => testExpression(expression);
