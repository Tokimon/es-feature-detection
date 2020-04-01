import DynamicImport, { entryName as DynamicImportName } from './DynamicImport';
import NullishCoalescing, { entryName as NullishCoalescingName } from './NullishCoalescing';
import OptionalChaining, { entryName as OptionalChainingName } from './OptionalChaining';

export default () => ({
  [DynamicImportName]: DynamicImport(),
  [NullishCoalescingName]: NullishCoalescing(),
  [OptionalChainingName]: OptionalChaining()
});
