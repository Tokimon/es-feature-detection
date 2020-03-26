import { expect } from 'chai';

import testSuite, { OnFileTestProps } from './helpers/testSuite';



const group = 'builtins';

const onFileTest = ({ name, expression }: OnFileTestProps) => {
  it('Should test the functionality given in the name', () => {
    if (name.includes('prototype')) {
      name = '.' + name.split('.')[2];
    }

    expect(expression).to.include(name);
  });
};

testSuite(group, { onFileTest, sections: ['localization', 'incomplete'] });
