import testExpression from '../utils/testExpression';

export const entryName = 'import()';
export const expression = 'import("file.js").catch(() => {})';
export default () => testExpression(expression);
