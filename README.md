# E-Commerce Center — Frontend

> Full-featured React 19 storefront & admin dashboard for the E-Commerce Center platform. Covers the entire shopping experience — catalog browsing, variant selection, cart with coupons, 3-step checkout, and Stripe payment — alongside a rich admin console for products, inventory, orders, coupons, payments, and analytics.

**Backend repo →** [ecommerce-platform-backend](https://github.com/MoathEssa/ecommerce-platform-backend)

---

## 1. Project Overview

### The Business

E-Commerce Center is a **multi-vendor dropshipping platform** that lets store operators run an online retail business without holding physical inventory. Operators import products from **CJ Dropshipping**, set retail pricing to capture margin, and the platform handles checkout, payments, inventory, promotions, and order management end-to-end.

The frontend delivers the complete user-facing experience for both sides of the business:

- **Customer Storefront** — home page, product listing with category/search/sort filters, product detail with image gallery and variant selector, cart with real-time coupon evaluation, a 3-step checkout (address → shipping → review), Stripe payment confirmation (3DS-capable), and order success.
- **Admin Dashboard** — KPI overview with revenue charts, full CRUD for products/categories/variants (with drag-and-drop image reordering), inventory management with adjustment history, coupon builder with scope/limit configuration, payment monitoring with Stripe charge details, and admin-initiated refunds.

### Technical Summary

The app handles the hard frontend problems: **silent auth rehydration without route flicker**, **automatic 401 retry with cookie-based refresh**, **complex form orchestration across multi-step flows**, and **a generic data table with a visual query builder** that powers every admin list page.

---

## 2. Key Features

### Authentication & Session Management

- **Silent session restore** — `AuthGuard` calls `GET /api/Auth/me` on mount using the HttpOnly refresh-token cookie; protected routes render only after the session resolves, eliminating unauthenticated route flicker.
- **Automatic 401 retry** — RTK Query's `baseQuery` wrapper intercepts 401 responses, calls `POST /api/Auth/refresh-token` (cookie-based), updates the Redux auth slice with the new access token, and replays the original request — all transparent to the UI.
- **Google OAuth** — Firebase Web SDK handles the Google sign-in popup; the ID token is sent to the backend for verification and account provisioning.
- **Guest guard** — login/register pages redirect authenticated users to the dashboard, preventing double-login states.

### Storefront Experience

- **Home page** — featured product grid, promotional banners, and category quick-links.
- **Product listing** — server-driven pagination with category filter, keyword search, price-range sort, and URL-synced query parameters for shareable filter states.
- **Product detail** — full image gallery (multi-image navigation), variant selector (size/color/material), real-time stock indicator, and add-to-cart with quantity control.
- **Cart** — line items with variant details, quantity adjustment, coupon code input with real-time validation (server-evaluated), subtotal/discount/total summary.
- **3-step checkout** — Step 1: billing + shipping address forms (validated with zod schemas). Step 2: shipping method selection with freight cost preview. Step 3: order review with line items, addresses, and final total before placement.
- **Stripe payment** — after order creation, the app loads Stripe's `PaymentElement` with the server-provided `clientSecret`; supports redirect-based 3DS verification. On completion, polls the backend for payment status and navigates to the success page.
- **Order success** — confirmation display with order number and payment receipt summary.

### Admin Dashboard

- **KPI grid** — total revenue, total orders, unique customers, average order value — each with a trend indicator comparing to the previous period.
- **Revenue chart** — Recharts `AreaChart` rendering daily revenue over a configurable time window (7/30/90/365 days).
- **Order status distribution** — `PieChart` showing counts by order state (Pending, Paid, Shipped, Refunded, etc.).
- **Top products** — ranked by revenue from completed orders.
- **Inventory alerts** — low-stock and out-of-stock counts with drill-through to the inventory page.

### Catalog Management (Admin)

- **Products** — create/edit with rich form fields (title, description, category, pricing, SEO slug); image upload with **drag-and-drop reordering** via `dnd-kit`.
- **Variants** — add/edit per-product variants with JSON options, independent SKU, pricing, currency, and stock linkage.
- **Categories** — hierarchical CRUD with parent selection; used as filter facets on the storefront.
- **Supplier import** — browse CJ Dropshipping categories/products and import into the local catalog with a single click.

### Coupon Management (Admin)

- **Coupon builder form** — code, discount type (percentage/fixed), scope targeting (global/category/product/variant), usage limits (global + per-user), date windows, minimum order amount.
- **Coupon list** — filterable data table with status indicators (active, expired, exhausted).

### Inventory Management (Admin)

- **Stock overview** — data table with current on-hand quantities, low-stock highlighting, and inline adjustment.
- **Adjustment history** — log of all stock changes with delta, reason, and actor.

### Payments & Refunds (Admin)

- **Charge browser** — paginated list of Stripe charges with status, amount, currency, and creation date; detail view with full charge metadata.
- **Refund workflow** — admin initiates refund (full or partial) with reason; the UI tracks refund status in real time.

### Data Table System

- **`DataTableV2`** — a reusable, generic table component used across all admin pages. Features:
  - Server-side pagination, sorting, and filtering.
  - **Visual query builder** — AND/OR compound filter groups with per-column operators (equals, contains, greater-than, between, etc.).
  - Column visibility toggle, density control, and responsive layout.
  - Integrated with RTK Query — filter/sort/page state is reflected in the API request and cached.

### Internationalization & Theming

- **i18next** — full English translation namespace; Arabic translation files scaffolded with RTL-ready layout (CSS logical properties throughout).
- **Dark mode** — `next-themes` integration with system preference detection; theme toggle in the admin header. Tailwind v4 dark variant applied globally.

---

## 3. Tech Stack

| Layer             | Technology                | Why                                                                                       |
| ----------------- | ------------------------- | ----------------------------------------------------------------------------------------- |
| **Framework**     | React 19 + TypeScript 5.9 | Modern component model with strict type-safe feature boundaries                           |
| **Bundler**       | Vite 7                    | Sub-second HMR, optimized production builds, native ESM dev server                        |
| **Routing**       | React Router 7            | Explicit route config with guard components for auth/guest/admin flows                    |
| **State**         | Redux Toolkit + RTK Query | Normalized cached API state, predictable invalidation via 11 tag types, single base query |
| **Forms**         | react-hook-form + zod     | Schema-driven validation; uncontrolled inputs for performance on complex forms            |
| **UI Primitives** | Radix UI (30+ primitives) | Accessible, unstyled components — Dialog, Dropdown, Select, Tabs, Toast, etc.             |
| **Styling**       | Tailwind CSS v4           | Utility-first with CSS variables for theming; dark mode via class strategy                |
| **Charts**        | Recharts                  | AreaChart (revenue), PieChart (order status), BarChart (top products)                     |
| **Drag & Drop**   | dnd-kit                   | Drag-reorder product images with sortable containers                                      |
| **Payments**      | Stripe Elements           | `PaymentElement` integration aligned with server-side PaymentIntents                      |
| **Auth**          | Firebase Web SDK          | Google sign-in popup; token forwarded to backend for verification                         |
| **i18n**          | i18next + react-i18next   | Namespace-based translations; RTL-ready for Arabic                                        |
| **Theming**       | next-themes               | System preference detection + manual toggle; dark/light mode                              |

---

## 4. Architecture & Design

```
src/
├── app/                    # App shell
│   ├── providers/          # Redux, Router, Stripe, Theme, i18n providers
│   ├── router/             # Route config + AuthGuard / GuestGuard
│   └── store/              # Redux store setup + RTK Query middleware
├── features/               # Feature modules (one per domain)
│   ├── auth/               # Login, Register, Forgot Password, Google OAuth
│   ├── store/              # Storefront pages (Home, List, Detail, Cart, Checkout, Payment, Success)
│   ├── dashboard/          # KPI grid, charts, alerts
│   ├── catalog/            # Product/Category/Variant CRUD, supplier import
│   ├── cart/               # Admin cart management, abandoned cart view
│   ├── checkout/           # Admin checkout/order view
│   ├── coupons/            # Coupon builder + list
│   ├── inventory/          # Stock management + adjustment history
│   └── payments/           # Charge browser + refund workflow
└── shared/                 # Cross-cutting modules
    ├── api/                # baseApi.ts — RTK Query base with auth retry
    ├── components/         # DataTableV2, QueryBuilder, shared widgets
    ├── hooks/              # useDebounce, useMediaQuery, custom hooks
    ├── types/              # Shared TypeScript interfaces
    ├── constants/          # API base URL, route paths, config
    ├── lib/                # Utility functions
    └── ui/                 # Radix-based UI primitives (Button, Dialog, Input, etc.)
```

**Key design decisions:**

- **Feature-first isolation** — each domain owns its pages, components, API slice, and types. No cross-feature imports; shared logic lives in `shared/`.
- **Single API layer** — `baseApi.ts` defines one `fetchBaseQuery` instance with credential handling, auth header injection, and 401 retry. Feature API slices use `injectEndpoints` to extend it, inheriting caching and tag invalidation automatically.
- **Tag-based cache invalidation** — 11 tag types (`Catalog`, `Cart`, `Inventory`, `Coupons`, `Payments`, `Dashboard`, etc.) ensure mutations only invalidate relevant queries — no manual refetching.
- **Guard-based routing** — `AuthGuard` wraps protected routes (rehydrates session via `/Auth/me` before rendering); `GuestGuard` wraps auth pages (redirects if already logged in). Both are composable with `<Outlet />`.
- **Checkout state machine** — the 3-step checkout is orchestrated by a single page component that manages step transitions, validates completion of each step, and passes accumulated state forward — no global store pollution.
- **Component composition** — UI primitives from Radix are wrapped once in `shared/ui/` with Tailwind styling; feature components compose these without re-implementing behavior.

---

## 5. Performance & Optimization

- **RTK Query caching** — API responses are cached by endpoint + argument combination; navigating between admin pages reuses cached data instantly.
- **Tag-based invalidation** — mutations invalidate only the affected tags, preventing full cache flushes and redundant network requests.
- **Uncontrolled form inputs** — `react-hook-form` avoids re-renders on every keystroke in complex forms (checkout addresses, product editing, coupon builder).
- **Lazy route loading** — route-level code splitting ensures the storefront bundle doesn't include admin code and vice versa.
- **Debounced search** — product search and filter inputs are debounced to reduce API calls during typing.
- **Optimistic UI updates** — cart quantity changes reflect immediately while the mutation fires in the background.

---

## 6. How to Run the Project

### Prerequisites

- **Node.js** (LTS recommended)
- Backend API running locally (see [backend repo](https://github.com/MoathEssa/ecommerce-platform-backend))

### 1. Clone & install

```bash
git clone https://github.com/MoathEssa/ecommerce-platform-front-end.git
cd ecommerce-platform-front-end
npm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```bash
# Point to the running backend API
VITE_API_BASE_URL=http://localhost:5247

# Stripe publishable key for PaymentElement
VITE_STRIPE_PUBLISHABLE_KEY=pk_...

# Firebase config for Google sign-in
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
```

### 3. Run dev server

```bash
npm run dev
```

App available at `http://localhost:5173`.

### 4. Production build

```bash
npm run build    # outputs to dist/
npm run preview  # serve the production build locally
```


