const { resolve, basename } = require('path');
const glob = require('globby');
const pascalCase = require('vanillajs-helpers/cjs/pascalCase').default;

module.exports = (entry) => {
  const globExp = resolve(entry, '*.ts').replace(/\\+/g, '/');

  return glob(globExp)
    .then((paths) => {
      const files = paths
        .filter((path) => !path.includes('/index.ts'))
        .map((path) => {
          const fileName = basename(path, '.ts');
          const variable = pascalCase(fileName);

          return { fileName, variable };
        })

      return { globExp, files }
    });
};
