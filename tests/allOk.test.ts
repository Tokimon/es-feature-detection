import { expect } from 'chai';

import allOk from '../utils/allOk';



describe('UTILS/allOk', () => {
  it('Returns true when all properties are TRUE', () => {
    const obj = {
      a: true,
      b: true
    };

    expect(allOk(obj)).to.deep.equal(true);
  });

  it('Returns Array of failing property names, when any property fails', () => {
    const obj = {
      a: false,
      b: true,
      c: false,
      d: true
    };

    expect(allOk(obj)).to.deep.equal(['a', 'c']);
  });
});
