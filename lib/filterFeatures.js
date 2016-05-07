'use strict';

const es5 = require('../caniuse/es5');
const es6 = require('../caniuse/es6');

const browserVersions = require('./browserVersions');
const getVersions = browserVersions.getVersions;
const pid = browserVersions.parseId;

function polyfillNeeded(browsers, versions, testCase) {
  for(let entry of browsers.entries()) {
    const browser = entry[0];
    const target = entry[1];
    const versionList = versions.get(browser);

    // If the version demanded version is greater than the highest one in the list, just skip it
    if(!versionList || target.version > versionList[0].version) { continue; }

    const test = testCase.res[target.id];

    // If there is no result for the current test, look if there should be one
    // for lower versions
    if(typeof test === 'undefined') {
      let closestVersion = 0;
      const closestId = Object.keys(testCase.res).reduce((closest, id) => {
        if(id.indexOf(browser) !== 0) { return closest; }

        const v = pid(id).version;
        if(v < target.version && v > closestVersion) {
          closestVersion = v;
          return id;
        }
      });

      if(!closestId || testCase.res[closestId] !== true) { return true; }

    // if the test is not really passed
    // Just return true as the browser needs a polyfill for the feature
    } else if(test !== true) { return true; };
  }

  // If none of the tests already returned true, it means no polyfill is needed, so return false
  return false;
}

module.exports = function filterFeatures(features, versions) {
  const dbBrowsers = getVersions(versions);

  return features.filter((feature) => {
    const split = feature.split('.');
    const obj = split[0];
    const method = (split[1] || '');

    // Start by checking ES 5
    let test = null;
    es5.tests.some((t) => {
      if(!(new RegExp(`^${obj}`)).test(t.name)) { return false; }

      if(t.subtests) {

        // Otherwise search for a matching sub test
        for(let sub of t.subtests) {
          if(sub.name.replace('.prototype.', '.') === feature) {
            test = sub;
            return true;
          }
        }
      } else if(t.name.replace('.prototype.', '.') === feature) {
        test = t;
        return true;
      }
    });

    if(test) { return polyfillNeeded(dbBrowsers.parsed, dbBrowsers.es5, test); }

    // If feature was not a es5 feature then test es6
    es6.tests.some((t) => {
      // We only look at 'built-ins' or 'built-in extensions' and only if it is
      // concerning the current Object
      if(
        ['built-ins', 'built-in extensions'].indexOf(t.category) < 0
        || !(new RegExp(`^${obj}`)).test(t.name)
      ) { return false; }


      if(!method) {
        // If there is a 'basic functionality' sub category, just examine that test
        if(t.subtests['basic functionality']) {
          test = t.subtests['basic functionality'];
          return true;
        }

        // Examine all tests if there is no 'basic functionality' sub category
        test = Object.keys(t.subtests).map((sub) => t.subtests[sub]);
        return true;
      }

      // Otherwise search for a matching sub test
      for(let sub of t.subtests) {
        if(sub.name.replace('.prototype.', '.') === feature) {
          test = sub;
          return true;
        }
      }
    });

    // If it is an array of tests see if polyfill would be needed for one of them
    if(Array.isArray(test)) { return test.some((t) => polyfillNeeded(dbBrowsers.parsed, dbBrowsers.es6, t)); }

    // If it is just one, then see if the polyfill would be needed for the feature
    if(test) { return polyfillNeeded(dbBrowsers.parsed, dbBrowsers.es6, test); }

    // If no test was found in the caniuse db then leave it in the list, so the
    // browser can perform the test
    return true;
  });
}
