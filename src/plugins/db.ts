// src/plugins/db.ts
import fp from 'fastify-plugin'
import fastifyPostgres from '@fastify/postgres'
import { config } from '../config'

export default fp(async (fastify) => {
  try {
    await fastify.register(fastifyPostgres, {
      connectionString: `postgres://${config.DB_USER}:${config.DB_PASSWORD}@${config.DB_HOST}/${config.DB_NAME}`,
    })
    fastify.log.info('✅ Database connected')
  } catch (err) {
    fastify.log.error('❌ Failed to connect to the database:', err)
  }
})
