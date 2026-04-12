# Changelog

All notable changes to Marketplace Fitness are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [0.2.0] — 2026-04-12 — Trainer Tools Update

The biggest UX upgrade since launch — search, mobile-friendly navigation,
WhatsApp contact, a referral-link system that makes every trainer's
discount code one-click shareable, and full product CRUD from the admin
panel.

Live at https://fitnessmarketplace.vercel.app

### For customers

- **Search** — full-text search bar in the header (md+) and inside the
  mobile menu drawer. Matches product name OR brand, case-insensitive.
  Try "creatine" or "MuscleBlaze".
- **Mobile-first navigation** — hamburger menu opens a left slide-over
  drawer with search, all 5 categories, and main links. The product
  filters now open in a separate right slide-over drawer instead of
  stacking inline above the grid.
- **WhatsApp contact** — floating "Chat on WhatsApp" button on every
  page. Opens WhatsApp with a pre-filled message.
- **Related products** — every product detail page now shows 4 other
  products from the same category at the bottom (ordered by bestseller
  + rating).
- **Range filter** — new "Range" section in the filter sidebar with 4
  multi-select buckets: Low (under ₹1,000), Mid (₹1,000-1,999),
  High (₹2,000-3,499), Premium (₹3,500+). Composes with all other
  filters.
- **Empty-state recovery** — if your filters return nothing, a "Clear
  filters" link is right there.

### For trainers

- **Shareable referral links** — every trainer now has a unique URL
  like `https://fitnessmarketplace.vercel.app/?ref=TRN-EQ4JWW`. Send
  it to a client and:
    - A green "Recommended by [trainer name]" banner follows them
      across every page
    - At checkout, the trainer code is pre-filled and validated, so the
      10% discount is applied automatically — the customer doesn't even
      see the code field
    - The referral persists across page navigations via `localStorage`
      until the customer dismisses it or completes an order
- **Active/Inactive toggle** — pause a trainer's discount code without
  losing their sales history. Shown as a one-click button in
  `/admin/trainers`.
- **Per-trainer revenue at a glance** — trainer list now shows order
  count and total revenue alongside name and code.

### For admins

- **Add products from the admin panel** — new "Add Product" button on
  `/admin/products` opens a full form (name, brand, category, prices,
  stock, description, image URL, badges, optional category-specific
  specs). New products appear on the public site immediately.
- **Edit products** — click the edit icon on any product row. Update
  prices, stock, description, badges, anything.
- **Brand auto-create** — type a brand name in the product form and it
  gets created automatically on save (no separate "add brand" step).
  Existing brands appear as autocomplete suggestions.
- **Slug & image auto-generate** — leave the slug blank and it's
  generated from the product name. Leave the image URL blank and a
  category-themed `placehold.co` placeholder is generated.
- **Safe delete** — products that appear in past orders cannot be
  deleted (preserves historical order data). The error message
  recommends setting stock to 0 to hide the product from the store
  instead.

### Technical notes

- All new admin endpoints (`POST/PATCH/DELETE /api/admin/products[/[id]]`,
  `PATCH /api/admin/trainers/[id]`) are gated by the existing HTTP Basic
  Auth middleware and validated against the CSRF Origin check.
- `SearchBar` and `TrainerRefBanner` deliberately read URL params via
  `window.location.search` inside `useEffect` rather than
  `useSearchParams` — this keeps every static page from being forced
  into dynamic rendering.
- Trainer referral state is stored under the localStorage key
  `marketplace-fitness-trainer-ref`. Dismissing the banner clears it.
- Inactive trainers' codes still pass through `/api/orders`, but no
  discount is applied (silent drop, same UX as a typo). Order placement
  is never blocked by trainer state.

### Known limitations (carried forward from v0.1)

- WhatsApp number in `src/components/WhatsAppButton.tsx` is a placeholder
  (`919876543200`) — replace with the real trainer number before launch.
- Security headers (`X-Frame-Options`, `Content-Security-Policy`,
  etc.) not yet set in `next.config.ts`. Vercel sets HSTS by default.
- No rate limiting on `/api/orders` or `/api/admin/*`.
- `/order/success/[id]` is publicly accessible — order ID is an
  unguessable CUID but the URL is not signed.
- UPI payment verification is still manual — customer types any UTR
  string, no real gateway integration.
- Product images are auto-generated `placehold.co` placeholders, not
  real product photography.

### Commits in this release

- `7da4a0f` Add UX features from persona testing: search, mobile nav,
  WhatsApp, related products, trainer referral URL
- `b8d1f4c` Add admin product CRUD and trainer onboarding controls
- `bcd2c2a` Add price tier filter (Premium / High / Mid / Low Range)

---

## [0.1.0] — 2026-04-08 — Initial public release

First public deploy. Trainer-curated supplement e-commerce for Indore
gyms with a unique discount code per trainer.

### Features

- **Storefront** — home (hero, 5 category tiles, bestsellers grid),
  about us, all-products listing with filters (price, brand, rating,
  bestseller, selling-fast, sort), per-category landing pages, product
  detail pages with reviews
- **Cart** — Zustand store persisted to `localStorage`, stock-capped
  quantities, hydration-safe rendering
- **Checkout** — address validation (Indian 10-digit mobile, 6-digit
  pincode), trainer discount code with live validation, cash + UPI
  payment (UPI requires UTR ref), atomic stock decrement in
  `prisma.$transaction`
- **Admin section** — dashboard, products list, trainers list with
  add-trainer form (auto `TRN-XXXXXX` codes), orders list, sales-by-
  trainer report with date filter and CSV export. Gated by HTTP Basic
  Auth via `src/middleware.ts`.
- **Security** — strict input validation, server-side price recompute
  in `/api/orders`, atomic stock decrement, CSRF Origin check,
  parameterized Prisma queries (no SQL injection), no `dangerouslySetInnerHTML`
  (no XSS)

### Stack

- Next.js 16 (App Router, Turbopack)
- TypeScript, Tailwind CSS v4
- Prisma 7 with `@prisma/adapter-pg`
- PostgreSQL on Neon
- Zustand for cart, React Hook Form + Zod for forms
- Vercel + Neon free tier deploy
