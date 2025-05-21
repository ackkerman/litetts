export function hello(name: string): string {
  return `Hello, ${name}`;
}

export function main(): void {
  console.log(hello('world'));
}

export { createApp } from './server';
