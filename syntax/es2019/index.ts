import JSONSuperset, { entryName as JSONSupersetName } from './JSONSuperset';
import optionalCatchBinding, { entryName as optionalCatchBindingName } from './optionalCatchBinding';
import WellFormedJsonStringify, { entryName as WellFormedJsonStringifyName } from './WellFormedJsonStringify';

export default () => ({
  [JSONSupersetName]: JSONSuperset(),
  [optionalCatchBindingName]: optionalCatchBinding(),
  [WellFormedJsonStringifyName]: WellFormedJsonStringify()
});
