import { Provider } from './types';
import { openai } from './openai';
import { google } from './google';
import { watson } from './watson';
import { voicevox } from './voicevox';

export const providers: Record<string, Provider> = {
  openai,
  google,
  watson,
  voicevox
};

export { schemas } from './schemas';
