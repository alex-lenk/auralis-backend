export const playlistSchema = {
  params: {
    type: 'object',
    properties: {
      mode: { type: 'string' },
    },
    required: ['mode'],
  },
  querystring: {
    type: 'object',
    properties: {
      start: { type: 'string', pattern: '^[0-9]+$' },
      deviceId: { type: 'string' },
    },
    required: ['deviceId'],
  },
}
