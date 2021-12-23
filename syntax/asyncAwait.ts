import testExpression from '~/utils/testExpression';

export const expression = 'async function f(){var a = await Promise.resolve(42);return a};f()';
export default () => testExpression(expression);
