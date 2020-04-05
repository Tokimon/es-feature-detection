const { writeFile } = require('fs').promises;
const { resolve, basename } = require('path');
const glob = require('globby');
const pascalCase = require('vanillajs-helpers/cjs/pascalCase').default;

const defaultParseImport = (fileName, variable) => `import ${variable} from './${fileName}';`;
const defaultParseExport = (fileName, variable) => `'${fileName}': ${variable}()`;

module.exports = (entry, parseImport = defaultParseImport, parseExport = defaultParseExport) => {
  const tsGlob = resolve(entry, '*.ts').replace(/\\+/g, '/');
  const indexFile = tsGlob.replace('*.ts', 'index.ts');

  glob(tsGlob)
    .then((files) => {
      const lines = files
        .filter((path) => !path.includes('/index.ts'))
        .reduce(
          (mapping, path) => {
            const fileName = basename(path, '.ts');
            const variable = pascalCase(fileName);

            mapping[0].push(parseImport(fileName, variable));
            mapping[1].push(parseExport(fileName, variable));

            return mapping;
          },
          [[], []]
        );

      return writeFile(indexFile, `${lines[0].join('\n')}

export default () => ({
  ${lines[1].join(',\n  ')}
});
`);
    })
};
