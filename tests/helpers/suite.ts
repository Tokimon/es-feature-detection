import { expect } from 'chai';

export interface SyntaxTestFile {
  default: Function;
  expression: string;
  entryName?: string;
}

export interface SuiteVars {
  section: string;
  name: string;
  file: SyntaxTestFile;
  extra: Function;
}

export default (vars: SuiteVars) => {
  const { section, name, file, extra } = vars;

  describe(`${section.toUpperCase()}/${name}`, () => {
    it('Should export function that returns a boolean', () => {
      expect(file.default()).to.be.a('boolean');
    });

    it('Should export the test expression', () => {
      expect(file.expression).to.be.a('string');
    });

    extra && extra(vars);
  });
};
