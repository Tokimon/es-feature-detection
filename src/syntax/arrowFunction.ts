import testExpression from '~/utils/testExpression';

export const expression = 'var f=()=>{}';
export default () => testExpression(expression);
