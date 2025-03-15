import { FastifyInstance } from 'fastify'
import { eq } from 'drizzle-orm'
import { refreshTokens } from '../db/schema/token.schema'

export const saveRefreshToken = async (fastify: FastifyInstance, userId: string, token: string, expiresAt: number) => {
  await fastify.db.insert(refreshTokens).values({
    user_id: userId,
    token,
    expires_at: new Date(expiresAt * 1000)
  })
}

export const getRefreshToken = async (fastify: FastifyInstance, token: string) => {
  const result = await fastify.db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, token))
    .limit(1)

  return result.length > 0 ? result[0] : null
}

export const deleteRefreshToken = async (fastify: FastifyInstance, token: string): Promise<number> => {
  const result = await fastify.db
    .delete(refreshTokens)
    .where(eq(refreshTokens.token, token))

  return result.rowCount ?? 0
}

export const deleteAllUserRefreshTokens = async (fastify: FastifyInstance, userId: string) => {
  await fastify.db.delete(refreshTokens).where(eq(refreshTokens.user_id, userId))
}
