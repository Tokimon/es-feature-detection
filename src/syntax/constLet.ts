import testExpression from '~/utils/testExpression';

export const expression = 'let a;const b=42;a=b';
export default () => testExpression(expression);
