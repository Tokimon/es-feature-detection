import testExpression from '../utils/testExpression';

export const entryName = 'Trailing parameter commas';
export const expression = 'function f(a,b,){};f()';
export default () => testExpression(expression);
