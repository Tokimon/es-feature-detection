import testExpression from '~/utils/testExpression';

export const expression = 'function t(a,b) {};t(...[1,2]);t.call(this,...[1,2])';
export default () => testExpression(expression);
