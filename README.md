# es-feature-detection

[![npm](https://img.shields.io/npm/v/es-feature-detection)](https://www.npmjs.com/package/es-feature-detection)

Detect which modern ECMAScript features the current JavaScript environment supports,
so you can decide at runtime what to polyfill or which build to load.

It is built for the browser, but it runs in any JavaScript runtime (Node, Bun, Deno).

## Installation

```
npm i es-feature-detection
```

The package is **ESM only**. It ships TypeScript types and is marked `sideEffects: false`,
so bundlers only include the tests you import.

## Usage

The typical use is to pick a build (or a set of polyfills) based on what the browser supports:

```js
import es2025 from 'es-feature-detection/es2025';
import allOk from 'es-feature-detection/utils/allOk';

if (allOk(es2025()) === true) {
  import('./app.modern.js');
} else {
  import('./app.legacy.js');
}
```

### Sections

Tests are divided into three sections:

- **builtins:** Native core JS objects, constructors and methods (_Iterator_, _Set.prototype.union_, _Temporal_, etc.)
- **localization:** _Intl_ (ECMA-402) features (_Intl.DurationFormat_, _Intl.Locale_ info methods)
- **syntax:** Syntax features (_using_ declarations, _RegExp modifiers_, _import attributes_, etc.)

Importing a section returns a function. Calling it returns an object where each key is a feature
and each value is a _boolean_ telling whether it is supported (e.g. `'Iterator.from': true`).

```js
import builtins from 'es-feature-detection/builtins';

const supportedBuiltins = builtins();
```

Or import a single test:

```js
import setUnion from 'es-feature-detection/builtins/Set.prototype.union';

const setUnionIsSupported = setUnion();
```

### By ECMAScript edition

Each edition that has features in this package has its own entry point
(`es2017`, `es2021` ... `es2027`), named after the edition each
[finished proposal](https://github.com/tc39/proposals/blob/main/finished-proposals.md) targets.
It includes the builtins, localization and syntax features of that edition:

```js
import es2025 from 'es-feature-detection/es2025';

const es2025Features = es2025();
```

### All OK

`allOk` checks whether every value in a result object is `true`:

```js
import builtins from 'es-feature-detection/builtins';
import allOk from 'es-feature-detection/utils/allOk';

const fullSupport = allOk(builtins());
```

If any feature is unsupported, it returns an array of the unsupported feature names instead of `true`:

```js
if (fullSupport !== true) {
  console.log('Unsupported features:', fullSupport.join(', '));
}
```

### Test a custom expression

`testExpression` is the function every test in this package uses. Pass it a string, which is
run as the body of a strict-mode function. The feature counts as supported if the code runs
without throwing and does not return `false`:

```js
import testExpression from 'es-feature-detection/utils/testExpression';

const toSortedIsSupported = testExpression(
  "return typeof Array.prototype.toSorted === 'function'",
);
```

## What a test tells you

- **Builtin and localization tests** check that a feature exists (e.g. `typeof Set.prototype.union === 'function'`),
  not that it is fully spec-compliant.
- **Syntax tests** compile and run a tiny snippet. A syntax error means the syntax is unsupported.
- **Content Security Policy:** every test uses `new Function`. On a page whose CSP does not allow
  `'unsafe-eval'` (or that enforces Trusted Types), **every test returns `false`**, because the
  test is blocked, not because the feature is missing.
- **`SharedArrayBuffer` and `Atomics`** are only available on cross-origin isolated pages
  (COOP/COEP headers), so they can be `false` in a browser that supports them.

## Which features are included

Only features that are **less than ~3 years old in browsers** are included, based on Baseline data
from [web-features](https://github.com/web-platform-dx/web-features) (the date when the last of
Chrome, Edge, Firefox and Safari shipped it). Anything older is left out on purpose: just use it.
The exception is `SharedArrayBuffer` and `Atomics` (see above).

The selection is as of **November 2026**. As features pass the 3-year mark they are removed,
in a major release.

<!-- features:start -->

### ES2017

| Feature             | Import                                            |
| ------------------- | ------------------------------------------------- |
| `Atomics`           | `es-feature-detection/builtins/Atomics`           |
| `SharedArrayBuffer` | `es-feature-detection/builtins/SharedArrayBuffer` |

### ES2021

| Feature          | Import                                             |
| ---------------- | -------------------------------------------------- |
| `Intl.Segmenter` | `es-feature-detection/localization/Intl.Segmenter` |

### ES2023

| Feature              | Import                                             |
| -------------------- | -------------------------------------------------- |
| `WeakMap.symbolKeys` | `es-feature-detection/builtins/WeakMap.symbolKeys` |

### ES2024

| Feature                                       | Import                                                                      |
| --------------------------------------------- | --------------------------------------------------------------------------- |
| `ArrayBuffer.prototype.detached`              | `es-feature-detection/builtins/ArrayBuffer.prototype.detached`              |
| `ArrayBuffer.prototype.resize`                | `es-feature-detection/builtins/ArrayBuffer.prototype.resize`                |
| `ArrayBuffer.prototype.transfer`              | `es-feature-detection/builtins/ArrayBuffer.prototype.transfer`              |
| `ArrayBuffer.prototype.transferToFixedLength` | `es-feature-detection/builtins/ArrayBuffer.prototype.transferToFixedLength` |
| `Atomics.waitAsync`                           | `es-feature-detection/builtins/Atomics.waitAsync`                           |
| `Map.groupBy`                                 | `es-feature-detection/builtins/Map.groupBy`                                 |
| `Object.groupBy`                              | `es-feature-detection/builtins/Object.groupBy`                              |
| `Promise.withResolvers`                       | `es-feature-detection/builtins/Promise.withResolvers`                       |

### ES2025

| Feature                                         | Import                                                                            |
| ----------------------------------------------- | --------------------------------------------------------------------------------- |
| `DataView.prototype.getFloat16`                 | `es-feature-detection/builtins/DataView.prototype.getFloat16`                     |
| `Float16Array`                                  | `es-feature-detection/builtins/Float16Array`                                      |
| `Iterator`                                      | `es-feature-detection/builtins/Iterator`                                          |
| `Iterator.from`                                 | `es-feature-detection/builtins/Iterator.from`                                     |
| `Iterator.prototype.drop`                       | `es-feature-detection/builtins/Iterator.prototype.drop`                           |
| `Iterator.prototype.every`                      | `es-feature-detection/builtins/Iterator.prototype.every`                          |
| `Iterator.prototype.filter`                     | `es-feature-detection/builtins/Iterator.prototype.filter`                         |
| `Iterator.prototype.find`                       | `es-feature-detection/builtins/Iterator.prototype.find`                           |
| `Iterator.prototype.flatMap`                    | `es-feature-detection/builtins/Iterator.prototype.flatMap`                        |
| `Iterator.prototype.forEach`                    | `es-feature-detection/builtins/Iterator.prototype.forEach`                        |
| `Iterator.prototype.map`                        | `es-feature-detection/builtins/Iterator.prototype.map`                            |
| `Iterator.prototype.reduce`                     | `es-feature-detection/builtins/Iterator.prototype.reduce`                         |
| `Iterator.prototype.some`                       | `es-feature-detection/builtins/Iterator.prototype.some`                           |
| `Iterator.prototype.take`                       | `es-feature-detection/builtins/Iterator.prototype.take`                           |
| `Iterator.prototype.toArray`                    | `es-feature-detection/builtins/Iterator.prototype.toArray`                        |
| `Math.f16round`                                 | `es-feature-detection/builtins/Math.f16round`                                     |
| `Promise.try`                                   | `es-feature-detection/builtins/Promise.try`                                       |
| `RegExp.escape`                                 | `es-feature-detection/builtins/RegExp.escape`                                     |
| `Set.prototype.difference`                      | `es-feature-detection/builtins/Set.prototype.difference`                          |
| `Set.prototype.intersection`                    | `es-feature-detection/builtins/Set.prototype.intersection`                        |
| `Set.prototype.isDisjointFrom`                  | `es-feature-detection/builtins/Set.prototype.isDisjointFrom`                      |
| `Set.prototype.isSubsetOf`                      | `es-feature-detection/builtins/Set.prototype.isSubsetOf`                          |
| `Set.prototype.isSupersetOf`                    | `es-feature-detection/builtins/Set.prototype.isSupersetOf`                        |
| `Set.prototype.symmetricDifference`             | `es-feature-detection/builtins/Set.prototype.symmetricDifference`                 |
| `Set.prototype.union`                           | `es-feature-detection/builtins/Set.prototype.union`                               |
| `Intl.DurationFormat`                           | `es-feature-detection/localization/Intl.DurationFormat`                           |
| `Intl.DurationFormat.prototype.format`          | `es-feature-detection/localization/Intl.DurationFormat.prototype.format`          |
| `Intl.DurationFormat.prototype.formatToParts`   | `es-feature-detection/localization/Intl.DurationFormat.prototype.formatToParts`   |
| `Intl.DurationFormat.prototype.resolvedOptions` | `es-feature-detection/localization/Intl.DurationFormat.prototype.resolvedOptions` |
| `importAttributes`                              | `es-feature-detection/syntax/importAttributes`                                    |
| `regExpDuplicateNamedGroups`                    | `es-feature-detection/syntax/regExpDuplicateNamedGroups`                          |
| `regExpModifiers`                               | `es-feature-detection/syntax/regExpModifiers`                                     |

### ES2026

| Feature                                 | Import                                                                |
| --------------------------------------- | --------------------------------------------------------------------- |
| `Array.fromAsync`                       | `es-feature-detection/builtins/Array.fromAsync`                       |
| `Error.isError`                         | `es-feature-detection/builtins/Error.isError`                         |
| `Iterator.concat`                       | `es-feature-detection/builtins/Iterator.concat`                       |
| `JSON.isRawJSON`                        | `es-feature-detection/builtins/JSON.isRawJSON`                        |
| `JSON.rawJSON`                          | `es-feature-detection/builtins/JSON.rawJSON`                          |
| `Map.prototype.getOrInsert`             | `es-feature-detection/builtins/Map.prototype.getOrInsert`             |
| `Map.prototype.getOrInsertComputed`     | `es-feature-detection/builtins/Map.prototype.getOrInsertComputed`     |
| `Math.sumPrecise`                       | `es-feature-detection/builtins/Math.sumPrecise`                       |
| `Uint8Array.fromBase64`                 | `es-feature-detection/builtins/Uint8Array.fromBase64`                 |
| `Uint8Array.fromHex`                    | `es-feature-detection/builtins/Uint8Array.fromHex`                    |
| `Uint8Array.prototype.setFromBase64`    | `es-feature-detection/builtins/Uint8Array.prototype.setFromBase64`    |
| `Uint8Array.prototype.setFromHex`       | `es-feature-detection/builtins/Uint8Array.prototype.setFromHex`       |
| `Uint8Array.prototype.toBase64`         | `es-feature-detection/builtins/Uint8Array.prototype.toBase64`         |
| `Uint8Array.prototype.toHex`            | `es-feature-detection/builtins/Uint8Array.prototype.toHex`            |
| `WeakMap.prototype.getOrInsert`         | `es-feature-detection/builtins/WeakMap.prototype.getOrInsert`         |
| `WeakMap.prototype.getOrInsertComputed` | `es-feature-detection/builtins/WeakMap.prototype.getOrInsertComputed` |

### ES2027

| Feature                                     | Import                                                                        |
| ------------------------------------------- | ----------------------------------------------------------------------------- |
| `AsyncDisposableStack`                      | `es-feature-detection/builtins/AsyncDisposableStack`                          |
| `Atomics.pause`                             | `es-feature-detection/builtins/Atomics.pause`                                 |
| `DisposableStack`                           | `es-feature-detection/builtins/DisposableStack`                               |
| `Iterator.prototype.chunks`                 | `es-feature-detection/builtins/Iterator.prototype.chunks`                     |
| `Iterator.prototype.includes`               | `es-feature-detection/builtins/Iterator.prototype.includes`                   |
| `Iterator.prototype.join`                   | `es-feature-detection/builtins/Iterator.prototype.join`                       |
| `Iterator.prototype.windows`                | `es-feature-detection/builtins/Iterator.prototype.windows`                    |
| `Iterator.zip`                              | `es-feature-detection/builtins/Iterator.zip`                                  |
| `Iterator.zipKeyed`                         | `es-feature-detection/builtins/Iterator.zipKeyed`                             |
| `SuppressedError`                           | `es-feature-detection/builtins/SuppressedError`                               |
| `Symbol.asyncDispose`                       | `es-feature-detection/builtins/Symbol.asyncDispose`                           |
| `Symbol.dispose`                            | `es-feature-detection/builtins/Symbol.dispose`                                |
| `Temporal`                                  | `es-feature-detection/builtins/Temporal`                                      |
| `Intl.Locale.prototype.getCalendars`        | `es-feature-detection/localization/Intl.Locale.prototype.getCalendars`        |
| `Intl.Locale.prototype.getCollations`       | `es-feature-detection/localization/Intl.Locale.prototype.getCollations`       |
| `Intl.Locale.prototype.getHourCycles`       | `es-feature-detection/localization/Intl.Locale.prototype.getHourCycles`       |
| `Intl.Locale.prototype.getNumberingSystems` | `es-feature-detection/localization/Intl.Locale.prototype.getNumberingSystems` |
| `Intl.Locale.prototype.getTextInfo`         | `es-feature-detection/localization/Intl.Locale.prototype.getTextInfo`         |
| `Intl.Locale.prototype.getTimeZones`        | `es-feature-detection/localization/Intl.Locale.prototype.getTimeZones`        |
| `Intl.Locale.prototype.getWeekInfo`         | `es-feature-detection/localization/Intl.Locale.prototype.getWeekInfo`         |
| `awaitUsingDeclaration`                     | `es-feature-detection/syntax/awaitUsingDeclaration`                           |
| `usingDeclaration`                          | `es-feature-detection/syntax/usingDeclaration`                                |

<!-- features:end -->

## Contributing

Issues and pull requests are welcome in the [issue list](https://github.com/Tokimon/es-feature-detection/issues)
and [pull requests](https://github.com/Tokimon/es-feature-detection/pulls).

To add a test:

1. Create `src/<section>/<Feature.name>.ts`, exporting the `expression` string and a default
   function that calls `testExpression(expression)` (copy an existing file).
2. Register it in the matching `src/esXXXX.ts`.
3. Run `bun run lint`, `bun run typecheck` and `bun test`. The tests fail if a file is not
   registered in an edition file, or if the expression does not mention the feature in its name.

The `index.ts` files in `src/` are generated by `bun run build:index`, and the feature list in this
README by `bun run readme`. Both run as part of `bun run build`, so don't edit them by hand.
