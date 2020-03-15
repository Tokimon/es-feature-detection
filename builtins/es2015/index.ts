// Collections
import _Array from './Array';
import _Math from './Math';
import _Number from './Number';
import _Object from './Object';
import _String from './String';
import _RegExp from './RegExp';
import typedarrays from './typedarrays';
import animationFrame from './animationFrame';
import base64 from './base64';

// Individuals
import _Map from './Map';
import _Weakmap from './WeakMap';
import _Set from './Set';
import _Weakset from './WeakSet';
import _Symbol from './Symbol';
import _Promise from './Promise';
import _Proxy from './Proxy';
import _Reflect from './Reflect';
import newTarget from './new.target';

export default () => ({
  Map: _Map(),
  WeakMap: _Weakmap(),
  Set: _Set(),
  WeakSet: _Weakset(),
  Symbol: _Symbol(),
  Promise: _Promise(),
  Proxy: _Proxy(),
  Reflect: _Reflect(),
  'new.target': newTarget(),

  ..._Array(),
  ..._Math(),
  ..._Number(),
  ..._Object(),
  ..._String(),
  ..._RegExp(),
  ...typedarrays(),
  ...animationFrame(),
  ...base64()
});
