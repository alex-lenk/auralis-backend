import { pgTable, text, uuid, serial, jsonb, timestamp } from 'drizzle-orm/pg-core'

export const anonymousUsers = pgTable('anonymous_users', {
  id: serial('id').primaryKey(),
  user_id: uuid('user_id').defaultRandom().unique().notNull(),
  fingerprint: text('fingerprint').unique().notNull(),
  userData: jsonb('user_data'),
  createdAt: timestamp('created_at').defaultNow(),
})
