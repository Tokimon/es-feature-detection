import testExpression from '@/utils/testExpression';

export const expression = "return typeof Temporal !== 'undefined'";
export default () => testExpression(expression);
