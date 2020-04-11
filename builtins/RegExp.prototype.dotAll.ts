import testExpression from '../utils/testExpression';

export const expression = 'return /.*/s.dotAll === true';
export default () => testExpression(expression);
