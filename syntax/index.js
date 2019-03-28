import assign from '../lib/assign';

import es2015 from './es2015';
import es2016 from './es2016';
import es2017 from './es2017';
import es2018 from './es2018';
import es2019 from './es2019';

export default () => {
  const es2015Test = es2015();
  const es2016Test = es2016();
  const es2017Test = es2017();
  const es2018Test = es2018();
  const es2019Test = es2019();

  const result = assign(
    {
      es2015: es2015Test,
      es2016: es2016Test,
      es2017: es2017Test,
      es2018: es2018Test,
      es2019: es2019Test
    },
    es2015Test,
    es2016Test,
    es2017Test,
    es2018Test,
    es2019Test,
    {
      __all: (
        es2015Test.__all &&
        es2016Test.__all &&
        es2017Test.__all &&
        es2018Test.__all &&
        es2019Test.__all
      )
    }
  );

  return result;
};
