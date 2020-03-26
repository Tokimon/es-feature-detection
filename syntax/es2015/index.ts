import arrowFunction, { entryName as arrowFunctionName } from './arrowFunction';
import binaryLiterals, { entryName as binaryLiteralsName } from './binaryLiterals';
import blockLevelFunctionDeclaration, { entryName as blockLevelFunctionDeclarationName } from './blockLevelFunctionDeclaration';
import _class, { entryName as _className } from './class';
import computedProperty, { entryName as computedPropertyName } from './computedProperty';
import constLet, { entryName as constLetName } from './constLet';
import defaultParameters, { entryName as defaultParametersName } from './defaultParameters';
import destructuring, { entryName as destructuringName } from './destructuring';
import forOf, { entryName as forOfName } from './forOf';
import generatorFunction, { entryName as generatorFunctionName } from './generatorFunction';
import octalLiterals, { entryName as octalLiteralsName } from './octalLiterals';
import restParameters, { entryName as restParametersName } from './restParameters';
import shorthandMethod, { entryName as shorthandMethodName } from './shorthandMethod';
import shorthandProperty, { entryName as shorthandPropertyName } from './shorthandProperty';
import spreadArray, { entryName as spreadArrayName } from './spreadArray';
import spreadFunctionCall, { entryName as spreadFunctionCallName } from './spreadFunctionCall';
import templateStrings, { entryName as templateStringsName } from './templateStrings';

export default () => ({
  [arrowFunctionName]: arrowFunction(),
  [binaryLiteralsName]: binaryLiterals(),
  [blockLevelFunctionDeclarationName]: blockLevelFunctionDeclaration(),
  [_className]: _class(),
  [computedPropertyName]: computedProperty(),
  [constLetName]: constLet() ,
  [defaultParametersName]: defaultParameters(),
  [destructuringName]: destructuring(),
  [forOfName]: forOf(),
  [generatorFunctionName]: generatorFunction(),
  [octalLiteralsName]: octalLiterals(),
  [restParametersName]: restParameters(),
  [shorthandMethodName]: shorthandMethod(),
  [shorthandPropertyName]: shorthandProperty(),
  [spreadArrayName]: spreadArray(),
  [spreadFunctionCallName]: spreadFunctionCall(),
  [templateStringsName]: templateStrings()
});
