import ObjectEntries from './Object.entries';
import ObjectGetOwnPropertyDescriptors from './Object.getOwnPropertyDescriptors';
import ObjectValues from './Object.values';

export default () => ({
  'Object.entries': ObjectEntries(),
  'Object.getOwnPropertyDescriptors': ObjectGetOwnPropertyDescriptors(),
  'Object.values': ObjectValues()
});
