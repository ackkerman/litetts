import { Provider, Voice, SynthesizeOptions } from './types.js';

const voices: Voice[] = [
  { id: 'voicevox:四国めたん', lang: 'ja-JP', gender: 'female' }
];

export const voicevox: Provider = {
  id: 'voicevox',
  voices: async () => voices,
  tts: async (text: string, opts: SynthesizeOptions) => {
    return `https://example.com/voicevox-${Date.now()}.mp3`;
  },
  status: async () => 'ok'
};
