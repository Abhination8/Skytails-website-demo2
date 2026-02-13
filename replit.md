# PetWealth (SkyTails) - Pet Financial Platform

## Overview

PetWealth is a pet-focused financial planning platform that helps users save and invest for their pet's health, happiness, and unexpected expenses. The core UX philosophy is **"Fast Signup → Dashboard First → Progressive Profile Completion"** — prioritizing emotional, pet-first onboarding over traditional financial application flows.

The app features a public landing page for acquisition, a lightweight auth flow, a dashboard with financial growth projections and pet cards, and a profile management section with tabs for pets, financials, and identity verification.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript (non-RSC, client-side rendering)
- **Routing**: Wouter (lightweight client-side router) with protected route wrappers
- **State Management**: TanStack React Query for server state; no global client state library
- **Styling**: Tailwind CSS with shadcn/ui component library (new-york style), CSS variables for theming
- **Animations**: Framer Motion for page transitions and emotional micro-interactions
- **Charts**: Recharts for financial growth visualization (AreaChart for projected savings)
- **Forms**: React Hook Form with Zod resolvers for validation
- **Design System**: Soft blue + white palette, large whitespace, rounded corners (1rem radius), Inter (body) + Outfit (display) fonts via CSS custom properties

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript, compiled with tsx (dev) and esbuild (production)
- **API Pattern**: RESTful JSON API under `/api/` prefix with a shared route contract (`shared/routes.ts`) defining paths, methods, input schemas, and response types using Zod
- **Session Management**: Express sessions with MemoryStore (prototype-grade; session stores userId)
- **Build**: Vite for client bundling, esbuild for server bundling; production output goes to `dist/`

### Data Storage
- **Database**: PostgreSQL via `DATABASE_URL` environment variable
- **ORM**: Drizzle ORM with `drizzle-zod` for schema-to-validation integration
- **Schema location**: `shared/schema.ts` — shared between client and server
- **Migration tool**: Drizzle Kit (`db:push` command)
- **Tables**:
  - `users` — email, password (plain text for prototype), name, timestamps
  - `pets` — linked to user, stores name, breed, age (months), weight, image URL, health notes
  - `financial_profiles` — monthly contribution, risk level, goal timeline, KYC status, plan tier, total savings
  - `user_progress` — gamification/engagement tracking (profile completion %, streak days, last login)

### Storage Layer
- `server/storage.ts` implements `IStorage` interface with `DatabaseStorage` class
- All database operations go through this abstraction layer, making it swappable

### Shared Code (`shared/`)
- **`schema.ts`**: Drizzle table definitions and Zod insert schemas — used by both frontend (form validation) and backend (request validation)
- **`routes.ts`**: API contract object defining all endpoints with their HTTP methods, paths, Zod input/output schemas. This acts as a single source of truth for the API shape, used by both client hooks and server route handlers.

### Key API Endpoints
- `POST /api/auth/signup` — Creates user, initializes financial profile and progress, optionally creates first pet
- `POST /api/auth/login` — Session-based login
- `GET /api/auth/me` — Returns current session user
- `GET /api/dashboard` — Aggregated dashboard data (user + pets + financials + progress)
- `POST /api/pets` — Create new pet
- `PUT /api/pets/:id` — Update pet
- `PUT /api/financials` — Update financial profile

### Dev vs Production
- **Dev**: Vite dev server with HMR proxied through Express, uses `@replit/vite-plugin-runtime-error-modal` and cartographer plugins
- **Production**: Client pre-built to `dist/public/`, server bundled to `dist/index.cjs`, served as static files with SPA fallback

## External Dependencies

### Database
- **PostgreSQL** — Required. Must be provisioned and `DATABASE_URL` environment variable set. Used via `pg` (node-postgres) Pool + Drizzle ORM.

### Key NPM Packages
- **drizzle-orm** + **drizzle-kit** + **drizzle-zod**: Database ORM, migrations, and schema-to-Zod conversion
- **express** (v5): HTTP server
- **express-session** + **memorystore**: Session management (prototype-level, not production-ready)
- **@tanstack/react-query**: Async server state management
- **recharts**: Chart visualization
- **framer-motion**: Animation library
- **react-hook-form** + **@hookform/resolvers**: Form handling with Zod validation
- **wouter**: Lightweight client-side routing
- **shadcn/ui** (Radix UI primitives): Full component library including Dialog, Tabs, Cards, Sliders, etc.
- **zod**: Schema validation (shared between client and server)
- **connect-pg-simple**: PostgreSQL session store (available but MemoryStore currently used)
- **lucide-react**: Icon library

### Fonts (External CDN)
- Google Fonts: Inter, Outfit, DM Sans, Fira Code, Geist Mono, Architects Daughter (loaded via `<link>` tags in `index.html` and CSS `@import`)

### No External API Integrations
- This is a prototype — financial data is mocked, no real payment processing, no real KYC verification
- Build script references packages like `stripe`, `openai`, `@google/generative-ai`, `nodemailer` in the allowlist but they are not actively used in the current codebase