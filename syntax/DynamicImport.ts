import testExpression from '../utils/testExpression';

export const entryName = 'import()';
export const expression = 'import("file.js")';
export default () => testExpression(expression);
