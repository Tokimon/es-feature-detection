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
  const syntaxTests = { __fullES6Support: true };

  for(const key in tests) {
    if(ignore.indexOf(key) >= 0) { continue; }

    const test = tests[key];

    let ok = true;
    // If the test is only a string, just run it
    if(!Array.isArray(test)) {
      ok = runTest(test);

    // If the entry is an array, loop through each entry and validate them
    } else {
      for(let i = 0, l = test.length; i < l && ok; i++) {
        const entry = test[i];
        ok = entry.constructor !== Array ? runTest(entry) : runTest(entry[0], entry[1]);
      }
    }

    syntaxTests[key] = ok;
    if(!ok) { syntaxTests.fullSupport = false; }
  }

  return syntaxTests;
}
