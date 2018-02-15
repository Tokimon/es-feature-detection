function runTest(script) {
  try {
    return (new Function(`'use strict';\n${script}`))() !== false; // eslint-disable-line no-new-func
  } catch(ex) {
    return false;
  }
}

function testRunner(tests) {
  var testResults = { __all: true };

  for(var key in tests) {
    var test = tests[key];
    if(!test) { continue; }

    if(typeof test === 'object') {
      testResults[key] = testRunner(test);
      if(!testResults[key].__all) { testResults.__all = false; }
    } else {
      testResults[key] = runTest(test);
      if(!testResults[key]) { testResults.__all = false; }
    }
  }

  return testResults;
}

module.exports = { testRunner };
