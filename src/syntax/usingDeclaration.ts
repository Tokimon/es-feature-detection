import testExpression from '@/utils/testExpression';

export const expression = '{ using a = null; }';
export default () => testExpression(expression);
