import testExpression from '~/utils/testExpression';

export const expression = 'var o={a(){}}';
export default () => testExpression(expression);
