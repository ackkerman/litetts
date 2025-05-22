import { Provider } from './types.js';
import { openai } from './openai.js';
import { google } from './google.js';
import { watson } from './watson.js';
import { voicevox } from './voicevox.js';

export const providers: Record<string, Provider> = {
  openai,
  google,
  watson,
  voicevox
};

export { schemas } from './schemas.js';
