import test from 'tape';
import glob from 'glob';
import { basename, resolve } from 'path';

import builtins from '../builtins';

const sections = ['localization'];

for (let year = 2015; year <= 2017; year++) {
  sections.push('es' + year);
}

const JSONs = sections.reduce((json, section) => {
  const path = resolve(`builtins/${section}`);
  const jsonFiles = glob.sync(`${path}/*.json`);

  json[section] = jsonFiles
    .reduce((all, jsonFile) => {
      const fileName = jsonFile.substring(jsonFile.lastIndexOf('/') + 1, jsonFile.length - 5);
      const subJson = require(jsonFile);
      const js = require(jsonFile.substring(0, jsonFile.length - 2)).default;

      const subSection = basename(jsonFile, '.json');

      test(`BUILTINS - ${section}.${subSection}, export all tests defined in JSON`, (t) => {
        const tests = Object.keys(subJson);
        t.ok(tests.length > 0, 'Exports tests');

        tests.push('__all');

        try {
          const hasAll = Object.keys(js()).every((test) => tests.includes(test));

          t.ok(hasAll, 'Has all keys defined in the JSON');
          t.end();
        } catch (ex) {
          console.error(ex);
          t.end(`[${fileName}] Failed to export`);
        }
      });


      return Object.assign(all, subJson);
    }, {});

  test(`BUILTINS - ${section}, export all tests defined in all sub JSONs`, (t) => {
    const tests = Object.keys(json[section]);
    t.ok(tests.length > 0, 'Exports tests');

    tests.push('__all');

    const runTest = require(path).default;

    if (typeof runTest === 'function') {
      const hasAll = Object.keys(runTest()).every((test) => tests.includes(test));
      t.ok(hasAll, 'Has all keys defined in the sub JSONs');
    } else {
      t.fail(`${path} does not export default`);
    }

    t.end();
  });

  return json;
}, {});


test('BUILTINS - index, should import all builtin sections', (t) => {
  const builtinsTest = builtins();

  const hasAll = sections
    .every((section) => builtinsTest[section]);

  t.ok(hasAll, 'Imports all builtin sections');
  t.end();
});

test('BUILTINS - index, each builtin section should have corresponding test keys', (t) => {
  const builtinsTest = builtins();

  sections.forEach((section) => {
    const builtinsTests = Object.keys(builtinsTest[section]);
    const tests = Object.keys(JSONs[section]);
    tests.push('__all');

    const hasAll = builtinsTests.every((test) => tests.includes(test));
    t.ok(hasAll, section + ': Has all tests (including `__all`)');
  });

  t.end();
});

test('BUILTINS - index, should have all keys from all tests at the root', (t) => {
  const builtinsTest = builtins();

  const hasAll = sections
    .reduce((all, section) => all.concat(Object.keys(JSONs[section])), [])
    .every((test) => test in builtinsTest);

  t.ok(hasAll, 'Has all tests from sections');
  t.ok('__all' in builtinsTest, 'Also includes the `__all` property');
  t.end();
});
