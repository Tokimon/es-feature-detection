import _requestAnimationFrame from './requestAnimationFrame';
import _cancelAnimationFrame from './cancelAnimationFrame';

export default () => ({
  requestAnimationFrame: _requestAnimationFrame(),
  cancelAnimationFrame: _cancelAnimationFrame()
});
