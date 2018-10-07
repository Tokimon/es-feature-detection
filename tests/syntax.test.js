const test = require('tape');
const syntax = require('../syntax');
const years = [];

for (let year = 2015; year <= 2018; year++) {
  years.push(year);
}

const JSONs = years.reduce((json, year) => {
  const jsPath = `../syntax/es${year}.js`;
  json[year] = require(jsPath + 'on');

  test(`SYNTAX - es${year}, export all tests defined in JSON`, (t) => {
    const tests = Object.keys(json[year]);
    t.ok(tests.length > 0, 'Exports tests');

    tests.push('__all');

    const hasAll = Object.keys(require(jsPath)()).every((test) => tests.includes(test));

    t.ok(hasAll, 'Has all keys defined in the JSON');
    t.end();
  });

  return json;
}, {});


test('SYNTAX - index, should import all ES versions', (t) => {
  const syntaxTest = syntax();

  const hasAll = years
    .map((year) => 'es' + year)
    .every((esVersion) => syntaxTest[esVersion]);

  t.ok(hasAll, 'Imports all es versions');
  t.end();
});

test('SYNTAX - index, each ES versions should have corresponding test keys', (t) => {
  const syntaxTest = syntax();

  years.forEach((year) => {
    const syntaxTests = Object.keys(syntaxTest['es' + year]);
    const tests = Object.keys(JSONs[year]);
    tests.push('__all');

    const hasAll = syntaxTests.every((test) => tests.includes(test));
    t.ok(hasAll, 'es' + year + ': Has all tests (including `__all`)');
  });

  t.end();
});

test('SYNTAX - index, should have all keys from all tests at the root', (t) => {
  const syntaxTest = syntax();

  const hasAll = years
    .reduce((all, year) => all.concat(Object.keys(JSONs[year])), [])
    .every((test) => test in syntaxTest);

  t.ok(hasAll, 'Has all tests from es versions');
  t.ok('__all' in syntaxTest, 'Also includes the `__all` property');
  t.end();
});
