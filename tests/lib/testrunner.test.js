const test = require('tape');
const { runTest, testRunner } = require('../../lib/testrunner');



test('`runTest`, should run a script without errors', (t) => {
  t.doesNotThrow(() => runTest('throw new Error("Do not leak")'), 'thrown Error');
  t.doesNotThrow(runTest, 'no script');
  t.end();
});

test('`runTest`, should return false on failing script', (t) => {
  t.notOk(runTest('throw new Error("Do not leak")'));
  t.end();
});

test('`runTest`, should return boolean from script', (t) => {
  t.ok(runTest('return true'), 'return true');
  t.notOk(runTest('return false'), 'return false');
  t.end();
});



test('`testRunner`, should return `__all = false` when no tests given', (t) => {
  t.deepEqual(testRunner(), { __all: false });
  t.end();
});

test('`testRunner`, should return `__all = false` when one or more test fails', (t) => {
  t.notOk(testRunner({
    thrown: 'throw "oh no";',
    failing: 'return false'
  }).__all);

  t.notOk(
    testRunner({
      thrown: 'throw "oh no";',
      failing: 'return false',
      good: 'return true'
    }).__all
  );

  t.end();
});

test('`testRunner`, should return `__all = true` when all test validates', (t) => {
  t.ok(
    testRunner({
      alright: 'return true',
      good: 'return true'
    }).__all
  );

  t.end();
});

test('`testRunner`, should return an object with results from the tests', (t) => {
  t.deepEqual(
    testRunner({
      thrown: 'throw "oh no";',
      failing: 'return false',
      good: 'return true'
    }),
    {
      thrown: false,
      failing: false,
      good: true,
      __all: false
    }
  );

  t.end();
});

test('`testRunner`, should perform test in sub lists', (t) => {
  t.deepEqual(
    testRunner({
      nogood: {
        failing: 'return false',
        good: 'return true'
      },

      allgood: {
        alright: 'return true',
        good: 'return true'
      }
    }),
    {
      nogood: {
        failing: false,
        good: true,
        __all: false
      },

      allgood: {
        alright: true,
        good: true,
        __all: true
      },

      __all: false
    },
    'Some failed tests'
  );

  t.deepEqual(
    testRunner({
      allgood: {
        alright: 'return true',
        good: 'return true'
      }
    }),
    {
      allgood: {
        alright: true,
        good: true,
        __all: true
      },

      __all: true
    },
    'all good tests'
  );

  t.end();
});
