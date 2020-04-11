const { resolve } = require('path');

const loadFiles = require('../loadFiles');
const writeFile = require('../writeFile');


module.exports = (section, extraFn = 'testExpression') => {
  loadFiles(section)
    .then(({ files, globExp }) => {
      const imports = [];
      const properties = [];

      const writes = files.map(({ fileName, variable }) => {
        const filePath = resolve('tests', section, fileName + '.test.ts');

        return writeFile(
          filePath,
          [
            `import suite from '../helpers/suite';`,
            `import extra from '../helpers/${extraFn}';`,
            `import * as file from '../../${section}/${fileName}';`
          ],
`suite({
  section: '${section}',
  name: '${fileName}',
  file,
  extra
});
`
        );
      });
    });
};
