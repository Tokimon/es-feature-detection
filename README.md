# es-feature-detection

[![Build Status](https://travis-ci.org/Tokimon/es-feature-detection.svg?branch=master)](https://travis-ci.org/Tokimon/es-feature-detection)
[![install size](https://packagephobia.now.sh/badge?p=es-feature-detection)](https://packagephobia.now.sh/result?p=es-feature-detection)

ECMAScript feature and API detection in the browser.

It detects which syntax features and built-in components are supported in the current
browser.

## Installation

```
npm i es-feature-detection
```

## How to use
The different tests are divided into several sections:

- **builtins:** Native core JS objects and constructors (_Array_, _Math_, _object_, etc.)
- **dom:** DOM (browser environment) specific objects and constructors.
- **localization:** _Intl_ implementations
- **syntax:** Syntax implementations (_Promise_, _Arrow Function_, _for..of_, etc.)

You can either run all tests for a specific section by addressing its `index.js` file.
When called will it return an object where each key is a specific feature,
and its value a _boolean_ indicating if the feature is supported or not (eg. `Intl.Collator: true`).

```js
import localization from 'es-feature-detection/localization';

const supportedIntlFeatures = localization();
```

Or you can access specific tests individually for fine grained testing:

```js
import mathLog2 from 'es-feature-detection/builtins/Math.log2';

const mathLog2IsSupported = mathLog2();
```

### All OK
For convenience a `allOk` function is added in the `utils` folder, which can be
handy if you want to check if all values in an object is _true_:

```js
import localization from 'es-feature-detection/localization';
import allOk from 'es-feature-detection/utils/allOk';

const fullIntlSupport = allOk(localization());
```

If not every property is supported an array of unsupported fields is returned instead of _true_:

```js
if (fullIntlSupport !== true) {
  console.log('Unsupported features:')
  fullIntlSupport.forEach((key) => console.log(key));
}
```

### Test custom expression
If you have a specific feature you want to test, you can use the `testExpression` function,
placed in the `utils` folder, to validate a specific string (it is the one used for all tests in this module):

```js
import testExpression from 'es-feature-detection/utils/testExpression';
// Even though the example is not inventive, it is there to illustrate how it might be used
const myFeatureIsSupported = testExpression('return MyFeature.someThingToTest()');
```

The expression you pass in must be passed as a string and it can either _return true/false_
or it can fail or not. Both cases the test will return _true_ or _false_

### Need to test all features of a given ES version?
If you need to test the features introduced in a given EchmaScript version a file
for each version has been placed at the root of the module:

```js
import es2020 from 'es-feature-detection/es2020';
import allOk from 'es-feature-detection/utils/allOk';

const fullES2020Support = allOk(es2020());
```

These _esXX_ files includes both builtins and syntax features introduces in the given version.

## The reason for this module
The idea behind this module is to facilitate the detection of what a given browser
support of JS features. Does it support the ES6 syntax and what kind of polyfills
would the browser need?

The norm is and have been for quite a while to just transpile your ES6 into ES5 and
then just fill you script with the polyfills you need and you are good to go.
This works pretty well and you don't have to worry about cross browser support of
your code. But there are several drawbacks by doing so:

1. You don't leverage the performance gain of the optimized ES6 syntax, as everything stays in ES5
2. You bloat your script with polyfills you don't need
3. You bloat your script with transpiler code, that you don't need as many modern
browsers already support the new syntax. Yes IE (edge) as well.

Personally I needed a proper tool to detect features that was actually used in the script file,
so I could decide what to load, so I build this.

## Why not just use babel-env?
`babel-env` is really great tool and should definitely be the first choice. Sometimes,
though, you might have some modules (mostly 3rd party) you don't want to run through
the transpiler, but might use some built-in methods that are not necessarily
supported by all browsers. In this case there are some polyfills that are not detected
and added at compile-time.
So having the `builtins` (or `dom`) detection which can detect which polyfills you need
to load can be a good backup.

The `syntax` is useful for when you want to have two separate builds: One for newer
browsers that understand the new goodies. And one that use plain old ES 5.

### Ideas?
Have any ideas, improvement request or bugs you have found, don't hesitate to file
an issue in the [issue list](https://github.com/Tokimon/es-feature-detection/issues)
or throw me a [PR](https://github.com/Tokimon/es-feature-detection/pulls) if you
have done some improvements you want to bring to the script.
