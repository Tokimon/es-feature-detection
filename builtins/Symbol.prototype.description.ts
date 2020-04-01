import testExpression from '../utils/testExpression';

export const expression = 'typeof Symbol("desc").description !== "undefined"';
export default () => testExpression(expression);
