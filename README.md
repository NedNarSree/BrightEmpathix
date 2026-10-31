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

### Subscription Management
- Designed to support customer subscriptions and subscription lifecycle tracking.

### Billing and Payments
- Designed to support invoice generation, payment recording, and payment status tracking.

## Database Structure

### products
- id (UUID, primary key)
- name
- type
- sales_price (BIGINT, paise)
- cost_price (BIGINT, paise)
- notes
- created_at

### plans
- id (UUID, primary key)
- product_id (UUID, foreign key referencing products.id)
- name
- billing_cycle
- price (BIGINT, paise)
- min_quantity
- available_from
- available_to
- created_at

## Local Setup

1. Clone the repository:

   ```bash
   git clone YOUR_GITHUB_REPOSITORY_URL
   ```

2. Enter the project directory:

   ```bash
   cd BrightEmpathix
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the project root:

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

## Security

- Environment variables are excluded from Git using `.gitignore`.
- Supabase Row Level Security is enabled on the database tables.
- Public database access policies are currently configured for the hackathon demo and should be restricted before production use.

## Project Status

Developed as a four-member hackathon project. Product management is connected to Supabase. Plan management and other modules are being integrated and tested.