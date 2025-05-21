import { createApp } from './server';

/* ------------------------------------------------------------------ */
/* CLI runner                                                         */
/* ------------------------------------------------------------------ */
// 使い方:
//   MODE=cli   npx tsx src/index.ts     -> "Hello, world"
//   MODE=serve npx tsx src/index.ts     -> API サーバ起動 (デフォルト)
//   PORT=4000  MODE=serve npx tsx src/index.ts
//---------------------------------------------------------------------

const mode = process.env.MODE ?? 'serve';          // 'cli' or 'serve'
const port = Number(process.env.PORT ?? 3000);     // server port

createApp().listen(port, () =>
  console.log(`🚀  TTS API server listening on http://localhost:${port}`)
);
