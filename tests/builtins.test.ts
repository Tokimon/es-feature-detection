import globby from 'globby';
import { basename, resolve } from 'path';

import each from 'mocha-each';
import { expect } from 'chai';

import builtins from '../builtins';
import { ExpressionObject } from '../utils/allOk';


console.log('Start of test');



interface FileObj {
  expression: string;
  defaultExport: Function;
  section: string;
  name: string;
}

interface SectionMap {
  [key: string]: Array<FileObj>;
}



const sections = ['localization', 'incomplete'];

for (let year = 2015; year <= 2017; year++) {
  sections.push('es' + year);
}

const tsPaths = sections.map(
  (section) => resolve('builtins', section, '**/*.ts').replace(/\\+/g, '/')
);



const setup = async (): Promise<[string, Array<FileObj>][]> => {
  const paths = await globby(tsPaths);

  const files = await Promise.all(
    paths
      .map(async (path: string) => {
        const { expression, default: defaultExport } = await import(path);

        return {
          expression,
          defaultExport,
          section: path.match(/builtins\/([^\/]+)/)[1],
          name: basename(path, '.ts')
        };
      })
  );

  const sectionsMap = files
    .reduce((obj: SectionMap, file: FileObj) => {
      if (file.expression) {
        if (!obj[file.section]) { obj[file.section] = []; }
        obj[file.section].push(file);
      }

      return obj;
    }, {});

  return Object.entries(sectionsMap)
    .map(([section, files]) => [section, files as Array<FileObj>]);
};

const testsuite = (testSections: ([string, Array<FileObj>])[]) => {
  describe('BUILTINS', () => {
    const builtinsObj: ExpressionObject = builtins();

    each(testSections)
      .describe('%s', (section: string, files: Array<FileObj>) => {
        const sectionObj: ExpressionObject = require(resolve('builtins', section)).default();

        each(files.map((file: FileObj) => [file.name, file]))
          .describe('%s', (name: string, { defaultExport, expression }) => {
            describe('Default export', () => {
              it('Should export function', () => {
                expect(defaultExport).to.be.a('function');
              });

              it('Function should return boolean when called', () => {
                expect(defaultExport()).to.be.a('boolean');
              });
            });

            it('Should test the functionality given in the name', () => {
              let entity = name;

              if (name.indexOf('prototype') > -1) {
                entity = '.' + name.split('.')[2];
              }

              expect(expression).to.include(entity);
            });

            it('Should exist in the sections index file', () => {
              expect(sectionObj).to.have.property(name);
            });

            it('Should exist in the "builtins" index file', () => {
              expect(builtinsObj).to.have.property(name);
            });
          });
      });
  });
};


console.log('before before');


before(async () => {
  const testSections = await setup();
  testsuite(testSections);
});
