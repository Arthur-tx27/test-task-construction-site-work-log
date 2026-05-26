# Журнал работ на строительном объекте

Внутренний инструмент для фиксации выполненных работ на строительном объекте. Прораб вносит записи о выполненных работах: дата, вид работ, объём с единицей измерения, исполнитель. Записи можно фильтровать по виду работ и дате, сортировать по дате, добавлять, редактировать и удалять.

---

## Стек и обоснование

| Компонент | Технология | Почему |
|-----------|-----------|--------|
| **Фронтенд** | Next.js 16 (App Router) + React 19 | Современный React с SSR, маршрутизация из коробки |
| **Стили** | Tailwind CSS 4 + shadcn/ui 4 | Утилитарная стилизация + готовые компоненты с доступностью (Base UI) |
| **Стейт-менеджмент** | TanStack Query | Кеширование, автоматическая инвалидация, `useInfiniteQuery` для пагинации |
| **Формы** | react-hook-form + zod | Производительная валидация с типизированными схемами |
| **Бэкенд** | NestJS 11 + TypeScript | Модульная архитектура, DI, декораторы, строгая типизация |
| **БД** | MySQL 8.0 | Надёжная реляционная БД, поддержка транзакций |
| **ORM** | Prisma 7 | Type-safe доступ к БД, миграции, адаптеры (`@prisma/adapter-mariadb`) |
| **Валидация** | class-validator + class-transformer | Декларативная валидация DTO на бэкенде |
| **Контейнеризация** | Docker + Docker Compose | Единая команда для запуска, изолированное окружение |

---

## Быстрый запуск

### Через Docker (рекомендуется)

```bash
# 1. Создать .env из шаблона
cp .env.example .env

# 2. Запустить
docker compose up --build

# Проект будет доступен:
#   Frontend: http://localhost:5173
#   Backend API: http://localhost:3000
#   MySQL: localhost:3306
```

### Docker без .env файла

Можно передать переменные напрямую в команду. **Рекомендуется использовать `.env`** — это самый надёжный способ, работающий на всех ОС.

<details>
<summary>Linux / macOS (Bash / Zsh)</summary>

```bash
MYSQL_ROOT_PASSWORD=rootpassword \
MYSQL_DATABASE=construction_journal \
DATABASE_URL=mysql://root:rootpassword@mysql:3306/construction_journal \
CORS_ORIGIN=http://localhost:5173 \
  docker compose up --build
```

Или экспортом:

```bash
export MYSQL_ROOT_PASSWORD=rootpassword
export MYSQL_DATABASE=construction_journal
export DATABASE_URL=mysql://root:rootpassword@mysql:3306/construction_journal
export CORS_ORIGIN=http://localhost:5173
docker compose up --build
```

</details>

<details>
<summary>Windows (PowerShell)</summary>

```powershell
$env:MYSQL_ROOT_PASSWORD="rootpassword"
$env:MYSQL_DATABASE="construction_journal"
$env:DATABASE_URL="mysql://root:rootpassword@mysql:3306/construction_journal"
$env:CORS_ORIGIN="http://localhost:5173"
docker compose up --build
```

</details>

<details>
<summary>Windows (CMD)</summary>

```cmd
set "MYSQL_ROOT_PASSWORD=rootpassword"
set "MYSQL_DATABASE=construction_journal"
set "DATABASE_URL=mysql://root:rootpassword@mysql:3306/construction_journal"
set "CORS_ORIGIN=http://localhost:5173"
docker compose up --build
```

</details>

### Для разработки

**Бэкенд:**

```bash
cd server
cp .env.example .env
npm install
npx prisma migrate dev  # применить миграции
npx prisma db seed      # заполнить справочник видов работ
npm run start:dev       # http://localhost:3000
```

**Фронтенд:**

```bash
cd client
cp .env.example .env.local
npm install
npm run dev             # http://localhost:5173
```

---

## Основные функции

- **Список записей** — таблица с датой, видом работ, объёмом и исполнителем
- **Фильтрация** — фильтр по дате и по виду работ (серверная фильтрация через `date` и `workTypeId`); активные фильтры отображаются в виде чипсов с кнопкой сброса
- **Сортировка** — ASC/DESC по дате (серверная сортировка через `sortOrder`)
- **Бесконечная прокрутка** — подгрузка данных по мере скролла (IntersectionObserver)
- **Добавление записи** — форма с валидацией всех полей (дата, вид работ, объём, ед. изм., ФИО)
- **Редактирование** — возможность изменить любую запись
- **Удаление** — подтверждение перед удалением
- **Обработка ошибок** — глобальный ExceptionFilter на бэке (Prisma-ошибки → HTTP-ответы, скрытие стека), тосты с русским текстом на фронте
- **Адаптивная вёрстка** — на мобильных устройствах фильтры перестраиваются в вертикальный стек (лейбл + контрол на одной строке с выравниванием по краям); на планшетах пары «лейбл + контрол» переносятся целиком без разрыва
- **Справочник видов работ** — выбор из предзаполненного списка (10 видов)

---

## API

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/work-log?page=1&limit=10&sortOrder=desc&date=2025-05-20&workTypeId=uuid` | Список записей (пагинация, фильтрация) |
| GET | `/work-log/:id` | Одна запись с видом работ |
| POST | `/work-log` | Создать запись |
| PATCH | `/work-log/:id` | Обновить запись |
| DELETE | `/work-log/:id` | Удалить запись (204) |
| GET | `/work-type` | Справочник видов работ |

**Параметры пагинации:**
| Параметр | Тип | По умолчанию | Ограничения |
|----------|-----|-------------|-------------|
| `page` | integer | 1 | ≥ 1 |
| `limit` | integer | 10 | 1–100 |
| `sortOrder` | string | `desc` | `asc` или `desc` |

**Формат ответа:**
```json
{
  "data": [{ "id": "...", "date": "2025-05-20", "volume": 24, "unit": "м³", ... }],
  "total": 42,
  "hasMore": true
}
```
- `hasMore = page * limit < total`

**Валидация полей записи:**
| Поле | Ограничения |
|------|------------|
| date | ISO 8601, не будущее |
| workTypeId | UUID v4, существует в WorkType |
| volume | > 0, ≤ 1 000 000 |
| unit | `м³`, `м²`, `п.м.`, `т`, `шт.`, `л` |
| performerName | 2–100 символов, буквы/пробелы/дефисы/точки |

**Коды ошибок:**
| Статус | Причина |
|--------|---------|
| 400 | Ошибка валидации полей или несуществующий `workTypeId` (P2003) |
| 404 | Запись не найдена (P2025) |
| 500 | Внутренняя ошибка сервера (стек скрыт) |

---

## Инструменты оптимизации

### Бесконечная прокрутка на IntersectionObserver
Вместо scroll-событий (которые браузер генерирует при каждом пикселе скролла) используется `IntersectionObserver`, следящий за попаданием sentinel-элемента `<div ref={...} />` в область видимости. Триггер срабатывает один раз при подгрузке новых данных, а не на каждый скролл.

### Кеширование через TanStack Query
`useInfiniteQuery` кеширует ответы API. Повторный рендер страницы — данные из кеша, запроса к серверу нет. `staleTime: 30s` — данные считаются свежими 30 секунд.

### Автоматическая инвалидация кеша
После мутации (создание/редактирование/удаление) кеш с ключом `['workLogs']` инвалидируется — TanStack Query сам перезапрашивает список при следующем рендере.

### Пагинация на стороне сервера
Prisma: `skip = (page - 1) * limit`, `take = limit`. Сервер возвращает `{ data, total, hasMore }`. Клиент не загружает лишнего.

### Фильтрация и сортировка на стороне сервера
Фильтр по дате (`date`), фильтр по виду работ (`workTypeId`) и сортировка по дате (`sortOrder`) передаются как query-параметры. Prisma строит `where` с фильтрами и `orderBy` для сортировки. Смена фильтра или сортировки меняет `queryKey` TanStack Query — данные перезапрашиваются с первой страницы.

### Standalone-сборка Next.js
`next.config.ts` → `output: 'standalone'`. В Docker копируются только `.next/standalone/` и `.next/static/` — минимальный образ без dev-зависимостей.

### Tailwind CSS purge
Tailwind CSS 4 автоматически удаляет неиспользуемые стили при продакшен-сборке через `@import "tailwindcss"`.

### Защита от N+1 (Prisma)
Все запросы, которым нужен `WorkType`, используют `include: { workType: true }`. Один JOIN-запрос вместо N+1 отдельных запросов.

---

## Структура проекта

```
construction-journal/
├── server/                    # NestJS backend
│   ├── prisma/
│   │   ├── schema.prisma      # Модели БД
│   │   ├── migrations/        # Миграции
│   │   └── seed.ts            # Сидирование WorkType
│   ├── src/
│   │   ├── prisma/            # PrismaService (синглтон)
│   │   ├── work-log/          # Модуль WorkLog (CRUD + пагинация + DTO)
│   │   ├── work-type/         # Модуль WorkType (справочник)
│   │   ├── filters/           # Глобальный ExceptionFilter (Prisma → HTTP)
│   │   ├── validators/        # Кастомные валидаторы (IsNotFutureDate)
│   │   ├── types/             # Типы API-ответов
│   │   └── consts.ts          # Допустимые единицы измерения
│   ├── test/                  # E2E тесты
│   ├── .env.example            # Шаблон переменных для локальной разработки
│   ├── Dockerfile
│   └── package.json
├── client/                    # Next.js frontend
│   ├── src/
│   │   ├── app/               # Страницы, провайдеры, layout
│   │   ├── features/work-log/ # Фича: журнал работ
│   │   │   ├── model/         #   хуки (useWorkLogs, useWorkLogDialogs, useWorkLogMutations, useSentinelObserver)
│   │   │   └── ui/            #   компоненты (WorkLogTable, WorkLogFilters, WorkLogDialog, etc.)
│   │   └── shared/            # Переиспользуемый слой
│   │       ├── api/           #   API-функции (axios)
│   │       ├── types/         #   Типы
│   │       ├── ui/            #   shadcn/ui компоненты
│   │       ├── validators/    #   Zod-схемы
│   │       └── consts.ts      #   Константы
│   ├── Dockerfile
│   ├── .env.example            # Шаблон переменных для локальной разработки
│   └── package.json
├── docker-compose.yml         # mysql + server + client
├── .env.example               # Шаблон переменных для Docker
└── AGENTS.md                  # Инструкция для AI-агента
```

---

## Переменные окружения

| Переменная | Где используется | Назначение |
|-----------|-----------------|------------|
| `MYSQL_ROOT_PASSWORD` | `docker-compose.yml` | Пароль root пользователя MySQL |
| `MYSQL_DATABASE` | `docker-compose.yml` | Имя базы данных |
| `DATABASE_URL` | `server/.env`, `docker-compose.yml` | Строка подключения Prisma к MySQL |
| `CORS_ORIGIN` | `docker-compose.yml`, `server/src/main.ts` | Разрешённый origin для CORS (по умолчанию `http://localhost:5173`) |
| `NEXT_PUBLIC_API_URL` | `client/.env.local`, `client/Dockerfile` | URL бэкенда для запросов с фронта |
| `PORT` | `server/src/main.ts` | Порт сервера (по умолчанию `3000`) |

---

## Тестирование

```bash
# Бэкенд
cd server
npm test          # 16 unit-тестов (WorkLogService + WorkTypeService)
npm run test:e2e  # 14 интеграционных тестов (контроллеры через supertest, БД замокана)

# Фронтенд
cd client
npm test          # 9 unit-тестов (WorkLogTable, TableSkeleton, DeleteConfirmDialog)
```
