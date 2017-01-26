function runTest(script) {
  let onErr = null;
  if(typeof script === 'object') {
    onErr = script.onerror || null;
    script = script.script;
  }

  try {
    (new Function(`'use strict';\n${script}`))();
    return !onErr;
  } catch(ex) { return onErr ? onErr(ex) : false; }
}

export default function testRunner(tests, ignore) {
  return Object.keys(tests)
    .reduce((obj, key) => {
      if(ignore.indexOf(key) >= 0) {
        return obj;
      }

      const test = tests[key];

      // If the test is only a string, just run it
      if(!Array.isArray(test)) {
        obj[key] = runTest(test);

      // If the entry is an array, loop through each entry and validate them
      } else {
        obj[key] = test.every(
          (entry) => !Array.isArray(entry) ? runTest(entry) : runTest(entry[0], entry[1])
        );
      }

      return obj;
    }, {});
}
