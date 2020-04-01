import testExpression from '../utils/testExpression';

export const entryName = 'RegExp Named Capture Groups';
export const expression = 'var r = /(?<a>a)\\k<a>/.exec("aa"); return r && r.groups.a === "a"';
export default () => testExpression(expression);
