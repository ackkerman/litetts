export function equal(a: any, b: any): void {
  if (a !== b) throw new Error(`Assertion failed: ${a} !== ${b}`);
}
