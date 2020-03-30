import testExpression from '../../utils/testExpression';

export const entryName = 'JSON superset';
export const expression = 'eval(\'"\u2028"\');';
export default () => testExpression(expression);
