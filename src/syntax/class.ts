import testExpression from '~/utils/testExpression';

export const expression = 'class A {};class B extends A {}';
export default () => testExpression(expression);
