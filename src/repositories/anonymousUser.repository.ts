import { eq } from 'drizzle-orm';
import { anonymousUsers } from '../db/schema/anonymousUsers';
import db from '../db';

export const getAnonymousUserByFingerprint = async (deviceId: string) => {
  const result = await db.select()
    .from(anonymousUsers)
    .where(eq(anonymousUsers.deviceId, deviceId));
  return result[0] || null;
};

export const createAnonymousUser = async (
  fingerprint: string,
  deviceId: string,
  userData?: object,
) => {
  const result = await db
    .insert(anonymousUsers)
    .values({
      fingerprint,
      deviceId,
      userId: crypto.randomUUID(),
      userData,
    });

  const insertId =
    (result as any)?.insertId ??
    (Array.isArray(result) && result[0]?.insertId) ??
    null;

  if (!insertId) {
    throw new Error('Failed to retrieve insertId from anonymous_users insert');
  }

  const [user] = await db
    .select()
    .from(anonymousUsers)
    .where(eq(anonymousUsers.id, insertId));

  return user;
};
