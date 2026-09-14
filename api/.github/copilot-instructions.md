# SharkStack Backend — Copilot Instructions

NestJS + Drizzle ORM + PostgreSQL backend for the SharkStack website. Uses pnpm.

## Commands

```bash
pnpm dev              # start with watch mode
pnpm build            # db:generate + nest build → dist/
pnpm start            # run compiled dist/src/main
pnpm lint             # eslint, zero warnings allowed
pnpm lint:fix         # eslint --fix
pnpm format           # prettier check
pnpm format:fix       # prettier write

# Database
pnpm db:generate      # generate Drizzle migration files
pnpm db:migrate       # apply migrations
pnpm db:push          # push schema directly (no migration file)
pnpm db:seed          # seed projects (scripts/projects.seed.ts)
pnpm db:studio        # open Drizzle Studio
```

No test suite exists in this project.

## Architecture

```
src/
  main.ts                  # bootstrap: Helmet, CORS, global prefix "api", ValidationPipe, ResponseInterceptor, HttpExceptionFilter
  app.module.ts            # root module — wires ThrottlerModule (10 req/60 s), ConfigModule (global), all feature modules
  app.controller.ts        # health-check / root routes
  common/                  # shared utilities (not a NestJS module)
  middleware/              # logger middleware (applied to all routes)
  models/                  # Drizzle table schemas (one file per entity)
  modules/                 # feature modules
    database/              # DatabaseService — pg Pool + Drizzle instance
    cloudinary/            # Cloudinary upload provider + service
    leads/                 # public lead capture
    applicants/            # job applicant submissions with résumé upload
    projects/              # project management CRUD
    chatbot/               # AI chatbot (Anthropic/Gemini) with tool use + Google Calendar
```

**DatabaseService** (`modules/database/database.service.ts`) exposes `db` (the Drizzle client). Every service that needs the DB injects `DatabaseService` and calls `this.databaseService.db`.

**Chatbot** (`modules/chatbot/`) supports two switchable LLM providers (`LLM_PROVIDER=anthropic|gemini`). Provider selection is runtime-only; the same `ChatbotService` handles both. Session history is kept **in process memory only** via `SessionMemoryService` — it is never persisted to the DB. TTL defaults to 30 minutes (`SESSION_MEMORY_TTL_MINUTES` env var).

## Key Conventions

### Path aliases
All imports use TypeScript path aliases — never relative paths crossing module boundaries:

| Alias | Maps to |
|---|---|
| `@src/*` | `src/*` |
| `@common/*` | `src/common/*` |
| `@models/*` | `src/models/*` |
| `@modules/*` | `src/modules/*` |
| `@middleware/*` | `src/middleware/*` |

### Schema & IDs
- Table schemas live in `src/models/*.ts` and are imported by services as needed.
- Primary keys use `cuid()` from `@common/cuid` (wraps `@paralleldrive/cuid2`), not auto-increment.
- Drizzle is configured with `casing: "snake_case"` — write TypeScript fields in camelCase; the ORM maps them to snake_case columns automatically.

### Response shape
Every response is wrapped by `ResponseInterceptor` into `{ success: true, ...data }`. Errors go through `HttpExceptionFilter` as `{ success: false, message }`. Services return named payload objects (e.g., `{ lead: newLead }`, `{ leads: [...] }`) so the spread produces clean top-level keys.

### DTOs
- Use `class-validator` decorators for validation.
- Always apply `@Trim()` (and `@Lowercase()` when appropriate) from `@common/transformer` to string fields.
- `ValidationPipe` is configured with `{ transform: true, whitelist: true, forbidNonWhitelisted: true }`.

### Module structure
Each feature module follows the same flat layout: `<name>.module.ts`, `<name>.controller.ts`, `<name>.service.ts`, `<name>.dto.ts`. No subdirectory nesting inside a module.

### File uploads
Résumé/file uploads go through `CloudinaryService.uploadFile(file, folder)` — Multer is configured at the controller level with `multer-storage-cloudinary`.

## Environment Variables

See `.env.example` for the full list. Key groups:

- `DATABASE_URL` — PostgreSQL connection string
- `LLM_PROVIDER` — `anthropic` or `gemini`
- `ANTHROPIC_API_KEY` / `ANTHROPIC_MODEL`, `GEMINI_API_KEY` / `GEMINI_MODEL`
- `SESSION_MEMORY_TTL_MINUTES` — chatbot session TTL (default 30)
- `CLOUDINARY_CLOUD`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `GOOGLE_*` — Google Calendar service-account credentials
- `CORS_ORIGINS` — comma-separated allowed origins
