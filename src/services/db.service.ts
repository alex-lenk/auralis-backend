// src/services/db.service.ts
import { FastifyInstance } from 'fastify'
import { checkDbConnection } from '../utils/db-connection'

export async function ensureDbConnection(fastify: FastifyInstance) {
  const isConnected = await checkDbConnection(fastify)
  if (!isConnected) {
    throw new Error('Database connection lost. Please try again later.')
  }
}
