import ArrayFrom from './Array.from';
import ArrayOf from './Array.of';
import ArrayPrototypeFill from './Array.prototype.fill';
import ArrayPrototypeFind from './Array.prototype.find';
import ArrayPrototypeFindIndex from './Array.prototype.findIndex';
import ArrayPrototypeEntries from './Array.prototype.entries';
import ArrayPrototypeKeys from './Array.prototype.keys';
import ArrayPrototypeCopyWithin from './Array.prototype.copyWithin';

export default () => ({
  'Array.from': ArrayFrom(),
  'Array.of': ArrayOf(),
  'Array.prototype.copyWithin': ArrayPrototypeCopyWithin(),
  'Array.prototype.entries': ArrayPrototypeEntries(),
  'Array.prototype.fill': ArrayPrototypeFill(),
  'Array.prototype.find': ArrayPrototypeFind(),
  'Array.prototype.findIndex': ArrayPrototypeFindIndex(),
  'Array.prototype.keys': ArrayPrototypeKeys()
});
