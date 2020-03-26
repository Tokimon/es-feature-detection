import testExpression from '../../utils/testExpression';

export const entryName = 'Arrow function';
export const expression = 'var f=()=>{}';
export default () => testExpression(expression);
