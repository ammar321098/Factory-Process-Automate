Factory-Process-Automate

# Mohsin Steels

A full-stack manufacturing operations dashboard for **Mohsin Steels**, built to automate and track the steel production workflow—from raw material intake through molding, polishing, and packing—with employee performance and payroll support.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6.18-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)

---

## Overview

Mohsin Steels is a business process automation system tailored for steel manufacturing. It provides a centralized dashboard to monitor inventory, production stages, remaining work-in-progress, and employee output across piece-rate and monthly salary structures.

The application supports **English** and **Urdu** locales and includes performance optimizations such as lazy loading, route prefetching, virtualized tables, and keyboard navigation.

### Production Pipeline

```
Raw Materials → Molding → Polishing → Packing
```

Each stage tracks quantities, damage/waste, remaining inventory, employee assignments, and per-piece earnings.

---

## Features

| Module | Description |
|--------|-------------|
| **Dashboard** | KPI overview—available material weight, remaining molding/polishing/packing quantities |
| **Raw Materials** | Manage materials with sizes, gages, unit weights, suppliers, and stock levels |
| **Molding** | Production entries, product types, product rates, employee performance, remaining molding stock |
| **Polishing** | Polishing entries, rates, remaining items from molding, employee earnings |
| **Packing** | Final packing entries and remaining polished inventory |
| **Employees** | Employee records with piece-rate or monthly salary, department, and production stats |
| **Settings & Profile** | User preferences and profile management |

### Planned / Disabled Modules

The following modules exist in the codebase as stubs or commented navigation items and are not yet active:

- Stock Management
- Sales & Billing
- Expenses
- Customers
- Transactions
- Reports
- Profit & Loss Analytics

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| UI | [React 18](https://react.dev/), [Tailwind CSS 3](https://tailwindcss.com/) |
| Language | TypeScript |
| Database | PostgreSQL via [Prisma ORM](https://www.prisma.io/) |
| i18n | [next-intl](https://next-intl.dev/) (English & Urdu) |
| Charts | Chart.js + react-chartjs-2 |
| Icons | Lucide React |
| Testing | Vitest |

---

## Prerequisites

- **Node.js** 18 or later
- **npm** (or yarn/pnpm)
- **PostgreSQL** database server

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd "Mohsin Steel"
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/mohsin-steels"

# Optional: force demo data without PostgreSQL
# USE_MOCK_DATA=true
```

Replace `USER`, `PASSWORD`, and the database name with your local PostgreSQL credentials.

**No database?** If PostgreSQL is not running or `DATABASE_URL` is missing, the API automatically serves realistic mock data from `lib/mocks/mockHandlers.ts`. You can also set `USE_MOCK_DATA=true` to always use mock data during development. Mock responses include the header `X-Data-Source: mock`.

### 4. Set up the database

```bash
npx prisma generate
npx prisma migrate deploy
```

For development with schema changes:

```bash
npx prisma migrate dev
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app redirects to `/en` or `/ur` based on locale detection.

### 6. Log in (demo credentials)

Authentication currently uses **mock users** stored in `lib/mocks.ts` (not connected to the database):

| Email | Password | Role |
|-------|----------|------|
| `john@company.com` | `admin123` | Admin |

> **Note:** This is a development-only auth flow. Passwords are stored in plain text in mock data. Do not use in production without implementing proper authentication.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run build:optimized` | Run optimized build script |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest tests |
| `npm run analyze` | Build with bundle analysis |

---

## Project Structure

```
Mohsin Steel/
├── app/
│   ├── [locale]/              # Localized pages (en, ur)
│   │   ├── dashboard/         # Main KPI dashboard
│   │   ├── raw-materials/     # Material management
│   │   ├── molding/           # Molding production
│   │   ├── polishing/         # Polishing production
│   │   ├── packing/           # Packing production
│   │   ├── employees/         # Employee management
│   │   ├── login/             # Login page
│   │   ├── profile/           # User profile
│   │   ├── settings/          # App settings
│   │   └── layout.tsx         # Root layout with providers
│   └── api/                   # Next.js API routes (Prisma-backed)
├── components/                # Reusable UI components
├── contexts/                  # React contexts (Auth, AddForm)
├── hooks/                     # Custom React hooks
├── i18n/                      # Internationalization config
├── lib/
│   ├── api/                   # Frontend API client functions
│   ├── db/                    # Prisma client singleton
│   ├── mocks.ts               # Mock data for auth & navigation
│   └── useMockApi.ts          # Mock API hook
├── messages/                  # Translation files (en.json, ur.json)
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── public/                    # Static assets (logo, icons)
├── styles/                    # Additional CSS
├── tests/                     # Vitest unit tests
└── utils/                     # Utility helpers
```

---

## Database Schema

The Prisma schema models the full manufacturing workflow:

| Model | Purpose |
|-------|---------|
| `materials` | Raw material inventory with size, gage, and weight references |
| `sizes`, `gages`, `unit_weights` | Master data for material dimensions and weights |
| `molding_entries` | Molding production records linked to employees and materials |
| `product_types`, `product_rates` | Product catalog and per-employee piece rates |
| `remaining_molding` | Work-in-progress after molding |
| `polishing_entries`, `polishing_rates` | Polishing stage records and rates |
| `remaining_polishing` | Work-in-progress after polishing |
| `packing_entries`, `remaining_packing` | Final packing stage and inventory |
| `employees` | Staff with `PIECE` or `MONTHLY` salary types |

Soft deletes are supported on several tables via `deletedAt` timestamps.

---

## API Endpoints

Core production modules are backed by Next.js API routes under `/api`:

### Dashboard
- `GET /api/dashboard/stats` — Aggregate KPIs

### Raw Materials
- `GET/POST /api/raw-material`
- `GET /api/raw-material/all`, `/stats`
- `GET/PUT/DELETE /api/raw-material/[id]`
- `GET/POST /api/sizes`, `/gages`, `/unit-weight`

### Molding
- `GET/POST /api/molding-entry`, `/product-type`, `/product-rate`
- `GET /api/molding-entry/stats`, `/remaining-moldings`
- `GET/PUT/DELETE` for individual records by `[id]`

### Polishing
- `GET/POST /api/polishing`, `/polishing-rate`
- `GET /api/polishing/stats`, `/remaining-polishing`
- `GET /api/polishing-rate/check`

### Packing
- `GET/POST /api/packing`
- `GET /api/packing/stats`, `/remaining-packing`

### Employees
- `GET/POST /api/employees`
- `GET /api/employees/stats`, `/production-stat`
- `GET /api/employees/molding`, `/polishing` (and per-piece variants)

---

## Internationalization

The app supports two locales:

- **English** (`/en/...`)
- **Urdu** (`/ur/...`)

Translations live in `messages/en.json` and `messages/ur.json`. Locale routing is handled by `next-intl` middleware; users without a locale prefix are redirected based on the `NEXT_LOCALE` cookie or the default (`en`).

---

## Authentication & Authorization

- **Current:** Client-side mock authentication via `AuthContext` and `localStorage`
- **Roles:** Admin has full module access; other roles are filtered by module permissions in `useMockApi`
- **Protected routes:** `ProtectedRoute` component guards authenticated pages

For production deployment, replace mock auth with a secure backend (JWT, session cookies, hashed passwords, etc.). See `lib/README-HANDOFF.md` for integration guidance.

---

## Testing

Run the test suite with:

```bash
npm test
```

Tests cover cost calculation logic in `lib/costs.ts` (`tests/costs.test.ts`).

---

## Performance

The project includes several frontend optimizations:

- Code splitting and vendor chunking (webpack config)
- Lazy-loaded dashboard widgets
- Optimized tables with virtualization support
- Route prefetching and navigation caching
- Service worker (`public/sw.js`) for offline capabilities
- Console removal in production builds

---

## Related Documentation

| File | Description |
|------|-------------|
| `BACKEND_READY.md` | Backend integration checklist and endpoint requirements |
| `lib/README-HANDOFF.md` | Detailed mock-to-API mapping and integration guide |

---

## License

Private project. All rights reserved.
