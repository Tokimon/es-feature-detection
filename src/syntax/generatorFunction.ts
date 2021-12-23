import testExpression from '~/utils/testExpression';

export const expression = 'function* g(){}';
export default () => testExpression(expression);
