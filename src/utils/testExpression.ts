export default function testExpression(expression: string): boolean {
  try {
    return new Function(`"use strict";\n${expression}`)() !== false;
  } catch {
    return false;
  }
}
