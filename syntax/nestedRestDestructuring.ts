import testExpression from '../utils/testExpression';

export const entryName = 'Nested rest destructuring';
export const expression = 'var {a:{b,c}}={a:{b:1,c:2}}';
export default () => testExpression(expression);
