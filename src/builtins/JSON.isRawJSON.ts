import testExpression from '@/utils/testExpression';

export const expression = "return typeof JSON.isRawJSON === 'function'";
export default () => testExpression(expression);
