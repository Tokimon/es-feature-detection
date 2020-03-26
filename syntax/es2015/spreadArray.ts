import testExpression from '../../utils/testExpression';

export const entryName = 'Spread Array';
export const expression = 'var a=[...[1,2]];var [...b]=a;';
export default () => testExpression(expression);
