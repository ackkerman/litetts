import { Provider, Voice, SynthesizeOptions } from './types.js';

const voices: Voice[] = [
  { id: 'en-US-Wavenet-D', lang: 'en-US', gender: 'male' }
];

export const google: Provider = {
  id: 'google',
  voices: async () => voices,
  tts: async (text: string, opts: SynthesizeOptions) => {
    return `https://example.com/google-${Date.now()}.mp3`;
  },
  status: async () => 'ok'
};
