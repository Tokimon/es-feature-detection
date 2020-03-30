import testExpression from '../../utils/testExpression';

export const expression = 'typeof Object.fromEntries !== "undefined"';
export default () => testExpression(expression);
