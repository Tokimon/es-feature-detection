import testExpression from '~/utils/testExpression';

export const expression = 'JSON.stringify("\\udead") === \'"\\\\udead"\'';
export default () => testExpression(expression);
