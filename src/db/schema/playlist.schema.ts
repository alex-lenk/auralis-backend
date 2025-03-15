export const playlistSchema = {
  params: {
    type: 'object',
    properties: {
      mode: {type: 'string'}
    },
    required: ['mode']
  },
  querystring: {
    type: 'object',
    properties: {
      hour: {type: 'string', pattern: '^[0-9]+$'},
      fingerprint: {type: 'string'}
    },
    required: ['fingerprint']
  }
}
