import testExpression from '@/utils/testExpression';

export const expression = "return typeof Float16Array !== 'undefined'";
export default () => testExpression(expression);
