import testExpression from '@/utils/testExpression';

export const expression = "return typeof Uint8Array.fromBase64 === 'function'";
export default () => testExpression(expression);
