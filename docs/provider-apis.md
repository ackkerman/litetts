# Third-Party TTS Provider API Reference

This document summarises how to list available voices and request speech synthesis for various commercial text-to-speech services. The details are based on official documentation for each provider.

## Amazon Polly

| Item | Details |
| ---- | ------- |
| **Voice list** | Available via `DescribeVoices`. `GET /v1/voices` can filter by language code or engine type. Requires AWS credentials (`polly:DescribeVoices`). Response JSON contains `Voices` array with info for each voice. |
| **Voice properties** | `Id` (voice ID like `"Joanna"`), `Name`, `LanguageCode` (e.g. `en-US`), `LanguageName`, `Gender`, `AdditionalLanguageCodes`, `SupportedEngines`. Use the **VoiceId** to synthesise. |
| **Synthesis** | `POST /v1/speech` with JSON body. Required: `Text`, `VoiceId`, `OutputFormat` (`mp3`/`ogg_vorbis`/`pcm`/`json`). Optional: `Engine` (`standard`/`neural`), `LanguageCode`, `SampleRate`, `TextType` (`text`/`ssml`). Response is binary audio in the specified format. |
| **Unique options** | Supports provider lexicons for custom pronunciation and an asynchronous `StartSpeechSynthesisTask` API for long-form text. |

## Google Cloud Text-to-Speech

| Item | Details |
| ---- | ------- |
| **Voice list** | `GET /v1/voices` with authentication. Optional `languageCode` filter. Returns JSON `voices` array. |
| **Voice properties** | `name` (e.g. `"ja-JP-Wavenet-A"`), `language_codes`, `ssml_gender`, `natural_sample_rate_hertz`. Use `voice.name` as the voice ID. |
| **Synthesis** | `POST https://texttospeech.googleapis.com/v1/text:synthesize`. JSON body with `input`, `voice`, and `audioConfig`. `audioConfig` requires `audioEncoding` (`MP3`, `OGG_OPUS`, `LINEAR16`, etc.). Optional `speakingRate`, `pitch`, `volumeGainDb`. Response JSON has `audioContent` containing base64-encoded audio. |
| **Unique options** | Supports `effectsProfileId` for device tuning and global controls like `speakingRate`, `pitch`, and `volumeGainDb`. |

## Microsoft Azure Speech Service

| Item | Details |
| ---- | ------- |
| **Voice list** | `GET https://<region>.tts.speech.microsoft.com/cognitiveservices/voices/list` with subscription key. Returns JSON array with `Name`, `ShortName`, `DisplayName`, `Gender`, `Locale`, `VoiceType`, etc. |
| **Voice properties** | `ShortName` (voice ID), `Gender`, `Locale`, `VoiceType`, `DisplayName`, `StyleList`, `SecondaryLocaleList`. |
| **Synthesis** | `POST https://<region>.tts.speech.microsoft.com/cognitiveservices/v1`. Send SSML with `<voice name="ShortName">` and `<prosody>` tags for rate and pitch. `X-Microsoft-OutputFormat` header specifies output format. Returns binary audio stream. |
| **Unique options** | Rich SSML extensions such as `<mstts:express-as style="cheerful">` and `<prosody>` for rate/pitch plus a long-form batch synthesis API. |

## IBM Watson Text-to-Speech

| Item | Details |
| ---- | ------- |
| **Voice list** | `GET /v1/voices` using Basic auth with API key. Response `voices` array with `name`, `language`, `gender`, etc. |
| **Voice properties** | `name` (voice ID), `language`, `gender`, `description`, `customizable`, `supported_features`. |
| **Synthesis** | `POST /v1/synthesize` with query `voice` specifying the voice ID. Body JSON `{ "text": "..." }` or SSML. `Accept` header controls output format (e.g. `audio/wav`). Response is binary audio. |
| **Unique options** | Offers custom voice models via `customization_id` and a `timings` query for word timing metadata. |

## AITalk (Docomo)

| Item | Details |
| ---- | ------- |
| **Voice list** | No API endpoint. Use documented fixed list (e.g. `nozomi`, `seiji`, `akari`, etc.). |
| **Voice properties** | Each voice ID corresponds to a character (gender/age). Details are given in provider documents. |
| **Synthesis** | `POST https://api.apigw.smt.docomo.ne.jp/aiTalk/v1/textToSpeech?APIKEY=<key>` with SSML. `<voice name="...">` selects the speaker. `<prosody>` can adjust `rate`, `pitch`, `range`. Returns raw PCM audio. |
| **Unique options** | All control is via SSML; the `<prosody>` tag allows a `range` attribute to modify intonation strength. |

## HOYA VoiceText Web API

| Item | Details |
| ---- | ------- |
| **Voice list** | No list endpoint. Voices are specified by fixed names like `show`, `haruka`, `hikari`, `takeru`, `santa`, `bear`. |
| **Voice properties** | `speaker` parameter indicates voice. Some voices support emotions via `emotion` parameter (`happiness`, `anger`, `sadness`). |
| **Synthesis** | `POST https://api.voicetext.jp/v1/tts` using Basic auth. Required `text` and `speaker`. Optional `emotion`, `emotion_level`, `pitch`, `speed`, `volume`, `format` (`wav`, `ogg`, `mp3`). Response is binary audio. |
| **Unique options** | Emotion parameters (`emotion`, `emotion_level`) allow expressive speech; pitch, speed and volume are numeric percent values. |

## CoeFont

| Item | Details |
| ---- | ------- |
| **Voice list** | `GET /v2/coefonts/pro` with HMAC authentication. Returns JSON list with `coefont` (UUID), `name`, `description`, etc. |
| **Voice properties** | `coefont` ID, `name`, `description`, `icon`, `sample`, `tags`. |
| **Synthesis** | `POST https://api.coefont.cloud/v2/text2speech` with JSON containing `coefont` and `text`. Optional `yomi`, `accent`, `speed`, `pitch`, `kuten`, `toten`, `volume`, `format`. Responds with 302 redirect to temporary audio file URL. |
| **Unique options** | Supports phonetic input via `yomi`, accent patterns with `accent`, and pause timing control using `kuten` and `toten`. |

## ElevenLabs

| Item | Details |
| ---- | ------- |
| **Voice list** | `GET /v1/voices` with API key. Returns list of available voices with `voice_id`, `name`, `category`, etc. |
| **Voice properties** | `voice_id`, `name`, `category`, `description`, `labels` such as accent and gender, `preview_url`. |
| **Synthesis** | `POST /v1/text-to-speech/{voice_id}`. Body includes `text` and optional `model_id`, `voice_settings`, `language_code`, `output_format`. Returns audio data directly. |
| **Unique options** | `voice_settings` object supports fields like `stability` and `similarity_boost` to tweak synthesis behaviour. |

## Murf AI

| Item | Details |
| ---- | ------- |
| **Voice list** | `GET /v1/speech/voices` with API key. Response includes `voiceId`, `displayName`, `gender`, `locale`, `supportedLocales`, `availableStyles`. |
| **Voice properties** | `voiceId`, `displayName`, `gender`, `supportedLocales[locale].availableStyles` for supported speaking styles. |
| **Synthesis** | `POST /v1/speech/synthesize` with `text` and `voice_id`. Optional `style`, `format` (`MP3`, `WAV`, `FLAC`, etc.), `channelType`, `sampleRate`, `base64`. Response gives temporary audio URL or base64 audio. |
| **Unique options** | Can return audio as a base64 string (`base64:true`) and choose mono or stereo output with `channelType`. |


