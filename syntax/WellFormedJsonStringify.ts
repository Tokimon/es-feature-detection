import testExpression from '../utils/testExpression';

export const entryName = 'Well-formed JSON.stringify';
export const expression = 'JSON.stringify("\\udead") === \'"\\\\udead"\'';
export default () => testExpression(expression);
