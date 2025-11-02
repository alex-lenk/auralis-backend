import fp from 'fastify-plugin'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { config } from '../config'

export default fp(async (fastify) => {
  const pool = new Pool({
    connectionString: `postgres://${config.DB_USER}:${config.DB_PASSWORD}@${config.DB_HOST}/${config.DB_NAME}`,
  })

  const db = drizzle(pool)

  fastify.decorate('db', db)

  fastify.addHook('onClose', async () => {
    await pool.end()
  })

  fastify.log.info('✅ Drizzle ORM connected')
})
