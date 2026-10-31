# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

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
