import MathImul from './Math.imul';
import MathClz32 from './Math.clz32';
import MathFround from './Math.fround';
import MathLog10 from './Math.log10';
import MathLog2 from './Math.log2';
import MathLog1p from './Math.log1p';
import MathExpm1 from './Math.expm1';
import MathCosh from './Math.cosh';
import MathSinh from './Math.sinh';
import MathTanh from './Math.tanh';
import MathAcosh from './Math.acosh';
import MathAsinh from './Math.asinh';
import MathHypot from './Math.hypot';
import MathTrunc from './Math.trunc';
import MathSign from './Math.sign';
import MathCbrt from './Math.cbrt';

export default () => ({
  'Math.imul': MathImul(),
  'Math.clz32': MathClz32(),
  'Math.fround': MathFround(),
  'Math.log10': MathLog10(),
  'Math.log2': MathLog2(),
  'Math.log1p': MathLog1p(),
  'Math.expm1': MathExpm1(),
  'Math.cosh': MathCosh(),
  'Math.sinh': MathSinh(),
  'Math.tanh': MathTanh(),
  'Math.acosh': MathAcosh(),
  'Math.asinh': MathAsinh(),
  'Math.hypot': MathHypot(),
  'Math.trunc': MathTrunc(),
  'Math.sign': MathSign(),
  'Math.cbrt': MathCbrt()
});
