# Brightloop – Subscription Billing Platform

A smart subscription billing and management platform that automates subscriptions, invoice generation, payment tracking, and revenue management.

Developed by a team of 4 as a hackathon project.

**Brightloop – Simplifying Subscriptions. Automating Billing. Empowering Businesses.**

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
