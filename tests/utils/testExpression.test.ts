import testExpression from '~/utils/testExpression';



describe('UTILS/testExpression', () => {
  describe('Expression that returns boolean', () => {
    it('Returns true when expression returns true', () => {
      expect(testExpression('return true')).toBe(true);
    });

    it('Returns false when expression returns false', () => {
      expect(testExpression('return false')).toBe(false);
    });
  });

  describe('Evaluated expression', () => {
    it('Returns true when expression does not fail', () => {
      expect(testExpression('var a=1')).toBe(true);
    });

    it('Returns false when expression fail', () => {
      expect(testExpression('throw "ups"')).toBe(false);
    });
  });
});
