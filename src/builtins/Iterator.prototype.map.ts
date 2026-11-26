import testExpression from '@/utils/testExpression';

export const expression = "return typeof Iterator.prototype.map === 'function'";
export default () => testExpression(expression);
