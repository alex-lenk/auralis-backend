import { pgTable, uuid, serial, jsonb, timestamp, varchar } from 'drizzle-orm/pg-core'

export const anonymousUsers = pgTable('anonymous_users', {
  id: serial('id').primaryKey(),
  user_id: uuid('user_id').defaultRandom().unique().notNull(),
  deviceId: varchar('device_id', { length: 70 }).unique().notNull(),
  fingerprint: varchar('fingerprint', { length: 80 }),
  userData: jsonb('user_data'),
  createdAt: timestamp('created_at').defaultNow(),
})
