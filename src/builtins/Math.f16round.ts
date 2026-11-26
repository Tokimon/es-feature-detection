import testExpression from '@/utils/testExpression';

export const expression = "return typeof Math.f16round === 'function'";
export default () => testExpression(expression);
