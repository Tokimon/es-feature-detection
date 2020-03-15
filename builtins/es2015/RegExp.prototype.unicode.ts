import testExpression from '../../utils/testExpression';

export const expression = 'return /\\u{61}/u.unicode === true';
export default () => testExpression(expression);
