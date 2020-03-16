import { expect } from 'chai';

import testExpression from '../utils/testExpression';



describe('UTILS/testExpression', () => {
  describe('Expression that returns boolean', () => {
    it('Returns true when expression returns true', () => {
      expect(testExpression('return true')).to.equal(true);
    });

    it('Returns false when expression returns false', () => {
      expect(testExpression('return false')).to.equal(false);
    });
  });

  describe('Evaluated expression', () => {
    it('Returns true when expression does not fail', () => {
      expect(testExpression('var a=1')).to.equal(true);
    });

    it('Returns false when expression fail', () => {
      expect(testExpression('throw "ups"')).to.equal(false);
    });
  });
});
