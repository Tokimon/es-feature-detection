import testExpression from '~/utils/testExpression';

export const expression = 'try { throw "" } catch { return true; }';
export default () => testExpression(expression);
