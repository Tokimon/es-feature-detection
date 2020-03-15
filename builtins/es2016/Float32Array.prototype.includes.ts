import testExpression from '../../utils/testExpression';

export const expression = "return typeof (new Float32Array()).includes !== 'undefined'";
export default () => testExpression(expression);
