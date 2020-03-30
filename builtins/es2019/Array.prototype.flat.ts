import testExpression from '../../utils/testExpression';

export const expression = "return typeof [].flat !== 'undefined'";
export default () => testExpression(expression);
