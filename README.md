<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:667eea,100:764ba2&height=200&section=header&text=HireLens&fontSize=80&fontColor=white&fontAlignY=38&desc=AI-Powered%20Job%20Discovery%20%26%20Recruitment&descAlignY=60&descSize=18" />

<br/>

![React](https://img.shields.io/badge/React%20(Vite)-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-764ABC?style=flat-square&logo=redux&logoColor=white)
![Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=flat-square&logo=googlegemini&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

</div>

---

## 🔍 What is HireLens?

HireLens is an **AI-powered job discovery and recruitment platform** that connects candidates with real openings and gives HR teams a smarter way to find talent.

Candidates upload a resume, **Google Gemini** extracts their skills, education, and experience, and the platform automatically searches the web for **matching company career pages**. Candidates then log how their applications went (applied / interview / rejected / etc.) — feedback that's visible to the whole community, so everyone benefits from each other's experience.

On the other side, **HR users** search candidates by skill or role, view AI-generated insights on each profile, and message promising candidates directly (capped at 3 messages per candidate, so no one gets spammed).

> ⚡ Resume → skills in seconds &nbsp;·&nbsp; 🌐 Live job listings via Adzuna + ATS boards &nbsp;·&nbsp; 🔐 Secure JWT auth with role-based access

---

## ✨ What can you do with it?

| Feature | What it does |
|---|---|
| 📄 **Resume Analysis** | Upload a resume — Gemini extracts skills, education & experience automatically |
| 🌐 **Job Discovery** | Auto-searches the web for company career pages matching your profile |
| 💼 **Live Listings** | Pulls real openings from Adzuna, Greenhouse, Lever & Ashby boards |
| 📝 **Community Feedback** | Log outcomes (applied / interview / rejected) — visible to everyone |
| 🔎 **Candidate Search (HR)** | HR users search candidates by skill or role, paginated results |
| 🤖 **AI Insights (HR)** | HR sees AI-generated insights on each candidate's profile |
| ✉️ **Capped Messaging** | HR can message a candidate directly — max 3 messages per candidate |
| 🔐 **Role-Based Auth** | Separate candidate & HR flows secured with JWT access + refresh tokens |

---

## 🛠️ Built With

| Part | Tools Used |
|---|---|
| **Frontend** | React (Vite), TypeScript, Tailwind CSS, Redux Toolkit |
| **Backend** | NestJS, TypeScript |
| **Database** | PostgreSQL + Prisma ORM |
| **Auth** | JWT (access + refresh tokens), role-based access control |
| **AI** | Google Gemini API (resume parsing) |
| **Jobs** | Adzuna API + Greenhouse / Lever / Ashby public boards |
| **Docs** | Swagger (OpenAPI) at `/api/docs` |

---

## 📁 Folder Structure

```
hirelens/
│
├── backend/               # NestJS API
│   ├── prisma/             # schema.prisma, seed.ts, migrations
│   └── src/
│       ├── auth/            # JWT auth, RBAC, guards, strategies
│       ├── users/           # profile + job preferences
│       ├── resume/          # upload, parsing, Gemini analysis
│       ├── ai/               # Gemini client
│       ├── job-discovery/   # web search for career pages
│       ├── feedback/        # community feedback on career links
│       ├── hr/                # candidate search + capped messaging
│       └── prisma/          # PrismaService
│
├── frontend/               # React app
│   └── src/
│       ├── api/              # axios clients per module
│       ├── store/            # Redux Toolkit store + auth slice
│       ├── pages/            # public / candidate / hr pages
│       ├── components/       # shared layout + UI
│       └── routes/           # protected route guard
│
└── docker-compose.yml      # Postgres + backend + frontend
```

---

## ⚙️ How it works, end to end

```
Candidate uploads a resume
        ↓
Gemini extracts skills, education & experience
        ↓
Platform searches the web for matching career pages
        ↓
Candidate applies & logs feedback (applied / interview / rejected)
        ↓
Feedback becomes visible to the whole candidate community
        ↓
HR searches candidates by skill/role, views AI insights, sends up to 3 messages
```

---

## 🚀 Quick Start (Docker)

```bash
cd hirelens
cp backend/.env.example backend/.env
# fill in JWT secrets, GEMINI_API_KEY, and ADZUNA_APP_ID / ADZUNA_API_KEY in backend/.env

docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:4000/api/v1 |
| Swagger Docs | http://localhost:4000/api/docs |
| Postgres | localhost:5432 (user/pass/db: `hirelens`) |

The backend container runs `prisma migrate deploy` automatically on startup. To seed demo accounts (`candidate@hirelens.dev` / `hr@hirelens.dev`, password `Password@123`):

```bash
docker compose exec backend npm run prisma:seed
```

---

## 🧰 Manual Setup (without Docker)

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

---

## 🔑 Environment Variables

### `backend/.env`

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | JWT signing secrets (set to long random strings) |
| `JWT_ACCESS_EXPIRY` / `JWT_REFRESH_EXPIRY` | Token lifetimes (default `15m` / `7d`) |
| `GEMINI_API_KEY` | Google Gemini API key for resume analysis. Without it, analysis returns an empty stub instead of failing |
| `ADZUNA_APP_ID` / `ADZUNA_API_KEY` | Adzuna API credentials for live job listings |
| `CORS_ORIGIN` | Comma-separated list of allowed frontend origins |

---

## 📡 Core API Groups

See Swagger (`/api/docs`) for the full contract.

- `POST /api/v1/auth/candidate/register|login`, `/auth/hr/register|login`, `/auth/refresh`, `/auth/logout`
- `GET|PATCH /api/v1/users/me`, `POST /api/v1/users/me/job-preferences`
- `POST /api/v1/resume/upload`, `GET /api/v1/resume/me`, `GET /api/v1/resume/:id`
- `POST /api/v1/job-discovery/search`, `GET /api/v1/job-discovery/feed`
- `POST /api/v1/feedback`, `GET /api/v1/feedback/mine|career-link/:id` (paginated)
- `GET /api/v1/hr/candidates` (search by `skill`/`role`, paginated), `GET /api/v1/hr/candidates/:id`
- `POST /api/v1/hr/messages` (max 3 per candidate), `GET /api/v1/hr/messages/:candidateId`
- `GET /api/v1/hr/inbox/me` (candidate: view received HR messages)

---

## 🧠 Notes on the AI & Web Search Integrations

- **Resume analysis** calls Gemini (`gemini-1.5-flash` by default) with the extracted resume text and asks for strict JSON back. If `GEMINI_API_KEY` isn't set, or the call fails, the resume is still saved but marked `FAILED` / analysis falls back to empty arrays rather than crashing the request.
- **Job discovery** aggregates listings from Adzuna (API key required) and public ATS board APIs (Greenhouse, Lever, Ashby — no keys needed). The service queries these sources by role name and returns matching live openings.
- **File storage** is local disk (`backend/uploads/resumes`), served statically and referenced by `fileUrl` on the `Resume` model. Swap in S3 by changing `multer.config.ts` to use `multer-s3` and updating `fileUrl` generation — nothing else in the codebase assumes local disk.

---

<div align="center">

If this project helped you or you liked it, drop a ⭐ — it means a lot!

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:667eea,100:764ba2&height=100&section=footer"/>

</div>
