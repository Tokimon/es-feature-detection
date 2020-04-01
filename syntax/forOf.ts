import testExpression from '../utils/testExpression';

export const entryName = 'for...of';
export const expression = 'for(var i of [1,2,3]) {}';
export default () => testExpression(expression);
