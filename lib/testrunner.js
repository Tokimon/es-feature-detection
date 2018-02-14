function runTest(script) {
  try {
    var ok = (new Function(`'use strict';\nreturn ${script}`))(); // eslint-disable-line no-new-func
    return typeof ok === 'boolean' ? ok : true;
  } catch(ex) { return false; }
}

module.exports = function testRunner(tests) {
  var syntaxTests = {};
  var allOK = true;

  for(var key in tests) {
    syntaxTests[key] = runTest(tests[key]);
    if(!syntaxTests[key]) { allOK = false; }
  }

  return allOK || syntaxTests;
};
