# Журнал работ на строительном объекте

Внутренний инструмент для фиксации выполненных работ на строительном объекте. Прораб вносит записи о выполненных работах: дата, вид работ, объём с единицей измерения, исполнитель. Записи можно сортировать, добавлять, редактировать и удалять.

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

Можно передать переменные напрямую в команду, создавать `.env` необязательно:

```bash
MYSQL_ROOT_PASSWORD=rootpassword \
MYSQL_DATABASE=construction_journal \
DATABASE_URL=mysql://root:rootpassword@mysql:3306/construction_journal \
  docker compose up --build
```

Или экспортировать переменные в shell перед запуском:

```bash
export MYSQL_ROOT_PASSWORD=rootpassword
export MYSQL_DATABASE=construction_journal
export DATABASE_URL=mysql://root:rootpassword@mysql:3306/construction_journal
docker compose up --build
```

### Для разработки

**Бэкенд:**

```bash
cd server
cp .env.example .env    # или создать .env с DATABASE_URL
npm install
npx prisma migrate dev  # применить миграции
npx prisma db seed      # заполнить справочник видов работ
npm run start:dev       # http://localhost:3000
```

**Фронтенд:**

```bash
cd client
cp .env.local.example .env.local   # если нужно, стандартное значение: http://localhost:3000
npm install
npm run dev             # http://localhost:3000
```

---

## Основные функции

- **Список записей** — таблица с датой, видом работ, объёмом и исполнителем
- **Сортировка** — ASC/DESC по дате
- **Бесконечная прокрутка** — подгрузка данных по мере скролла (MutationObserver)
- **Добавление записи** — форма с валидацией всех полей (дата, вид работ, объём, ед. изм., ФИО)
- **Редактирование** — возможность изменить любую запись
- **Удаление** — подтверждение перед удалением
- **Справочник видов работ** — выбор из предзаполненного списка (10 видов)

---

## API

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/work-log?page=1&limit=10&sortOrder=desc` | Список записей (пагинация) |
| GET | `/work-log/:id` | Одна запись с видом работ |
| POST | `/work-log` | Создать запись |
| PATCH | `/work-log/:id` | Обновить запись |
| DELETE | `/work-log/:id` | Удалить запись (204) |
| GET | `/work-type` | Справочник видов работ |

**Пагинация:**
```json
{
  "data": [{ "id": "...", "date": "2025-05-20", "volume": 24, "unit": "м³", ... }],
  "total": 42,
  "hasMore": true
}
```
- `hasMore = page * limit < total`

**Валидация:**
| Поле | Ограничения |
|------|------------|
| date | ISO 8601, не будущее |
| workTypeId | UUID v4, существует в WorkType |
| volume | > 0, ≤ 1 000 000 |
| unit | `м³`, `м²`, `п.м.`, `т`, `шт.`, `л` |
| performerName | 2–100 символов, буквы/пробелы/дефисы/точки |

---

## Инструменты оптимизации

### Бесконечная прокрутка на MutationObserver
Вместо scroll-событий (которые браузер генерирует при каждом пикселе скролла) используется `MutationObserver`, следящий за появлением sentinel-элемента `<div ref={...} />` в DOM. Триггер срабатывает один раз при подгрузке новых данных, а не на каждый скролл.

### Кеширование через TanStack Query
`useInfiniteQuery` кеширует ответы API. Повторный рендер страницы — данные из кеша, запроса к серверу нет. `staleTime: 30s` — данные считаются свежими 30 секунд.

### Автоматическая инвалидация кеша
После мутации (создание/редактирование/удаление) кеш с ключом `['workLogs']` инвалидируется — TanStack Query сам перезапрашивает список при следующем рендере.

### Пагинация на стороне сервера
Prisma: `skip = (page - 1) * limit`, `take = limit`. Сервер возвращает `{ data, total, hasMore }`. Клиент не загружает лишнего.

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
│   │   ├── work-log/          # Модуль WorkLog (CRUD + пагинация)
│   │   ├── work-type/         # Модуль WorkType (справочник)
│   │   ├── types/             # Типы API-ответов
│   │   └── consts.ts          # Допустимые единицы измерения
│   ├── test/                  # E2E тесты
│   ├── Dockerfile
│   └── package.json
├── client/                    # Next.js frontend
│   ├── src/
│   │   ├── app/               # Страницы, провайдеры, layout
│   │   ├── features/work-log/ # Фича: журнал работ
│   │   │   ├── model/         #   хуки (useWorkLogs, useWorkLogMutations, useSentinelObserver)
│   │   │   └── ui/            #   компоненты (WorkLogTable, WorkLogDialog, etc.)
│   │   └── shared/            # Переиспользуемый слой
│   │       ├── api/           #   API-функции (axios)
│   │       ├── types/         #   Типы
│   │       ├── ui/            #   shadcn/ui компоненты
│   │       ├── validators/    #   Zod-схемы
│   │       └── consts.ts      #   Константы
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml         # mysql + server + client
├── .env.example               # Шаблон переменных для Docker
└── AGENTS.md                  # Инструкция для AI-агента
```

---

## Тестирование

```bash
# Бэкенд
cd server
npm test          # 13 unit-тестов (WorkLogService + WorkTypeService)
npm run test:e2e  # 11 E2E-тестов (контроллеры через supertest)

# Фронтенд
cd client
npm test          # 8 unit-тестов (WorkLogTable, TableSkeleton, DeleteConfirmDialog)
```
