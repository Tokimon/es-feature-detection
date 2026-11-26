import testExpression from '@/utils/testExpression';

export const expression = "new RegExp('(?<a>x)|(?<a>y)')";
export default () => testExpression(expression);
