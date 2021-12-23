import testExpression from '~/utils/testExpression';

export const expression = 'import("file.js").catch(() => {})';
export default () => testExpression(expression);
