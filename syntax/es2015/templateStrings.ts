import testExpression from '../../utils/testExpression';

export const entryName = 'Template Strings';
export const expression = 'function f(a, b) {return a[0]+(b+1)+a[1];}var s=`life=${40+2}`,t=f`a:${5}x`';
export default () => testExpression(expression);
