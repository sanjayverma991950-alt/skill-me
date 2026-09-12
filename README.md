# 🎯 SkillMe — Architecture & Foundation (Week 1 Deliverable)

An enterprise-grade, clean-architecture foundation for **SkillMe**, a full-stack skill-sharing and peer-mentorship platform. Built with strict TypeScript, decoupled client-server monorepo layout, centralized operational error handling, Zod schema contracts, and zero technical debt.

---

## 🏛️ System Architecture Overview

```mermaid
graph TD
    Client["Client: React 18 + Vite + TypeScript + Tailwind CSS"]
    API["API Gateway / Express Server (Node.js + TypeScript)"]
    
    subgraph Frontend Architecture
        Client --> Router["Tab / View Router"]
        Client --> Components["Modular Components (Badge, Modals)"]
        Client --> ErrorBoundary["Global React ErrorBoundary"]
        Client --> ApiClient["Axios HTTP Client + Unified Interceptors"]
    end

    subgraph Backend Architecture (Clean Layered Pattern)
        API --> Middlewares["Security & Logging (Helmet, CORS, RequestLogger)"]
        Middlewares --> Validation["Zod Request Validation (Body, Query, Params)"]
        Validation --> Controllers["Controllers (HTTP Request/Response Mapping)"]
        Controllers --> Services["Services (Core Business Logic & Conflict Checks)"]
        Services --> Repositories["Data Repositories (In-Memory + Prisma Scaffold)"]
        Middlewares --> GlobalErrorHandler["Centralized Error Handler (AppError Hierarchy)"]
    end

    ApiClient -->|REST API / JSON| API
```

---

## ✨ Key Architectural Highlights

### 1. Decoupled Monorepo Architecture
- **`/server`**: Node.js, Express, strict TypeScript, Controller-Service-Repository pattern.
- **`/client`**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Axios.
- **Root Scripts**: Unified workspace management for `dev`, `build`, `test`, and `lint`.

### 2. Centralized Error Handling Hierarchy
Instead of arbitrary error strings or unhandled runtime crashes, SkillMe implements a strict operational error taxonomy:
- `AppError`: Abstract operational base class with HTTP status code and custom error code.
- `ValidationError` (`400 Bad Request`): Raised when input payloads fail Zod schema contracts.
- `UnauthorizedError` (`401 Unauthorized`): For unauthenticated requests.
- `ForbiddenError` (`403 Forbidden`): For unauthorized role actions.
- `NotFoundError` (`404 Not Found`): For missing entities or unmapped endpoints.
- `ConflictError` (`409 Conflict`): For resource duplicates (e.g. duplicate skill titles or existing user emails).

### 3. Standardized API Response Contract
All API endpoints conform to a uniform JSON envelope:
```json
{
  "success": true,
  "message": "Skills retrieved successfully",
  "data": [...],
  "meta": { "total": 3 },
  "timestamp": "2026-09-12T17:30:00.000Z"
}
```
And on error:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      { "field": "title", "message": "Title must be at least 3 characters", "rule": "too_small" }
    ]
  },
  "timestamp": "2026-09-12T17:30:00.000Z"
}
```

### 4. Resilient Frontend Error Boundary
Wrapped around the entire client application to intercept any rendering anomalies gracefully without breaking the user's session or showing a blank page.

### 5. Automated Testing Suite
Automated integration and edge-case testing using **Vitest** and **Supertest** covering:
- Health telemetry and system specs
- Zod schema validation rejections
- Duplicate conflict checks (409)
- 404 handler for undefined routes
- Malformed JSON payload recovery

---

## 📁 Project Structure

```
skill-me/
├── package.json               # Root monorepo workspaces configuration
├── .gitignore                 # Dependency, build & environment ignore rules
├── README.md                  # Complete architectural documentation
│
├── server/                    # Backend API (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── config/            # Validated environment schemas (env.ts)
│   │   ├── errors/            # Operational AppError hierarchy
│   │   ├── middlewares/       # Centralized error handler, Zod validator, request logger
│   │   ├── modules/
│   │   │   ├── health/        # Health check controller & routes
│   │   │   ├── skills/        # Clean architecture (schema, types, repo, service, controller)
│   │   │   └── users/         # User & mentor profile module
│   │   ├── types/             # Standard ApiResponse format contracts
│   │   ├── routes.ts          # Unified /api/v1 router
│   │   ├── app.ts             # Express App Factory
│   │   └── server.ts          # Listener & Graceful Shutdown
│   ├── prisma/
│   │   └── schema.prisma      # SQLite & PostgreSQL relational data models
│   ├── tests/                 # Vitest automated integration test suite
│   ├── tsconfig.json          # NodeNext strict TypeScript configuration
│   └── package.json
│
└── client/                    # Frontend SPA (React 18 + Vite + Tailwind CSS)
    ├── src/
    │   ├── components/
    │   │   ├── common/        # ErrorBoundary, Badge components
    │   │   └── layout/        # Navbar with live health indicator, Footer
    │   ├── pages/             # HomePage, SkillsPage, ArchitecturePage
    │   ├── services/          # Axios client with interceptors
    │   ├── types/             # Frontend TypeScript domain interfaces
    │   ├── App.tsx            # Root shell with tab navigation
    │   └── main.tsx           # React DOM bootstrap
    ├── vite.config.ts         # Vite bundler with reverse proxy
    ├── tailwind.config.js     # Tailwind design system tokens
    └── package.json
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **npm**: v9+

### 1. Install Dependencies
Run in the root directory (or in `client` and `server` individually):
```bash
# In /server
cd server && npm install

# In /client
cd ../client && npm install
```

### 2. Run Automated Tests
```bash
cd server
npm test
```
*Expected Output: All 10 integration and unit tests passing.*

### 3. Start Development Servers
From the root directory or in two separate terminals:

**Terminal 1 (Backend API):**
```bash
cd server
npm run dev
# Server boots on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Vite dev server boots on http://localhost:5173
```

Visit **`http://localhost:5173`** in your browser.

---

## 📡 API Endpoints Matrix

| Method | Endpoint | Description | Validation |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | API Welcome & Endpoint Discovery | None |
| `GET` | `/api/v1/health` | Telemetry, memory, uptime, status | None |
| `GET` | `/api/v1/skills` | List all skills with optional filters | Query schema |
| `GET` | `/api/v1/skills/:id` | Fetch single skill by UUID | UUID param schema |
| `POST` | `/api/v1/skills` | Create new skill entity | Strict Zod body schema |
| `PATCH` | `/api/v1/skills/:id` | Update skill attributes | Partial Zod body schema |
| `DELETE` | `/api/v1/skills/:id` | Delete skill by UUID | UUID param schema |
| `GET` | `/api/v1/users` | List users / mentors | Query schema |
| `POST` | `/api/v1/users` | Register new user profile | Strict Zod body schema |

---

## 🎥 Week 1 Submission & LinkedIn Showcase Guide

When publishing your Week 1 deliverable on LinkedIn or in your project submission portal, use this structured caption template:

> 🚀 **Week 1 Milestone Completed: Architecture & Foundation Phase for "SkillMe"!**
>
> In Week 1 of my Full-Stack Web Development journey, I focused on establishing an enterprise-grade architectural foundation with **zero technical debt** and high maintainability.
>
> 🔑 **Key Accomplishments:**
> - 🏛️ **Layered Monorepo Architecture**: Clean separation between React 18 + Vite frontend and Node.js + Express backend with strict TypeScript.
> - 🛡️ **Centralized Operational Error Handling**: Built custom `AppError` hierarchy (`ValidationError`, `NotFoundError`, `ConflictError`) with predictable JSON error contracts.
> - ⚡ **Schema Contracts with Zod**: Runtime request body, query, and parameter validation with fail-fast environment variables.
> - 🛡️ **Frontend Resilience**: React Error Boundaries to prevent blank-screen crashes.
> - 🧪 **100% Passing Automated Tests**: Vitest + Supertest integration tests validating health checks, schema errors, and duplicate handling.
> - 🗄️ **Database Scaffolding**: Prisma ORM schema ready for Week 2 persistence.
>
> 💻 Tech Stack: TypeScript, React, Express, Vite, Tailwind CSS, Zod, Vitest.
>
> Check out the live demo and repo! 👇
> #FullStack #WebDevelopment #TypeScript #CleanCode #SoftwareEngineering #React #NodeJS #SystemDesign

---

## ⚖️ License
MIT © 2026 SkillMe Engineering Team
