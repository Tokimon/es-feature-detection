import testExpression from '~/utils/testExpression';

export const expression = 'var a = {a:1}, b = {b:2}, c = { ...a, ...b }; var { ...d } = c';
export default () => testExpression(expression);
