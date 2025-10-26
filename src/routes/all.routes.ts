import { FastifyInstance } from 'fastify';
import { AuthRoutes } from '../enum/routes';
import { routeRateLimit } from '../config/rateLimit.config';
import { anonymousSchema, } from '../validation/authSchemas';
import { playlistSchema } from '../db/schema/playlist.schema';
import { getPlaylist } from '../controllers/stream.controller';
import { registerAnonymous } from '../controllers/auth.controller';

export async function authRoutes(app: FastifyInstance) {
  app.post(AuthRoutes.REGISTER_ANONYMOUS, {
    schema: anonymousSchema,
    config: {
      rateLimit: routeRateLimit.anonymous
    }
  }, registerAnonymous);
}

export async function streamRoutes(app: FastifyInstance) {
  app.get(AuthRoutes.PLAYLIST, {
    schema: playlistSchema,
    config: {
      rateLimit: { max: 100, timeWindow: '1 minute' },
    },
  }, getPlaylist);
}
