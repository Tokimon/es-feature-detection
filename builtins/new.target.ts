import testExpression from '../utils/testExpression';

export const expression = '(function() { return new.target })()';
export default () => testExpression(expression);
