# es-feature-detection
ECMAScript feature and API detection in the browser.

## The why?
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

I needed a proper tool to detect features that was actually used in the script file,
so I could decide what to load.

## The how?

You can go about in several ways.

### Raw browser detection methods
You can use the raw feature detection scripts directly into a start up script as is via:

```javascript
import es6syntax from 'es-feature-detection/browser/es6syntax';
import features from 'es-feature-detection/browser/features';

if(es6syntax()) {
  // load you uncompiled script
} else {
  // Load you es5 script
}

const apis = features();

if(!apis.Object.assign) {
  // load a polyfill for the missing functionality
}
```

### Detect used features

If you are using some kind of build process you can detect the used features on beforehand, that you can use to determine which test you actually need to look at:

```javascript
const detectFeatures = require('es-feature-detection/lib/detectFeatures');

detectFeatures(['script1', 'script2'])
  .then((features) => {
    // features = an array of features used
    // eg. ['Array.from', 'Object.assign', 'Promise', 'Proxy', etc...]
  });
```

But this array can contain features that your target browsers may support anyway
so we can look into the caniuse DB to see what kind of features we actually need
to test for in target browsers:

```javascript
const detectFeatures = require('es-feature-detection/lib/detectFeatures');
const filterFeatures = require('es-feature-detection/lib/filterFeatures');

detectFeatures(['script1', 'script2'])
  .then((features) => {
    // features = ['Array.indexOf', 'Array.map', 'Object.assign', 'Promise', 'Proxy']
    return filterFeatures(features, ['latest browsers', 'IE 10']);
  })
  .then((filteredFeatures) => {
    // filteredFeatures = ['Object.assign', 'Promise', 'Proxy']
  });
```

Now we are getting somewhere, but we can do even better. Right now the feature script we include is still fairly large compared to our actual needs, so how about we cut down that
script to only what we need:

```javascript
const detectFeatures = require('es-feature-detection/lib/detectFeatures');
const filterFeatures = require('es-feature-detection/lib/filterFeatures');
const composeScript = require('es-feature-detection/lib/featureTestParser').compose;

detectFeatures(['script1', 'script2'])
  .then((features) => {
    // features = ['Array.indexOf', 'Array.map', 'Object.assign', 'Promise', 'Proxy']
    return filterFeatures(features, ['latest browsers', 'IE 10']);
  })
  .then((filteredFeatures) => {
    // filteredFeatures = ['Object.assign', 'Promise', 'Proxy']
    return composeScript(filteredFeatures);
  })
  .then((composedScript) => {
    const writeStream = fs.createWriteStream('featuretest.js');
    // The composed script contains of 2 parts:
    // 1. the filtered feature list, that you can use as you want
    writeStream.write(`const features = ['${composedScript.fetures.join("',''")}'];\n`);

    // 2. The feature detection script lines
    // fx. remove the export declaration as we don't need it
    composedScript.lines[0] = composedScript.lines[0].replace('export default ', '');

    // Write the lines to a file
    writeStream.write(composedScript.lines.join('\n'));
  });
```

Like that you have an optimized script to include in you page that can detect syntax and features of the browser of the user, so you can load just what you need and nothing more.

### Ideas?
Have any ideas, improvement request or bugs you have found, don't hesitate to file an issue in the [issue list](https://github.com/Tokimon/es-feature-detection/issues) or throw me a PR if you have done some improvements you want to bring to the script.
