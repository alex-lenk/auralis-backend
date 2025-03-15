# MicroSpark
### Структура проекта

```
 fastify-backend
 │── audio/
 │── src/
 │   ├── config/
 │   ├── controllers/      # Контроллеры
 │   │   ├── auth.controller.ts
 │   ├── db/
 │   │   ├── schema/
 │   ├── enum/
 │   ├── errors/
 │   ├── handlers/
 │   ├── middlewares/
 │   ├── plugins/          # Fastify плагины (база данных, кеш, CORS, JWT, валидация)
 │   ├── repositories/     # Работа с БД
 │   │   ├── user.repository.ts
 │   ├── routes/           # Роуты Fastify
 │   │   ├── auth.routes.ts
 │   ├── services/         # Бизнес-логика
 │   │   ├── auth.service.ts
 │   ├── types/
 │   ├── utils/            # Утилиты и хелперы
 │   ├── validation/
 │   ├── app.ts            # Точка входа в приложение
 │   ├── config.ts         # Конфигурация приложения
 │   ├── logger.ts
 │── .env
 │── drizzle.config.ts
 │── package.json
 │── tsconfig.json
```

#### Распространённый принцип разделения ответственности (separation of concerns).
Каждая папка (routes, controllers, services, repositories, plugins) выполняет свою роль и помогает:

1. routes: здесь живут функции, которые описывают конечные точки (endpoints) вашего приложения и «привязывают» их к определённому URL (например, POST /api/v1/auth/register), а также указывают, какие контроллеры нужно вызывать.
2. controllers: контроллеры принимают запрос (req) и ответ (reply) — то есть уже работают с объектами Fastify. Они разбирают данные из запроса, вызывают нужный сервис, а затем готовят и отправляют ответ клиенту.
3. services: в сервисах находится бизнес-логика — логика в терминах задач приложения (например, регистрация пользователя, отправка писем, расчёты и т.д.). Контроллеры почти не должны «знать» о деталях этой логики — они просто вызывают сервис, передают параметры и получают результат.
4. repositories: здесь хранится код, который работает напрямую с базой данных (или другим источником данных). Репозиторий «знает» про конкретные SQL-запросы, таблицы, ORM и т.п.
5. plugins: Все подключения (например, база данных, кеш) удобно хранить в одном месте. Согласованность — В Fastify принято оборачивать зависимости в плагины, чтобы они автоматически подхватывались в контексте приложения.


#### Чтобы составить JWT_SECRET, надо запустить:
```
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Открой pgAdmin 4.
Подключись к базе данных:

    В левой панели открой Servers → PostgreSQL → Databases.
    Выбери свою базу данных (например, mydatabase).

#### Открой Query Tool:

    В верхнем меню выбери Tools → Query Tool.

#### Вставь SQL-запрос:

```
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_id UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    phone_number VARCHAR(20) UNIQUE,
    avatar_url VARCHAR(255),
    device_fingerprint VARCHAR(255),
    role user_role NOT NULL DEFAULT 'user',
    failed_login_attempts SMALLINT NOT NULL DEFAULT 0,
    mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    last_login_at TIMESTAMP,
    password_changed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


CREATE TABLE refresh_tokens (
    token TEXT PRIMARY KEY,
    user_id UUID NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


 token TEXT PRIMARY KEY → Refresh-токен – это уникальная строка, которая не повторяется.
✅ user_id UUID NOT NULL → Связываем refresh_token с пользователем.
✅ expires_at TIMESTAMP NOT NULL → Храним время истечения токена.
✅ created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL → Логируем время выдачи.
✅ FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE → Если пользователь удаляется, удаляются все его токены.


CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
```

Нажми "Execute" (или F5).
