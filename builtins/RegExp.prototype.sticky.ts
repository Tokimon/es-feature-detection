import testExpression from '../utils/testExpression';

export const expression = 'return /.*/y.sticky === true';
export default () => testExpression(expression);
