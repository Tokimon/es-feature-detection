import { resolve } from 'path';
import each from 'mocha-each';
import { expect } from 'chai';

import setup, { FileObj } from './setup';

// import builtins from '../../builtins';
import { ExpressionObject } from '../../utils/allOk';



export interface OnFileTestProps {
  name: string;
  defaultExport: string;
  expression: string;
  entryName?: string;
  sectionObj: ExpressionObject;
  groupObj: ExpressionObject;
}

export interface SetupArgs {
  onFileTest?: (arg0: OnFileTestProps) => void;
  onSectionTest?: Function;
  sections?: string[];
}

export default (group: string, options?: SetupArgs) => {
  group = group.toLowerCase();
  const groupObj: ExpressionObject = require(resolve(group)).default();

  const { sections, onFileTest, onSectionTest } = options || {};

  const testsuite = (testSections: (string | Array<FileObj> | ExpressionObject)[][]) => {
    describe(group.toUpperCase(), () => {

      each(testSections)
        .describe('%s', (section: string, files: Array<FileObj>, sectionObj: ExpressionObject) => {
          each(files.map((file: FileObj) => [file.name, file]))
            .describe('%s', (name: string, { defaultExport, expression, entryName }) => {
              entryName = entryName || name;

              describe('Default export', () => {
                it('Should export function', () => {
                  expect(defaultExport).to.be.a('function');
                });

                it('Function should return boolean when called', () => {
                  expect(defaultExport()).to.be.a('boolean');
                });
              });

              describe(`Entry name ("${entryName}")`, () => {
                it(`Should exist in the index file of section: "${section}"`, () => {
                  expect(sectionObj).to.have.property(entryName);
                });

                it(`Should exist in the index file of group: "${group}"`, () => {
                  expect(groupObj).to.have.property(entryName);
                });
              });

              onFileTest && onFileTest({ name, defaultExport, expression, sectionObj, groupObj });
            });

          onSectionTest && onSectionTest({ section, files });
        });
    });
  };

  before(async () => {
    const testSections = await setup(group, sections);
    testsuite(testSections);
  });
};
