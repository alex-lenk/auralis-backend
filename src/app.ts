import Fastify from 'fastify';
import rateLimit from '@fastify/rate-limit';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';

import { config } from './config';
import { globalRateLimit } from './config/rateLimit.config';
import drizzlePlugin from './plugins/drizzle';
import { authRoutes, streamRoutes } from './routes/all.routes';
import { customErrorHandler } from './handlers/errorHandler';
import { logger } from './logger';

const app = Fastify({ loggerInstance: logger });

app.setErrorHandler(customErrorHandler);

app.register(rateLimit, globalRateLimit);

app.register(cors, {
  origin: [config.frontendUrl],
  methods: ['POST', 'GET', 'PUT'],
});

app.register(sensible);

app.register(drizzlePlugin);

app.register(authRoutes)
app.register(streamRoutes)

const start = async () => {
  try {
    await app.listen({ port: Number(config.backendPort) });
    console.log(`Server running on ${config.backendUrl}:${config.backendPort}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
