import testExpression from '@/utils/testExpression';

export const expression = "return typeof Uint8Array.fromHex === 'function'";
export default () => testExpression(expression);
