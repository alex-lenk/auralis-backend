// src/routes/stream.routes.ts

import { FastifyInstance } from 'fastify'
import { getPlaylist } from '../controllers/stream.controller'
import { AuthRoutes } from '../enum/routes'
import { playlistSchema } from '../db/schema/playlist.schema'

export default async function streamRoutes(app: FastifyInstance) {
  app.get(AuthRoutes.PLAYLIST, {
    schema: playlistSchema,
    config: {
      rateLimit: { max: 100, timeWindow: '1 minute' },
    },
  }, getPlaylist)
}
