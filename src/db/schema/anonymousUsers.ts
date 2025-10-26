import { mysqlTable, int, varchar, json, datetime } from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm'

export const anonymousUsers = mysqlTable('anonymous_users', {
  id: int('id').autoincrement().primaryKey(),
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .unique()
    .$defaultFn(() => crypto.randomUUID()),
  deviceId: varchar('device_id', { length: 70 }).notNull().unique(),
  fingerprint: varchar('fingerprint', { length: 80 }),
  userData: json('user_data'),
  createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
})
