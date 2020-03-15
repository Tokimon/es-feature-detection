import ObjectPrototypeProto from './Object.prototype.__proto__';
import ObjectIs from './Object.is';
import ObjectSetPrototypeOf from './Object.setPrototypeOf';
import ObjectAssign from './Object.assign';
import ObjectGetOwnPropertySymbols from './Object.getOwnPropertySymbols';

export default () => ({
  'Object.prototype.__proto__': ObjectPrototypeProto(),
  'Object.is': ObjectIs(),
  'Object.setPrototypeOf': ObjectSetPrototypeOf(),
  'Object.assign': ObjectAssign(),
  'Object.getOwnPropertySymbols': ObjectGetOwnPropertySymbols()
});
