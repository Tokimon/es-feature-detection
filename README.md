# es-feature-detection

[![Build Status](https://travis-ci.org/Tokimon/es-feature-detection.svg?branch=master)](https://travis-ci.org/Tokimon/es-feature-detection)

ECMAScript feature and API detection in the browser.

It detects which syntax features and builtin components are supported in the current
browser.

## Installation

```
npm install es-feature-detection
```

## Usage
Once the test is finished it returns an object with the features supported with
subdivisions per ES version for convenience. A property `__all` is added to indicate
whether all features are supported or not (also included in subdivisions).

```js
import { syntax, builtins } from 'es-feature-detection';

const syntaxTest = syntax();

if(syntaxTest.__all) {
  // load your uncompiled script
} else {
  // Load your es5 script
}

const builtinsTest = builtins();

if(!builtinsTest.__all) {
  // load a polyfill for the missing functionality
  // eg. Map
  if(!builtinsTest.Map) {
    // Load your polyfill
  }
}
```

### Only test certain features
Sometimes you already know what you want to test for and as such don't need to
test all ES XX features to see what your browser supports. In this case you can directly
access the tests like so:

```js
import es2015Builtins from 'es-feature-detection/builtins/es2015';
import es2015Syntax from 'es-feature-detection/syntax/es2015';

if(!es2015Builtins().__all) {
  // Load your polyfills
}

if(!es2015Syntax().__all) {
  // Load your es5 script
}
```

The same technique of cause goes for all ES versions.

For builtins you can have even more granularity, by selecting which segments you need:

```js
import es2015Arrays from 'es-feature-detection/builtins/es2015/array';

if(!es2015Arrays().__all) {
  // Load your polyfills
}
```

#### Built-ins segments
A full list of the segments you can address directly:

- *es2015*
  - **array**
  - **mapSet** (Map/Set)
  - **math**
  - **misc** (*Base64 en-/decoding*, *Promise*, *Proxy*, *Reflect*, *requestAnimationFrame*, *Symbol*, *new.target*)
  - **number**
  - **object**
  - **string**
  - **typedarray**
- *es2016*
  - **array.includes**
- *es2017*
  - **misc** (*Atomics*, *SharedArrayBuffer*)
  - **object**
  - **string**
- *localization*
  - **localization**

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
`babel-env` is really great tool and should definitely be the first choice. Sometimes
though you have modules (mostly 3rd party) that you don't want to run through the babel
transpiler and as such may some built in features that needs polyfilling but are not detected.
So having the `builtins` detection which tells you what polyfills you need to load can be a good backup.

The `syntax` is usefull for when you want to have to separate builds. One for newer
browsers that understand the new goodies. And one that use plain old ES 5 (\*cough\* IE).

### Ideas?
Have any ideas, improvement request or bugs you have found, don't hesitate to file an issue in the [issue list](https://github.com/Tokimon/es-feature-detection/issues) or throw me a [PR](https://github.com/Tokimon/es-feature-detection/pulls) if you have done some improvements you want to bring to the script.
