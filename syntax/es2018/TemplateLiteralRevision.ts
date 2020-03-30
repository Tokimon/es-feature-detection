import testExpression from '../../utils/testExpression';

export const entryName = 'Template Literal Revision';
export const expression = '(t=>t)`\\uu ${1} \\xx`';
export default () => testExpression(expression);
