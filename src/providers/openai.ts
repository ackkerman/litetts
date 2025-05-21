import { Provider, Voice, SynthesizeOptions } from './types';

const voices: Voice[] = [
  { id: 'nova', lang: 'en-US', gender: 'female' },
  { id: 'shiro', lang: 'ja-JP', gender: 'male' }
];

export const openai: Provider = {
  id: 'openai',
  voices: async () => voices,
  tts: async (text: string, opts: SynthesizeOptions) => {
    return `https://example.com/openai-${Date.now()}.mp3`;
  },
  status: async () => 'ok'
};
