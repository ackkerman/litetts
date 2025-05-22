declare module 'http' {
  const anything: any;
  export default anything;
}

declare const process: any;

declare const Buffer: any;

declare module 'node:fs/promises' {
  const anything: any;
  export = anything;
}

declare module 'node:path' {
  const anything: any;
  export = anything;
}
