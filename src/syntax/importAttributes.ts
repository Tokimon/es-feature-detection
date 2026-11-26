import testExpression from '@/utils/testExpression';

export const expression = "if (0) import('x', { with: { type: 'json' } })";
export default () => testExpression(expression);
