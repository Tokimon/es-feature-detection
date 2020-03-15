import testExpression from '../../utils/testExpression';

export const expression = "return typeof Uint8ClampedArray !== 'undefined'";
export default () => testExpression(expression);
