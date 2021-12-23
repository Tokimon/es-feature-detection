export default function testExpression(expression: string): boolean {
  try {
    return (new Function('"use strict";\n' + expression))() !== false; // eslint-disable-line no-new-func
  } catch {
    return false;
  }
}
