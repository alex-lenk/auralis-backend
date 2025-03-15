// src/repositories/anonymousUser.repository.ts
import { eq } from 'drizzle-orm'
import { anonymousUsers } from '../db/schema/anonymousUsers'
import db from '../db'

export const getAnonymousUserByFingerprint = async (fingerprint: string) => {
  const result = await db.select()
    .from(anonymousUsers)
    .where(eq(anonymousUsers.fingerprint, fingerprint))
  return result[0] || null
}

export const createAnonymousUser = async (fingerprint: string, userData?: object) => {
  const [user] = await db.insert(anonymousUsers)
    .values({fingerprint, userData})
    .returning()
  return user
}
