import { SuiteVars } from './suite';

export default ({ name, file }: SuiteVars) => {
  it('The expression tests the functionality given in the name', () => {
    let func = name;
    if (name.includes('prototype')) {
      func = '.' + func.split('.')[2];
    }

    expect(file.expression).toContain(func);
  });
};
