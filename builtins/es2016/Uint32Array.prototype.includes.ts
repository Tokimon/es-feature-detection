import testExpression from '../../utils/testExpression';

export const expression = "return typeof (new Uint32Array()).includes !== 'undefined'";
export default () => testExpression(expression);
