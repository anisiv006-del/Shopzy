# Shopzy frontend

## Setup

```bash
cd frontend
npm install
npm run dev
```

The Vite app runs on `http://localhost:5173`. Copy `.env` to configure
`VITE_API_URL` (the default is `http://localhost:3000/api`).

## Backend setup

In a second terminal, configure and start the API:

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB and SMTP credentials.
npm install
npm run dev
```

The API runs on `http://localhost:3000`. MongoDB must be running and the
backend must have valid `MONGODB_URI`, `JWT_SECRET`, and `OTP_SECRET` values.
SMTP credentials are required for login and payment OTP emails.

The app includes customer authentication with login OTP, role guards, product
browsing and filtering, per-user carts, server-priced payment OTP checkout,
orders, profile, saved addresses, wishlists, product reviews, dark mode, and
admin product/order/user views with user deletion.

## Frontend structure

```text
src/
  api/          Axios client and endpoint modules
  components/   Shared UI, auth, layout, and product components
  context/      Auth, cart, checkout, and theme state
  pages/        Auth, customer, admin, and error pages
  routes/       Protected and role-based route guards
  utils/        Currency, dates, and display helpers
```

The UI uses a responsive mobile-first layout, indigo/violet brand gradient,
coral destructive accents, slate surfaces, dark mode, skeleton states,
accessible labels, and responsive admin tables.

## Backend fixes

1. Replaced `routes/categoryRoutes.js` controller code with an authenticated
   Express router delegating to `controllers/categoryController.js`.
2. The backend currently contains `routes/OrderRoutes.js` only; rename it to
   `routes/orderRoutes.js` on case-sensitive filesystems so the existing
   `server.js` require resolves.

If the products collection is empty, sign in with an admin account and add
products from `/admin/products`.

Saved addresses and wishlists are stored on the authenticated user. Reviews are
limited to one per user per product and update the product rating aggregate.
Admin user deletion is disabled for admin rows and cannot delete the current
admin account.
