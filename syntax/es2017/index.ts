import asyncAwait, { entryName as asyncAwaitName } from './asyncAwait';
import trailingParameterCommas, { entryName as trailingParameterCommasName } from './trailingParameterCommas';

export default () => ({
  [asyncAwaitName]: asyncAwait(),
  [trailingParameterCommasName]: trailingParameterCommas()
});
