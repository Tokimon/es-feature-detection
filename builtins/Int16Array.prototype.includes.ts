import testExpression from '../utils/testExpression';

export const expression = "return typeof (new Int16Array()).includes !== 'undefined'";
export default () => testExpression(expression);
