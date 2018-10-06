const test = require('tape');
const JSONS = {};

for (let year = 2015; year <= 2017; year++) {
  const jsPath = `../syntax/es${year}.js`;
  JSONS[year] = require(jsPath + 'on');

  test(`SYNTAX - es${year}, should not fail loading`, (t) => {
    t.doesNotThrow(() => () => require(jsPath)());
    t.end();
  });

  test(`SYNTAX - es${year}, export all tests defined in JSON`, (t) => {
    const tests = Object.keys(JSONS[year]);
    tests.push('__all');

    const hasAll = Object.keys(require(jsPath)()).every((key) => tests.includes(key));

    t.ok(hasAll, 'Has all keys defined in the JSON');
    t.end();
  });
}
