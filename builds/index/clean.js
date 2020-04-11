const { unlink } = require('fs').promises;
const { resolve, basename } = require('path');
const glob = require('globby');

const folder = resolve('!(tests|node_modules|builds)/*.@(d.ts|js)').replace(/\\+/g, '/');
const indexes = resolve('!(tests|node_modules|builds)/index.ts').replace(/\\+/g, '/');

glob([folder, indexes, './*.@(d.ts|js)'])
  .then((files) => Promise.all(
    files.map((path) => unlink(path))
  ));
