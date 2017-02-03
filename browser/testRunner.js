function runTest(script) {
  let onErr = null;
  if(typeof script === 'object') {
    onErr = script.onerror || null;
    script = script.script;
  }

  try {
    (new Function(`'use strict';\n${script}`))(); // eslint-disable-line no-new-func
    return !onErr;
  } catch(ex) { return onErr ? onErr(ex) : false; }
}

function isArray(arr) {
  return arr.constructor === Array;
}

export default function testRunner(tests, ignore) {
  const syntaxTests = { __fullES6Support: true };

  for(const key in tests) {
    if(ignore.indexOf(key) >= 0) { continue; }

    let test = tests[key];
    let ok = true;

    if(!isArray(test)) { test = [test]; }

    for(let i = 0, l = test.length; i < l && ok; i++) {
      ok = runTest(test[i]);
    }

    syntaxTests[key] = ok;
    if(!ok) { syntaxTests.__fullES6Support = false; }
  }

  return syntaxTests;
}
