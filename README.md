# BrightLoop Software - Subscription Management System

A web-based Subscription Management System built during a hackathon to manage products, subscription plans, customers, invoices, and payments in one platform.

## Technology Stack

- **Frontend:** React.js
- **Build Tool:** Vite
- **Programming Language:** JavaScript
- **Backend and Database:** Supabase
- **Database Engine:** PostgreSQL
- **Database Client:** Supabase JavaScript Client (`@supabase/supabase-js`)
- **Styling:** CSS

## Features

### Product Management
- Create, view, update, and delete products.
- Store product names, types, sales prices, cost prices, and notes.
- Persist product records in Supabase.
- Store monetary values as integer paise using PostgreSQL BIGINT columns.

### Plan Management
- Create and manage subscription plans.
- Link each plan to an existing product using a UUID foreign key.
- Support daily, weekly, monthly, and yearly billing cycles.
- Configure plan prices, minimum quantities, and availability dates.

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
It provides role-based access and real-time dashboards to track revenue, active subscriptions, and overdue payments efficiently.

---

## BrightEmpathix UI

### Run it
```bash
npm install
npm run dev        # opens on http://localhost:5173
```

### Views (`src/App.jsx`)
- Landing
- Pricing
- Login (`/auth`)
- App (dashboard with sidebar shell)

### Guidelines for Teammates
- Components: `<StatusBadge status="Paid" />`, `formatCurrency(n)`
- Tailwind Theme classes: `bg-primary`, `bg-secondary`, `text-accent`, `bg-canvas`, `text-ink`, `border-ink/15`, `font-display` for big numbers
- Default theme: `DEFAULT_THEME` in `src/theme/themes.js` (Emerald Ledger)
- Auth page: UI only (wire submit to Supabase Auth)
- Never commit `.env` (configured in `.gitignore`)
