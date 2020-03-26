import testExpression from '../../utils/testExpression';

export const entryName = 'RegExp Lookbehind Assertions';
export const expression = '/(?<!a)b(?<=b)c/';
export default () => testExpression(expression);
