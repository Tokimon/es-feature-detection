import testExpression from '../../utils/testExpression';

export const expression = "return typeof [].copyWithin !== 'undefined'";
export default () => testExpression(expression);
