import testExpression from '@/utils/testExpression';

export const expression = "new RegExp('(?i:a)b')";
export default () => testExpression(expression);
