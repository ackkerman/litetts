# litetts

![logo](./images/litetts-logo.png)

A lightweight wrapper to unify multiple text-to-speech (TTS) services. It aims to provide a single interface for services such as OpenAI Whisper, tts-1, Google AI Studio, IBM Watson, Amazon Polly, and local Voicevox instances.

This project is managed using **pnpm** and implemented primarily in **TypeScript**.

## API Endpoints

The server exposes a minimal REST API:

- `POST /v1/tts` – generate audio using a specified provider.
- `GET /v1/voices` – list available voices for a provider.
- `GET /v1/providers` – list supported providers.
- `GET /v1/status` – check provider status.

These endpoints return stub data in the current implementation.

## Frontend Example

The `example` directory contains a small React application built with Vite. It
demonstrates how to call the LiteTTS API from the browser. See
`example/README.md` for setup instructions.
