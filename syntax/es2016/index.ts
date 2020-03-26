import exponentiationOperator, { entryName as exponentiationOperatorName } from './exponentiationOperator';
import nestedRestDestructuring, { entryName as nestedRestDestructuringName } from './nestedRestDestructuring';
import restParameterDestructuring, { entryName as restParameterDestructuringName } from './restParameterDestructuring';

export default () => ({
  [exponentiationOperatorName]: exponentiationOperator(),
  [nestedRestDestructuringName]: nestedRestDestructuring(),
  [restParameterDestructuringName]: restParameterDestructuring()
});
