import testExpression from '@/utils/testExpression';

export const expression = "return typeof Iterator.from === 'function'";
export default () => testExpression(expression);
