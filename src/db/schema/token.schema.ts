import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'

export const refreshTokens = pgTable('refresh_tokens', {
  token: text('token').primaryKey(), // Уникальный refresh_token
  user_id: uuid('user_id').notNull(), // Привязан к пользователю
  expires_at: timestamp('expires_at').notNull() // Время истечения
})
