# Wealth — AI-Powered Personal Finance Manager

A full-stack personal finance application built with Next.js 16. Track income and expenses, scan receipts with AI, set budgets, and receive automated monthly financial insights — all in one place.

---

## Features

- **Dashboard** — Overview of balances, recent transactions, and budget progress across all accounts
- **Multiple Accounts** — Create and manage Current, Savings, and Credit Card accounts with a default account selector
- **Transaction Management** — Add, edit, delete, filter, sort, and paginate transactions with full category support
- **AI Receipt Scanner** — Upload a receipt image and have Gemini AI automatically extract amount, date, merchant, and category
- **Recurring Transactions** — Schedule daily, weekly, monthly, or yearly recurring transactions processed automatically
- **Budget Tracking** — Set a monthly budget with real-time progress bar and percentage alerts
- **Automated Email Alerts** — Get notified by email when spending reaches 80% of your budget
- **Monthly Financial Reports** — AI-generated insights delivered by email on the first of every month
- **Bot & Attack Protection** — ArcJet shields every request from bots, scrapers, and common web attacks
- **Rate Limiting** — Token bucket rate limiting on transaction creation per user

---

## Tech Stack

### Framework & Language
| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org) | Full-stack React framework (App Router) |
| TypeScript | Type safety across the codebase |

### Authentication
| Technology | Purpose |
|---|---|
| [Clerk](https://clerk.com) | User authentication, session management, and protected routes |

### Database & ORM
| Technology | Purpose |
|---|---|
| PostgreSQL | Relational database |
| [Prisma](https://prisma.io) | Type-safe ORM with migrations |
| [Supabase](https://supabase.com) | Hosted PostgreSQL (via `DATABASE_URL` / `DIRECT_URL`) |

### AI
| Technology | Purpose |
|---|---|
| [Google Gemini](https://ai.google.dev) (`@google/genai`) | Receipt scanning and monthly financial insight generation |

### Background Jobs
| Technology | Purpose |
|---|---|
| [Inngest](https://inngest.com) | Scheduled and event-driven background functions |

### Email
| Technology | Purpose |
|---|---|
| [Resend](https://resend.com) | Transactional email delivery |
| [React Email](https://react.email) | Email template rendering |

### Security
| Technology | Purpose |
|---|---|
| [ArcJet](https://arcjet.com) | Bot detection, shield protection, and rate limiting |

### UI & Styling
| Technology | Purpose |
|---|---|
| Tailwind CSS v4 | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com) | Accessible component library (Radix UI primitives) |
| [Recharts](https://recharts.org) | Charts for transaction overview and account analytics |
| [Sonner](https://sonner.emilkowal.ski) | Toast notifications |
| [Lucide React](https://lucide.dev) | Icon set |

### Forms & Validation
| Technology | Purpose |
|---|---|
| React Hook Form | Form state management |
| Zod | Schema validation |

---

## Project Structure

```
├── actions/              # Next.js Server Actions
│   ├── account.ts        # Account CRUD & balance management
│   ├── budget.ts         # Budget create/update
│   ├── transaction.ts    # Transaction CRUD + AI receipt scan
│   └── send-email.ts     # Resend email helper
├── app/
│   ├── (main)/
│   │   ├── dashboard/    # Dashboard page + components
│   │   ├── account/[id]/ # Account detail with chart & transaction table
│   │   └── transaction/  # Add/edit transaction form + receipt scanner
│   └── api/inngest/      # Inngest webhook endpoint
├── emails/               # React Email templates
├── lib/
│   ├── arcjet.js         # ArcJet rate limiting config
│   ├── inngest/
│   │   ├── client.js     # Inngest client
│   │   └── function.js   # Background job definitions
│   └── prisma.ts         # Prisma client singleton
├── prisma/
│   └── schema.prisma     # Database schema
└── proxy.ts              # Next.js middleware (ArcJet + Clerk chained)
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Supabase project)

### Environment Variables

Create a `.env` file in the root:

```env
# Database
DATABASE_URL=
DIRECT_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Google Gemini
GEMINI_API_KEY=

# Resend
RESEND_API_KEY=

# ArcJet
ARCJET_KEY=

# Inngest
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=
```

### Installation

```bash
npm install
npx prisma migrate dev
npm run dev
```

---

## Background Jobs (Inngest)

| Function | Trigger | Description |
|---|---|---|
| `triggerRecurringTransactions` | Daily at midnight | Finds due recurring transactions and fires events |
| `processRecurringTransaction` | Event-driven | Creates the new transaction and updates account balance |
| `checkBudgetAlerts` | Every 6 hours | Emails users who have exceeded 80% of their budget |
| `generateMonthlyReports` | 1st of each month | Generates AI financial insights and emails a report |
