# HireLens

AI-powered job discovery and recruitment platform. Candidates upload a resume, Gemini extracts
skills/education/experience, the platform searches the web for matching company career pages, and
candidates log feedback (applied / interview / rejected / etc.) that's visible to the whole
community. HR users search candidates by skill or role, view AI insights, and message candidates
directly (capped at 3 messages per candidate).

## Stack

| Layer     | Tech                                              |
|-----------|----------------------------------------------------|
| Frontend  | React (Vite) + TypeScript + Tailwind CSS + Redux Toolkit |
| Backend   | NestJS + TypeScript                                |
| Database  | PostgreSQL + Prisma ORM                            |
| Auth      | JWT access + refresh tokens, role-based access control |
| AI        | Google Gemini API (resume parsing)                  |
| Jobs      | Adzuna API + Greenhouse / Lever / Ashby public boards |
| Docs      | Swagger (OpenAPI) at `/api/docs`                     |

## Project structure

```
hirelens/
├── backend/              NestJS API
│   ├── prisma/            schema.prisma, seed.ts, migrations
│   └── src/
│       ├── auth/           JWT auth, RBAC, guards, strategies
│       ├── users/          profile + job preferences
│       ├── resume/         upload, parsing, Gemini analysis
│       ├── ai/             Gemini client
│       ├── job-discovery/  web search for career pages
│       ├── feedback/       community feedback on career links
│       ├── hr/             candidate search + capped messaging
│       └── prisma/         PrismaService
├── frontend/              React app
│   └── src/
│       ├── api/            axios clients per module
│       ├── store/           Redux Toolkit store + auth slice
│       ├── pages/           public / candidate / hr pages
│       ├── components/      shared layout + UI
│       └── routes/          protected route guard
└── docker-compose.yml     Postgres + backend + frontend
```

## Quick start (Docker)

```bash
cd hirelens
cp backend/.env.example backend/.env
# fill in JWT secrets, GEMINI_API_KEY, and ADZUNA_APP_ID / ADZUNA_API_KEY in backend/.env

docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:4000/api/v1
- Swagger docs: http://localhost:4000/api/docs
- Postgres: localhost:5432 (user/pass/db: `hirelens`)

The backend container runs `prisma migrate deploy` automatically on startup. To seed demo
accounts (`candidate@hirelens.dev` / `hr@hirelens.dev`, password `Password@123`), run:

```bash
docker compose exec backend npm run prisma:seed
```

## Manual setup (without Docker)

### 1. Database

```bash
# any local Postgres works — or run just the db service:
docker compose up postgres -d
```

### 2. Backend

```bash
cd backend
cp .env.example .env       # fill in DATABASE_URL, JWT secrets, GEMINI_API_KEY, ADZUNA_*
npm install
npx prisma migrate dev --name init
npm run prisma:seed        # optional demo accounts
npm run start:dev
```
API runs on http://localhost:4000, Swagger on http://localhost:4000/api/docs.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```
App runs on http://localhost:5173 and proxies `/api` to the backend.

## Environment variables

### backend/.env
| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | JWT signing secrets (set to long random strings) |
| `JWT_ACCESS_EXPIRY` / `JWT_REFRESH_EXPIRY` | Token lifetimes (default `15m` / `7d`) |
| `GEMINI_API_KEY` | Google Gemini API key for resume analysis. Without it, analysis returns an empty stub instead of failing. |
| `ADZUNA_APP_ID` / `ADZUNA_API_KEY` | Adzuna API credentials for live job listings. |
| `CORS_ORIGIN` | Comma-separated list of allowed frontend origins |

## Core API groups (see Swagger for full contract)

- `POST /api/v1/auth/candidate/register|login`, `/auth/hr/register|login`, `/auth/refresh`, `/auth/logout`
- `GET|PATCH /api/v1/users/me`, `POST /api/v1/users/me/job-preferences`
- `POST /api/v1/resume/upload`, `GET /api/v1/resume/me`, `GET /api/v1/resume/:id`
- `POST /api/v1/job-discovery/search`, `GET /api/v1/job-discovery/feed`
- `POST /api/v1/feedback`, `GET /api/v1/feedback/mine|career-link/:id|` (paginated)
- `GET /api/v1/hr/candidates` (search by `skill`/`role`, paginated), `GET /api/v1/hr/candidates/:id`
- `POST /api/v1/hr/messages` (max 3 per candidate), `GET /api/v1/hr/messages/:candidateId`
- `GET /api/v1/hr/inbox/me` (candidate: view received HR messages)

## Notes on the "web search" and "AI" integrations

- **Resume analysis** calls Gemini (`gemini-1.5-flash` by default) with the extracted resume text
  and asks for strict JSON back. If `GEMINI_API_KEY` isn't set, or the call fails, the resume is
  still saved but marked `FAILED`/analysis falls back to empty arrays rather than crashing the
  request.
- **Job discovery** aggregates listings from Adzuna (API key required) and public ATS board APIs
  (Greenhouse, Lever, Ashby — no keys needed). The service queries these sources by role name
  and returns matching live openings.
- **File storage** is local disk (`backend/uploads/resumes`), served statically and referenced by
  `fileUrl` on the `Resume` model. Swap in S3 by changing `multer.config.ts` to use
  `multer-s3` and updating `fileUrl` generation — nothing else in the codebase assumes local disk.
