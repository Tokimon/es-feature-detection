import testExpression from '~/utils/testExpression';

export const expression = "return typeof [].flatMap !== 'undefined'";
export default () => testExpression(expression);
