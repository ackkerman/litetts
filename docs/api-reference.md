# API Reference

This page documents the HTTP endpoints exposed by the litetts server. Responses shown here reflect the current stub implementation.

## `POST /v1/tts`

Synthesize audio using one of the available providers.

**Request body**

```json
{
  "provider": "openai",
  "text": "hello",
  "language": "en-US",
  "voice": "nova",
  "outputFormat": "mp3"
}
```

**Successful response**

```json
{
  "audioUrl": "https://example.com/openai-12345.mp3"
}
```

## `GET /v1/voices`

List voices offered by a specific provider. Use the `provider` query parameter:

```
GET /v1/voices?provider=openai
```

Response contains an array of voice descriptors.

## `GET /v1/providers`

Returns a JSON object listing all supported provider IDs.

## `GET /v1/status`

Reports the operational status of each provider. Useful for health checks.

## `GET /v1/schema`

Outputs the unified JSON schema used when communicating with providers. This is mostly intended for programmatic clients.
