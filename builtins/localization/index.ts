import _Intl from './Intl';
import IntlCollator from './Intl.Collator';
import IntlDateTimeFormat from './Intl.DateTimeFormat';
import IntlNumberFormat from './Intl.NumberFormat';
import IntlPluralRules from './Intl.PluralRules';

export default () => ({
  'Intl': _Intl(),
  'Intl.Collator': IntlCollator(),
  'Intl.DateTimeFormat': IntlDateTimeFormat(),
  'Intl.NumberFormat': IntlNumberFormat(),
  'Intl.PluralRules': IntlPluralRules()
});
