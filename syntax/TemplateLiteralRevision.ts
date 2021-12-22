import testExpression from '~/utils/testExpression';

// eslint-disable-next-line no-template-curly-in-string
export const expression = '(t=>t)`\\uu ${1} \\xx`';
export default () => testExpression(expression);
