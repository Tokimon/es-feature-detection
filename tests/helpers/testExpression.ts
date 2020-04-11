import { expect } from 'chai';
import { SuiteVars } from './suite';

export default ({ name, file }: SuiteVars) => {
  it('The expression should test the functionality given in the name', () => {
    let func = name;
    if (name.includes('prototype')) {
      func = '.' + func.split('.')[2];
    }

    expect(file.expression).to.include(func);
  });
};
