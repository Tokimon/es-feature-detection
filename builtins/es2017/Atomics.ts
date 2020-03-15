import testExpression from '../../utils/testExpression';

export const expression = "return typeof Atomics !== 'undefined'";
export default () => testExpression(expression);
