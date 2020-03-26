import testExpression from '../../utils/testExpression';

export const entryName = 'Shorthand property';
export const expression = 'var a=2,o={a}';
export default () => testExpression(expression);
