### 1. Project Overview

- **E-Commerce Center Frontend** is a single-page application that contains both an **admin console** (catalog, inventory, coupons, payments, dashboard) and a **customer storefront** (browse → cart → checkout → Stripe payment).
- It solves the “frontend complexity” side of e-commerce: **role-aware routing**, **token refresh without UX flicker**, **form-heavy checkout**, and **reliable API state** across many feature areas.
- Built for product teams who want a maintainable UI: feature folders are isolated under `src/features/*` with a shared API layer and a predictable store setup.

### 2. Key Features

- **Route guards that rehydrate auth safely**: protected routes are wrapped by an `AuthGuard` that attempts a silent session restore via `GET /api/Auth/me` using the refresh-token cookie.
- **Centralized API layer with RTK Query**: a single `baseApi` powers all feature endpoints; caching/invalidation is handled via tag types (catalog, cart, inventory, coupons, payments, etc.).
- **Automatic token refresh on 401**: requests retry once after `POST /api/Auth/refresh-token` (cookie-based) and update Redux state with a new access token.
- **Admin + Storefront in one app**: the router cleanly separates guest-only auth pages, authenticated admin pages, and public store pages.
- **Stripe checkout with PaymentElement**: the checkout flow creates a PaymentIntent on the backend and confirms payment client-side (supports 3DS flows via Stripe redirect when required).
- **Form-first UX**: uses `react-hook-form` + `zod` to keep complex forms (auth, checkout, catalog management) validated and maintainable.
- **Component system built on Radix primitives**: consistent, accessible UI primitives with Tailwind styling.

### 3. Tech Stack

- **Frontend**
  - **React 19 + TypeScript**: modern component model with type-safe feature boundaries.
  - **Vite**: fast iteration with a minimal bundling pipeline and dev server.
  - **React Router**: explicit route configuration with guard components for auth/guest flows.
- **State & Data**
  - **Redux Toolkit + RTK Query**: normalized, cached API state with predictable invalidation and a single base query.
  - **Silent re-auth using HttpOnly cookies**: reduces XSS exposure by keeping refresh tokens out of JS.
- **UI / UX**
  - **Tailwind CSS v4**: utility-first styling that scales across many screens.
  - **Radix UI primitives (and a shadcn-style component layer)**: accessible components without reinventing behavior.
  - **react-hook-form + zod**: schema-driven validation for complex forms.
- **Payments / Integrations**
  - **Stripe Elements**: PaymentElement integration aligned with PaymentIntent flow.
  - **Firebase Web SDK**: Google sign-in client integration (backend verifies tokens).

### 4. Architecture & Design

- **Feature-first folder structure**
  - Each vertical domain lives under `src/features/<domain>` (auth, catalog, cart, checkout, inventory, coupons, payments, dashboard, store).
  - Cross-cutting utilities live under `src/shared/*` (API base, UI primitives, types, constants).
- **API design**
  - `src/shared/api/baseApi.ts` wraps RTK Query’s `fetchBaseQuery` with:
    - `credentials: "include"` so refresh cookies are sent.
    - `Authorization: Bearer <accessToken>` header injection.
    - a **single retry** path on 401 that calls `/Auth/refresh-token`, updates auth state, then retries the original request.
- **Auth flow**
  - The app treats “refresh cookie present” as a server-owned session: first render of protected routes resolves via `/Auth/me` before showing the dashboard (avoids route flicker).
- **Payments flow**
  - Store checkout collects address + shipping selection, then places an order.
  - The backend returns Stripe `clientSecret`; the app confirms payment using `stripe.confirmPayment()`.

### 5. Challenges & Solutions

- **Keeping auth smooth without compromising security**
  - Challenge: persisting a login without storing refresh tokens in localStorage.
  - Solution: refresh token is HttpOnly; the UI stores only the access token (short-lived) and can rehydrate on page load via `/Auth/me`.
- **Avoiding duplicated error-handling logic across many endpoints**
  - Challenge: different features (catalog/cart/inventory/etc.) all need consistent API failure UX.
  - Solution: a shared RTK Query middleware centralizes notification behavior and normalizes error messages.
- **Checkout as a multi-step state machine**
  - Challenge: address → freight quote → confirm → payment requires state continuity without becoming a single monolithic component.
  - Solution: explicit step components + a single orchestrating page that owns transitions and mutations.

### 6. Performance & Optimization (if applicable)

- **RTK Query caching + tag invalidation** reduces redundant fetches and keeps UI responsive when navigating between admin pages.
- **Cursor-based pagination UI patterns** (e.g., payments/charges) scale better than page-index pagination for large datasets.
- **Dev proxy support** avoids CORS pain during local development when configured to use relative `/api` calls.

### 7. How to Run the Project

1. **Prerequisites**
   - Node.js (LTS recommended)
   - Backend API running locally

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment**

- Create a `.env` file in the frontend root (same folder as `package.json`).

Common options:

- Point directly at the backend:

```bash
VITE_API_BASE_URL=http://localhost:5247
VITE_STRIPE_PUBLISHABLE_KEY=pk_...
```

- Or, use the Vite dev proxy by setting an empty base URL (the code treats empty string as “relative”):

```bash
VITE_API_BASE_URL=
VITE_STRIPE_PUBLISHABLE_KEY=pk_...
```

4. **Run dev server**

```bash
npm run dev
```

- Default URL: `http://127.0.0.1:5173`

### 8. Future Improvements

- Add **end-to-end tests** for checkout + Stripe confirmation flows.
- Add **role-aware navigation** (hide admin routes/menus unless role is present) aligned with backend RBAC.
- Improve **observability**: capture API errors with trace IDs and surface actionable diagnostics in the admin UI.
- Add **bundle analysis + route-level code splitting** for faster storefront initial load.
- Harden session handling with **refresh token rotation** UI feedback (e.g., global “session expired” state).
