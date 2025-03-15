// src/repositories/user.repository.ts
import { FastifyInstance } from 'fastify'
import { eq } from 'drizzle-orm'
import { users } from '../db/schema/user.schema'

export const createUser = async (fastify: FastifyInstance, email: string, password: string, verificationToken: string) => {
  const existingUser = await fastify.db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)

  if (existingUser.length > 0) {
    throw new Error('User with this email already exists')
  }

  const [newUser] = await fastify.db
    .insert(users)
    .values({
      email,
      password,
      verification_token: verificationToken
    })
    .returning()

  return newUser
}

export const verifyUser = async (fastify: FastifyInstance, email: string) => {
  await fastify.db
    .update(users)
    .set({
      is_verified: true,
      verification_token: null
    })
    .where(eq(users.email, email))
}

export const updateUserPassword = async (
  fastify: FastifyInstance,
  userId: string,
  newHashedPassword: string
) => {
  const updatedUsers = await fastify.db
    .update(users)
    .set({ password: newHashedPassword })
    .where(eq(users.user_id, userId))
    .returning();

  if (updatedUsers.length === 0) {
    throw new Error('User not found');
  }

  return updatedUsers[0];
}

export const getUserByEmail = async (fastify: FastifyInstance, email: string) => {
  const user = await fastify.db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)

  return user.length > 0 ? user[0] : null
}
