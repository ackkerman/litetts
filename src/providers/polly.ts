import { Provider, Voice, SynthesizeOptions } from './types.js';

/**
 * Base class for Amazon Polly providers.
 * Concrete implementations should override the voice list and
 * speech synthesis logic.
 */
export abstract class PollyBase implements Provider {
  readonly id = 'polly';

  abstract voices(): Promise<Voice[]>;

  abstract tts(text: string, opts: SynthesizeOptions): Promise<string>;

  async status(): Promise<'ok' | 'ng'> {
    return 'ok';
  }
}

/**
 * Simple placeholder implementation of the Amazon Polly provider.
 * This returns example URLs instead of calling the real API.
 */
export class PollyProvider extends PollyBase {
  private voicesList: Voice[] = [
    { id: 'Joanna', lang: 'en-US', gender: 'female' }
  ];

  async voices(): Promise<Voice[]> {
    return this.voicesList;
  }

  async tts(text: string, opts: SynthesizeOptions): Promise<string> {
    // In a real implementation, this would call Amazon Polly's API
    return `https://example.com/polly-${Date.now()}.mp3`;
  }
}

export const polly: Provider = new PollyProvider();
