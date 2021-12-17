import testExpression from '~/utils/testExpression';

export const expression = 'var {a:A,b:B=3}={a:1};var [a,b]=[1,2]';
export default () => testExpression(expression);
