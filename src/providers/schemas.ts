/** JSON Schema definitions for requests & responses */
export const schemas = {
  '/healthz': {
    request: { $schema: 'https://json-schema.org/draft/2020-12/schema', type: 'null' },
    response: {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      type: 'object',
      properties: { status: { type: 'string', const: 'ok' } },
      required: ['status'],
      additionalProperties: false
    }
  },
  '/v1/providers': {
    request: { $schema: 'https://json-schema.org/draft/2020-12/schema', type: 'null' },
    response: {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      type: 'object',
      properties: {
        providers: { type: 'array', items: { type: 'string' } }
      },
      required: ['providers'],
      additionalProperties: false
    }
  },
  '/v1/voices': {
    request: {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      type: 'object',
      properties: {
        provider: { type: 'string' }
      },
      required: ['provider'],
      additionalProperties: false
    },
    response: {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      type: 'object',
      properties: {
        voices: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              displayName: { type: 'string' },
              languageTag: { type: 'string' },
              gender: { type: 'string', nullable: true },
              meta: { type: 'object', nullable: true }
            },
            required: ['id', 'displayName', 'languageTag'],
            additionalProperties: false
          }
        }
      },
      required: ['voices'],
      additionalProperties: false
    }
  },
  '/v1/status': {
    request: { $schema: 'https://json-schema.org/draft/2020-12/schema', type: 'null' },
    response: {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      type: 'object',
      additionalProperties: { type: 'string' } // provider name → status
    }
  },
  '/v1/tts': {
    request: {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      type: 'object',
      properties: {
        provider: { type: 'string' },
        text: { type: 'string' },
        language: { type: 'string', nullable: true },
        voiceId: { type: 'string', nullable: true },
        options: {
          type: 'object',
          properties: {
            rate: { type: 'number', nullable: true },
            pitch: { type: 'number', nullable: true },
            emotion: { type: 'string', nullable: true },
            format: { type: 'string', nullable: true },
            providerExtra: { type: 'object', nullable: true }
          },
          additionalProperties: false,
          nullable: true
        }
      },
      required: ['provider', 'text'],
      additionalProperties: false
    },
    response: {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      type: 'object',
      properties: { audioUrl: { type: 'string', format: 'uri' } },
      required: ['audioUrl'],
      additionalProperties: false
    }
  }
} as const;