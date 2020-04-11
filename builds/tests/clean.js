const { unlink, rmdir } = require('fs').promises;
const { resolve, basename } = require('path');
const glob = require('globby');

const globExp = resolve('tests/!(utils|helpers|tsconfig.json)/**').replace(/\\+/g, '/');

const del = (method) => (paths) => Promise.all(paths.map((p) => method(p)));

glob(globExp, { onlyFiles: true })
  .then(del(unlink))
  .then(() => glob(globExp, { onlyDirectories: true }))
  .then(del(rmdir));
