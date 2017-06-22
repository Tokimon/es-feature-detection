const nPath = require('path');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const globby = require('globby');

const srcPath = nPath.resolve('./es6');

function compile(entry) {
  const dest = nPath.resolve(nPath.relative(srcPath, entry));

  return rollup.rollup({
    entry,
    plugins: [babel()]
  }).then((bundle) => bundle.write({
    format: 'cjs',
    dest
  })).catch(console.error); // log errors
}

globby(nPath.join(srcPath, '/**/*.js'))
  .then((files) => Promise.all(files.map((file) => compile(file))))
  .then(() => console.log('ES5 compilation done'));
