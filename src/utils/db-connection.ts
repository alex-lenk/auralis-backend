// src/utils/db-connection.ts
import { FastifyInstance } from 'fastify'

export async function checkDbConnection(fastify: FastifyInstance): Promise<boolean> {
  try {
    const client = await fastify.pg.connect()
    client.release()
    return true
  } catch (err) {
    fastify.log.error('❌ Database connection lost:', err)
    return false
  }
}
