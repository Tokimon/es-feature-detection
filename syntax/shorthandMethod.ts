import testExpression from '../utils/testExpression';

export const entryName = 'Shorthand method';
export const expression = 'var o={a(){}}';
export default () => testExpression(expression);
