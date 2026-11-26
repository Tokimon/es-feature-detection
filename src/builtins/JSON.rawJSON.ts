import testExpression from '@/utils/testExpression';

export const expression = "return typeof JSON.rawJSON === 'function'";
export default () => testExpression(expression);
