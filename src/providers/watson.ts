import { Provider, Voice, SynthesizeOptions } from './types.js';

const voices: Voice[] = [
  { id: 'watson:ja-JP_EmiV3Voice', lang: 'ja-JP', gender: 'female' }
];

export const watson: Provider = {
  id: 'watson',
  voices: async () => voices,
  tts: async (text: string, opts: SynthesizeOptions) => {
    return `https://example.com/watson-${Date.now()}.mp3`;
  },
  status: async () => 'ok'
};
