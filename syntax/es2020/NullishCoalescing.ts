import testExpression from '../../utils/testExpression';

export const entryName = 'Nullish Coalescing';
export const expression = 'let a;a??"ok"';
export default () => testExpression(expression);
