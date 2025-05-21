export interface Voice {
  id: string;
  lang: string;
  gender: string;
}

export interface SynthesizeOptions {
  language: string;
  voice: string;
  outputFormat: string;
  options?: any;
}

export interface Provider {
  id: string;
  voices(): Promise<Voice[]>;
  tts(text: string, opts: SynthesizeOptions): Promise<string>;
  status(): Promise<'ok' | 'ng'>;
}
