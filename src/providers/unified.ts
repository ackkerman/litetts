/*
 * Unified Text-to-Speech provider abstraction layer
 * --------------------------------------------------
 * This file defines:
 *   1. Generic data-structures (VoiceInfo, SynthesisOptions, …)
 *   2. Provider interface / abstract base class
 *   3. Concrete provider stubs for major commercial services
 *
 * Tech-stack assumptions
 * ---------------------
 * • TypeScript ("module": "NodeNext")
 * • pnpm workspace – dependencies declared in each provider’s package.json or a shared one.
 * • Runtime HTTP client: fetch() (global in modern Node) or cross-fetch polyfill.
 * • CommonJS interop for SDKs (AWS SDK v3, @google-cloud/text-to-speech, etc.)
 *
 * NOTE: 依存SDKの import はコメントアウトしている箇所もある。実装を進める際は pnpm add してコメントアウトを外してな。
 */

// ---------------------------------------------------------------------------
// Generic types
// ---------------------------------------------------------------------------

export type Gender = "Male" | "Female" | "Neutral" | "Unknown";

export interface VoiceInfo {
  /** Provider-unique voice identifier (e.g. "Joanna") */
  id: string;
  /** Human-readable display name */
  displayName: string;
  /** BCP-47 language tag (e.g. "en-US", "ja-JP") */
  languageTag: string;
  /** Speaker gender (if provided by the engine) */
  gender?: Gender;
  /** Additional provider-specific metadata */
  meta?: Record<string, unknown>;
}

export interface SynthesisOptions {
  /** Speaking rate multiplier (1 = default) */
  rate?: number;
  /** Pitch adjustment in semitones or percent depending on provider (0 = default) */
  pitch?: number;
  /** Emotion / style keyword – provider dependent (e.g. "cheerful", "angry") */
  emotion?: string;
  /** Desired output audio format (e.g. "mp3", "wav", provider-native ids allowed) */
  format?: string;
  /** Provider-specific raw options bucket */
  providerExtra?: Record<string, unknown>;
}

export interface SynthesisRequest {
  text: string;
  voiceId?: string; // Use provider default when omitted
  language?: string; // BCP-47
  options?: SynthesisOptions;
}

export interface SynthesisResponse {
  audioUrl: string; // Pre-signed URL / temp URL – caller may fetch binary
}

// ---------------------------------------------------------------------------
// Provider interface & abstract base class
// ---------------------------------------------------------------------------

export interface ITTSProvider {
  /** Machine-readable provider key (e.g. "polly") */
  readonly name: string;

  /** Return human-readable provider label */
  readonly displayName: string;

  /** Health-check – returns "ok" or throws on failure */
  health(): Promise<string>;

  /** List voices this provider offers */
  listVoices(): Promise<VoiceInfo[]>;

  /** Perform synthesis and return a URL pointing to generated audio */
  synthesize(req: SynthesisRequest): Promise<SynthesisResponse>;
}

/**
 * Abstract base class that offers simple helpers. Concrete subclasses must
 * implement the abstract methods.
 */
export abstract class BaseTTSProvider implements ITTSProvider {
  abstract readonly name: string;
  abstract readonly displayName: string;

  async health(): Promise<string> {
    // naive default – override for provider-specific ping
    return "ok";
  }

  abstract listVoices(): Promise<VoiceInfo[]>;
  abstract synthesize(req: SynthesisRequest): Promise<SynthesisResponse>;
}

// ---------------------------------------------------------------------------
// Provider registry (utility for /v1/providers endpoint)
// ---------------------------------------------------------------------------

export class ProviderRegistry {
  private static _providers: Map<string, ITTSProvider> = new Map();

  static register(provider: ITTSProvider) {
    ProviderRegistry._providers.set(provider.name, provider);
  }

  static get(name: string): ITTSProvider | undefined {
    return ProviderRegistry._providers.get(name);
  }

  static list(): string[] {
    return [...ProviderRegistry._providers.keys()];
  }
}

// ---------------------------------------------------------------------------
// Concrete provider implementations (stubs)
// ---------------------------------------------------------------------------

// ### 1. Amazon Polly #########################################################

/**
 * Configuration interface for Amazon Polly
 */
export interface AmazonPollyConfig {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  // optional session token, etc.
}

export class AmazonPollyProvider extends BaseTTSProvider {
  readonly name = "polly";
  readonly displayName = "Amazon Polly";

  private readonly cfg: AmazonPollyConfig;
  // private readonly client: PollyClient; // @aws-sdk/client-polly

  constructor(cfg: AmazonPollyConfig) {
    super();
    this.cfg = cfg;
    // this.client = new PollyClient({
    //   region: cfg.region,
    //   credentials: {
    //     accessKeyId: cfg.accessKeyId,
    //     secretAccessKey: cfg.secretAccessKey,
    //   },
    // });
  }

  async listVoices(): Promise<VoiceInfo[]> {
    // TODO: Uncomment when SDK installed
    // const cmd = new DescribeVoicesCommand({});
    // const res = await this.client.send(cmd);
    // return (res.Voices ?? []).map((v) => ({
    //   id: v.Id!,
    //   displayName: v.Name ?? v.Id!,
    //   languageTag: v.LanguageCode!,
    //   gender: v.Gender as Gender,
    //   meta: v,
    // }));

    // Placeholder – compile-time fallback
    return [];
  }

  async synthesize(req: SynthesisRequest): Promise<SynthesisResponse> {
    // const cmd = new SynthesizeSpeechCommand({
    //   Text: req.text,
    //   VoiceId: req.voiceId ?? "Joanna",
    //   OutputFormat: req.options?.format ?? "mp3",
    //   Engine: req.options?.providerExtra?.engine as "standard" | "neural" | undefined,
    //   LanguageCode: req.language,
    //   SampleRate: req.options?.providerExtra?.sampleRate,
    //   TextType: req.options?.providerExtra?.ssml ? "ssml" : "text",
    // });
    // const { AudioStream } = await this.client.send(cmd);
    // const url = await uploadTemp(AudioStream, req.options?.format ?? "mp3");
    // return { audioUrl: url };

    throw new Error("AmazonPolly synthesize not yet implemented");
  }
}

// ### 2. Google Cloud TTS #####################################################

export interface GoogleTTSConfig {
  /** Path to service account JSON key or credentials object */
  credentials: Record<string, unknown>;
}

export class GoogleTTSProvider extends BaseTTSProvider {
  readonly name = "google";
  readonly displayName = "Google Cloud Text-to-Speech";

  private readonly cfg: GoogleTTSConfig;
  // private readonly client: TextToSpeechClient; // @google-cloud/text-to-speech

  constructor(cfg: GoogleTTSConfig) {
    super();
    this.cfg = cfg;
    // this.client = new TextToSpeechClient(cfg);
  }

  async listVoices(): Promise<VoiceInfo[]> {
    // const [res] = await this.client.listVoices({});
    // return (res.voices ?? []).flatMap((v) =>
    //   (v.languageCodes ?? []).map((lang) => ({
    //     id: v.name!,
    //     displayName: v.name!,
    //     languageTag: lang,
    //     gender: (v.ssmlGender?.toString() as Gender) ?? "Unknown",
    //     meta: v,
    //   }))
    // );

    return [];
  }

  async synthesize(req: SynthesisRequest): Promise<SynthesisResponse> {
    throw new Error("GoogleTTS synthesize not yet implemented");
  }
}

// ### 3. Azure Speech #########################################################

export interface AzureSpeechConfig {
  region: string;
  subscriptionKey: string;
}

export class AzureSpeechProvider extends BaseTTSProvider {
  readonly name = "azure";
  readonly displayName = "Azure Speech";

  constructor(private readonly cfg: AzureSpeechConfig) {
    super();
  }

  async listVoices(): Promise<VoiceInfo[]> {
    const endpoint = `https://${this.cfg.region}.tts.speech.microsoft.com/cognitiveservices/voices/list`;
    const res = await fetch(endpoint, {
      headers: {
        "Ocp-Apim-Subscription-Key": this.cfg.subscriptionKey,
      },
    });
    if (!res.ok) throw new Error(`Azure listVoices failed: ${res.status}`);
    const voices = (await res.json()) as any[];
    return voices.map((v) => ({
      id: v.ShortName,
      displayName: v.DisplayName,
      languageTag: v.Locale,
      gender: (v.Gender as Gender) ?? "Unknown",
      meta: v,
    }));
  }

  async synthesize(req: SynthesisRequest): Promise<SynthesisResponse> {
    // Minimal SSML generator
    const voiceId = req.voiceId ?? "en-US-JennyNeural";
    const rate = req.options?.rate ? ` rate="${req.options.rate}"` : "";
    const pitch = req.options?.pitch ? ` pitch="${req.options.pitch}%"` : "";
    const ssml = `<?xml version="1.0"?><speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="${req.language ?? "en-US"}"><voice name="${voiceId}"><prosody${rate}${pitch}>${req.text}</prosody></voice></speak>`;

    const res = await fetch(`https://${this.cfg.region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": this.cfg.subscriptionKey,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": req.options?.format ?? "audio-16khz-32kbitrate-mono-mp3",
        "User-Agent": "tts-proxy",
      },
      body: ssml,
    });
    if (!res.ok) throw new Error(`Azure synthesize failed: ${res.status}`);
    const blob = await res.arrayBuffer();
    const url = await uploadTemp(Buffer.from(blob), req.options?.format ?? "mp3");
    return { audioUrl: url };
  }
}

// ### 4. IBM Watson ###########################################################

export interface WatsonConfig {
  apiKey: string;
  serviceUrl: string; // e.g. https://api.au-syd.text-to-speech.watson.cloud.ibm.com
}

export class WatsonProvider extends BaseTTSProvider {
  readonly name = "watson";
  readonly displayName = "IBM Watson TTS";

  constructor(private readonly cfg: WatsonConfig) {
    super();
  }

  async listVoices(): Promise<VoiceInfo[]> {
    const res = await fetch(`${this.cfg.serviceUrl}/v1/voices`, {
      headers: {
        Authorization: `Basic ${Buffer.from("apikey:" + this.cfg.apiKey).toString("base64")}`,
      },
    });
    if (!res.ok) throw new Error("Watson listVoices failed");
    const data = await res.json();
    return (data.voices as any[]).map((v) => ({
      id: v.name,
      displayName: v.name,
      languageTag: v.language,
      gender: (v.gender as Gender) ?? "Unknown",
      meta: v,
    }));
  }

  async synthesize(req: SynthesisRequest): Promise<SynthesisResponse> {
    const body = { text: req.text };
    const params = new URLSearchParams({ voice: req.voiceId ?? "en-US_AllisonV3Voice" });
    const res = await fetch(`${this.cfg.serviceUrl}/v1/synthesize?${params.toString()}`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from("apikey:" + this.cfg.apiKey).toString("base64")}`,
        Accept: `audio/${req.options?.format ?? "mp3"}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Watson synthesize failed");
    const blob = await res.arrayBuffer();
    const url = await uploadTemp(Buffer.from(blob), req.options?.format ?? "mp3");
    return { audioUrl: url };
  }
}

// ### 5. Stub providers for other services ###################################
// These just throw "not implemented" for now. Implement similarly to above.

export class AITalkProvider extends BaseTTSProvider {
  readonly name = "aitalk";
  readonly displayName = "AITalk";
  async listVoices() { return []; }
  async synthesize(_: SynthesisRequest): Promise<SynthesisResponse> {
    throw new Error("AITalk synthesize not implemented");
  }
}

export class VoiceTextProvider extends BaseTTSProvider {
  readonly name = "voicetext";
  readonly displayName = "HOYA VoiceText";
  async listVoices() { return []; }
  async synthesize(_: SynthesisRequest): Promise<SynthesisResponse> {
    throw new Error("VoiceText synthesize not implemented");
  }
}

export class CoeFontProvider extends BaseTTSProvider {
  readonly name = "coefont";
  readonly displayName = "CoeFont";
  async listVoices() { return []; }
  async synthesize(_: SynthesisRequest): Promise<SynthesisResponse> {
    throw new Error("CoeFont synthesize not implemented");
  }
}

export class ElevenLabsProvider extends BaseTTSProvider {
  readonly name = "elevenlabs";
  readonly displayName = "ElevenLabs";
  async listVoices() { return []; }
  async synthesize(_: SynthesisRequest): Promise<SynthesisResponse> {
    throw new Error("ElevenLabs synthesize not implemented");
  }
}

export class MurfProvider extends BaseTTSProvider {
  readonly name = "murf";
  readonly displayName = "Murf AI";
  async listVoices() { return []; }
  async synthesize(_: SynthesisRequest): Promise<SynthesisResponse> {
    throw new Error("Murf synthesize not implemented");
  }
}

// ---------------------------------------------------------------------------
// Helper: temporary object storage (in-memory or S3). Replace with your impl.
// ---------------------------------------------------------------------------

async function uploadTemp(buf: any, ext = "mp3"): Promise<string> {
  // In the PoC we just store in /tmp and return a file URL; production should
  // upload to object storage (e.g. S3, GCS) with signed URL.
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const fname = `tts_${Date.now()}.${ext}`;
  const fpath = path.join("/tmp", fname);
  await fs.writeFile(fpath, buf);
  return `file://${fpath}`;
}

// ---------------------------------------------------------------------------
// Provider registry bootstrap – Call this during application init.
// ---------------------------------------------------------------------------

export function bootstrapProviders() {
  // Example – configure from env vars
  if (process.env.AWS_REGION) {
    ProviderRegistry.register(
      new AmazonPollyProvider({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      }),
    );
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    ProviderRegistry.register(
      new GoogleTTSProvider({
        credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON),
      }),
    );
  }

  if (process.env.AZURE_SPEECH_KEY) {
    ProviderRegistry.register(
      new AzureSpeechProvider({
        region: process.env.AZURE_SPEECH_REGION!,
        subscriptionKey: process.env.AZURE_SPEECH_KEY!,
      }),
    );
  }

  if (process.env.WATSON_TTS_APIKEY) {
    ProviderRegistry.register(
      new WatsonProvider({
        apiKey: process.env.WATSON_TTS_APIKEY,
        serviceUrl: process.env.WATSON_TTS_URL!,
      }),
    );
  }

  // TODO: register remaining providers when their implementations are ready.
}

