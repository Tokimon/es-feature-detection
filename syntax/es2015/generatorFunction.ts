import testExpression from '../../utils/testExpression';

export const entryName = 'Generator function';
export const expression = 'function* g(){}';
export default () => testExpression(expression);
