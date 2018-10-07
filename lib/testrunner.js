function runTest(script) {
  try {
    return (new Function('"use strict";\n' + script))() !== false; // eslint-disable-line no-new-func
  } catch (ex) {
    return false;
  }
}

function testRunner(tests) {
  var testResults = {};
  var testCount = 0;
  var testOK = 0;

  for (var key in tests) {
    var test = tests[key];

    if (typeof test === 'object') {
      testCount++;
      testResults[key] = testRunner(test);
      if (testResults[key].__all) { testOK++; }
    } else if (typeof test === 'string') {
      testCount++;
      testResults[key] = runTest(test);
      if (testResults[key]) { testOK++; }
    }
  }

  testResults.__all = testCount > 0 && testCount === testOK;

  return testResults;
}

module.exports = { testRunner: testRunner, runTest: runTest };
