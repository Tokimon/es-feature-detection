import testExpression from '../../utils/testExpression';

export const entryName = 'Optional Chaining';
export const expression = 'var a={};a?.b?.c()';
export default () => testExpression(expression);
