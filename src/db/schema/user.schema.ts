import { integer, uuid, pgEnum, pgTable, serial, text, boolean, timestamp } from 'drizzle-orm/pg-core'

export const userRoles = pgEnum('user_role', ['user', 'moderator', 'admin'])

export const users = pgTable('users', {
  id: serial('id').primaryKey(), // Автоинкрементное целое число — основной ключ таблицы.
  user_id: uuid('user_id').defaultRandom().unique().notNull(), // Уникальный идентификатор пользователя (UUID), генерируется автоматически, обязателен.
  email: text('email').unique().notNull(), // Email-адрес пользователя, уникальный, обязателен. Используется как логин.
  password: text('password').notNull(), // Хэшированный пароль пользователя, обязателен.
  name: text('name'), // Имя пользователя, не обязательное поле.
  phone_number: text('phone_number').unique(), // Уникальный номер телефона пользователя, необязательный.
  avatar_url: text('avatar_url'), // URL-адрес аватара пользователя, необязательный.
  device_fingerprint: text('device_fingerprint'), // Отпечаток устройства для дополнительной безопасности, необязательный.
  role: userRoles('role').default('user').notNull(), // Роль пользователя (например, 'user', 'admin'), значение по умолчанию — 'user', обязателен.
  failed_login_attempts: integer('failed_login_attempts').default(0).notNull(), // Количество неудачных попыток входа, по умолчанию 0, обязателен.
  mfa_enabled: boolean('mfa_enabled').default(false), // Флаг включения многофакторной аутентификации, по умолчанию false, необязательный.
  is_verified: boolean('is_verified').default(false), // Статус подтверждения аккаунта, по умолчанию не подтвержден (false).
  verification_token: text('verification_token'), // Токен для подтверждения email при регистрации, необязательный.
  last_login_at: timestamp('last_login_at'), // Дата и время последнего входа пользователя, необязательный.
  password_changed_at: timestamp('password_changed_at'), // Дата и время последнего изменения пароля, необязательный.
  created_at: timestamp('created_at').defaultNow().notNull(), // Дата и время создания записи, значение по умолчанию — текущее время, обязателен.
  updated_at: timestamp('updated_at').defaultNow().notNull(), // Дата и время последнего обновления записи, значение по умолчанию — текущее время, обязателен.
});
