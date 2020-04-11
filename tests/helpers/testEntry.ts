import { expect } from 'chai';
import { SuiteVars } from './suite';

export default ({ file }: SuiteVars) => {
  it('The "entryName" should be a string', () => {
    expect(file.entryName).to.be.a('string');
  });
};
