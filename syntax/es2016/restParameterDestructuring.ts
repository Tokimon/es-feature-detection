import testExpression from '../../utils/testExpression';

export const entryName = 'Rest parameter destructuring';
export const expression = 'function f(a,{b:{c}},...[d,...e]){};f(1,{b: {c: 2}}, 3,4,5,6)';
export default () => testExpression(expression);
