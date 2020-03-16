import es2015 from './es2015';
import es2016 from './es2016';
import es2017 from './es2017';
import es2018 from './es2018';
import localization from './localization';
import _CustomEvent from './incomplete/CustomEvent';

export default () => ({
  CustomEvent: _CustomEvent(),
  ...es2015(),
  ...es2016(),
  ...es2017(),
  ...es2018(),
  ...localization()
});
