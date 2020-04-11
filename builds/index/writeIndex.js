const loadFiles = require('../loadFiles');
const writeFile = require('../writeFile');



module.exports = (entry, withEntryName) => {
  loadFiles(entry)
    .then(({ files, globExp }) => {
      const imports = [];
      const properties = [];

      files.forEach(({ fileName, variable }) => {
        const key = withEntryName ? `[${variable}Name]` : `'${fileName}'`;
        const extraImport = withEntryName ? `, { entryName as ${variable}Name }` : '';

        imports.push(`import ${variable}${extraImport} from './${fileName}';`);
        properties.push(`${key}: ${variable}()`);
      });

      return writeFile(
        globExp.replace('*.ts', 'index.ts'),
        imports,
        `export default () => ({
  ${properties.join(',\n  ')}
});`
      );
    });
};
