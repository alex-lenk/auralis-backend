// src/types/fastify.d.ts
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { FastifyInstance } from 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    db: NodePgDatabase;
  }

  interface FastifyRequest {
    user?: {
      user_id: string;
    };
  }
}
