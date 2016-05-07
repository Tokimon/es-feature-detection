'use strict';

const es5 = require('../caniuse/es5');
const es6 = require('../caniuse/es6');

function parseId(entryId) {
  // Parse browser name and version
  const m = /^([^0-9_]+)([0-9_]+)?$/.exec(entryId);
  // If it is not compliant we move on
  if(!m) { return null; }

  const browser = m[1];
  let vers = String(m[2] || -1);

  // Some version indicator are structured like 413 for version 4.13, so we try to parse that here
  if(['safari', 'konq', 'ios'].indexOf(browser) > -1 && vers.length > 1) {
    const dec = vers.substr(1).replace('_', '');
    vers = `${vers[0]}.${('0' + dec).substr(-2)}`;
  }

  // Some have a '_' instead of the '.' in the version numeber. We correct that here.
  if(browser === 'opera' || browser === 'firefox') {
    vers = vers.replace('_', '.');
  }

  return {browser, version: Number(vers)};
}

// Map browsers from the DB
function mapBrowsers(browsers) {
  return Object.keys(browsers).reduce((map, name) => {
    const current = browsers[name]

    // Skip non client and unstable browsers
    if((current.platformtype && current.platformtype !== 'mobile') || current.unstable) {
      return map;
    }

    const parsed = parseId(name);

    if(!parsed) { return map; }

    const list = map.get(parsed.browser) || new Set();
    const all = allBrowsers.get(parsed.browser) || new Set();

    // We combine the parsed version with the name, to have the correct DB name reference
    const vers = { version: parsed.version, id: name };

    // Update browser in the global
    all.add(vers);
    allBrowsers.set(parsed.browser, all);

    // Update the current browser (and return it)
    list.add(vers);
    return map.set(parsed.browser, list);
  }, new Map());
}




// Sort the browser version decending (newest first)
function sortVersions(map) {
  for(let entry of map.entries()) {
    map.set(entry[0], Array.from(entry[1]).sort((a,b) => b.version - a.version));
  }

  return map;
}




// Determine the available browsers from the DB
let allBrowsers = new Map();
const es5browsers = sortVersions(mapBrowsers(es5.browsers));
const es6browsers = sortVersions(mapBrowsers(es6.browsers));
allBrowsers = sortVersions(allBrowsers);




module.exports.parseId = parseId;

module.exports.getVersions = function getVersions(versions) {
  if(!Array.isArray(versions)) { versions = [versions]; }

  // Loop through each browser version phrase
  const parsed = versions.reduce((map, versionExp) => {
    let m;

    // Phrase like 'last 2 versions' or 'latest version'
    if(m = /(?:last|latest)( \d+)? versions?/.exec(versionExp)) {
      const i = Math.max(0, Number(m[1] || 0) -1);

      // Loop through all the browsers
      for(let entry of allBrowsers.entries()) {
        const browser = entry[0];
        const list = entry[1];

        // Grab the version from the defined index
        let vers = list[i];
        // Or the last if it doesn't have a version list that long
        if(!vers) { vers = list[list.length -1]; }

        // We go for lowest version, so only update entry if the found version
        // is lower than the currently stored one
        const curr = map.get(browser);
        if(!curr || curr.version > vers.version) { map.set(browser, vers); }
      }



    // Exact browser like 'ie 8' or 'FireFox 30'
    } else if(m = /(\w+)\s+([0-9.]+)/.exec(versionExp)) {
      const browser = m[1];
      const target = Number(m[2]);
      let list = allBrowsers.get(browser);

      // Just stop here if there were no browser stored with that name
      if(!list) { return map; }

      let vers;

      // Search for a matching version
      // - should be the same or the first that is lower
      list.some((item) => {
        if(item.version <= target) {
          vers = item;
          return true;
        }
      });

      // Take the lowest version if the defined version was too low
      if(!vers) { vers = list[list.length -1]; }

      // We go for lowest version, so only update entry if the found version
      // is lower than the currently stored one
      const curr = map.get(browser);
      if(!curr || curr.version > vers.version) { map.set(browser, vers); }
    }


    // Return the findings
    return map;
  }, new Map());

  return {
    all: allBrowsers,
    es5: es5browsers,
    es6: es6browsers,
    parsed: parsed
  }
}
