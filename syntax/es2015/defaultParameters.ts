import testExpression from '../../utils/testExpression';

export const entryName = 'Default parameters';
export const expression = 'function t(a=1) {};t()';
export default () => testExpression(expression);
