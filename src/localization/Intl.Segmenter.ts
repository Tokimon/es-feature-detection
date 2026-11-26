import testExpression from '@/utils/testExpression';

export const expression = "return typeof Intl.Segmenter === 'function'";
export default () => testExpression(expression);
