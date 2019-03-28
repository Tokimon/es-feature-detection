import assign from '../lib/assign';

import es2015 from './es2015';
import es2016 from './es2016';
import es2017 from './es2017';
import localization from './localization';

export default () => {
  const es2015Test = es2015();
  const es2016Test = es2016();
  const es2017Test = es2017();
  const localizationTest = localization();

  const result = assign(
    {
      es2015: es2015Test,
      es2016: es2016Test,
      es2017: es2017Test,
      localization: localizationTest
    },
    es2015Test,
    es2016Test,
    es2017Test,
    localizationTest
  );

  result.__all = es2015Test.__all && es2016Test.__all && es2017Test.__all && localizationTest.__all;

  return result;
};
