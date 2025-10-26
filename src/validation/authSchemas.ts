export const anonymousSchema = {
  body: {
    type: 'object',
    required: ['fingerprint', 'userData'],
    properties: {
      deviceId: { type: 'string', pattern: '^[a-z0-9-]+$' },
      fingerprint: { type: 'string', pattern: '^[a-f0-9]{64}$' },
      userData: { type: 'object' }
    }
  }
}
