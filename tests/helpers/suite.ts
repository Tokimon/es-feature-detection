export interface SyntaxTestFile {
  default: Function;
  expression: string;
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
    it('Exports a function that returns a boolean', () => {
      expect(typeof file.default()).toBe('boolean');
    });

    it('Export the test expression', () => {
      expect(file.expression.length).toBeGreaterThan(3);
    });

    extra && extra(vars);
  });
};
