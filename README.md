# Personal Finance App

A personal finance dashboard built with **Next.js** for tracking your balance, income, expenses, and savings. This is a frontend that reads its data from a **Spring Boot** backend over a REST API.

![Simulator](./simulator.jpg)

## Features

- **Current month summary**: cards for Total Balance, Total Income, Total Saving, and Total Expense, each with its percentage change.
- **Income vs Expense chart**: a bar chart with a *Monthly* or *Weekly* period.
- **Transaction list**: debounced search and a date filter, with the 10 latest transactions on the home page.
- **Transaction page** (`/transaction`): the full table with server-side pagination.
- **Navigation sidebar** that works on both desktop and mobile.

## Tech Stack

| Purpose | Library |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui (`base-nova` style), Base UI |
| Charts | Recharts |
| Icons | lucide-react, react-icons |
| Forms and validation | react-hook-form, zod |

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Dashboard: summary, chart, latest transactions
│   └── transaction/page.tsx  # Paginated transaction list
├── components/
│   ├── cards/                # SummaryCard
│   ├── chart/                # Income vs Expense chart
│   ├── header/               # Dashboard header and search/filter
│   ├── sidebar/              # App sidebar
│   ├── table/                # Transaction table, sorting, pagination
│   └── ui/                   # Base shadcn/ui components
├── hooks/                    # useTransactions, useTransactionStat, useTransactionStatistic, etc.
└── lib/
    ├── api/transaction.ts    # API client for the Spring Boot backend
    ├── date.ts               # Date helpers
    └── utils.ts
```

## Backend Integration

Every request goes to the backend with an `Authorization: Bearer <token>` header. Every response uses the envelope `{ data, message, errors, paging }`.

| Endpoint | Query | Purpose |
| --- | --- | --- |
| `GET /api/transaction` | `limit`, `skip`, `search`, `date` (`YYYY-MM-DD`) | Paginated transaction list |
| `GET /api/transaction/stat` | `startDate`, `endDate` | Balance, income, expense, and saving summary |
| `GET /api/transaction/statistic` | `periode` (`Monthly` / `Weekly`) | Income vs expense chart data |

## Getting Started

### 1. Prerequisites

- Node.js 20+
- A running Spring Boot backend (defaults to `http://localhost:8080`)

### 2. Environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_API_TOKEN=<token-from-backend>
```

### 3. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other scripts

| Command | Description |
| --- | --- |
| `npm run build` | Build for production |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |
