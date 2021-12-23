import testExpression from '~/utils/testExpression';

export const expression = "return typeof Object.assign !== 'undefined'";
export default () => testExpression(expression);
