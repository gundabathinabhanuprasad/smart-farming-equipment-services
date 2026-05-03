# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains a Smart Farming Equipment as a Service (FaaS) Platform called **KhetBook** — a mobile-first, conversion-focused website for rural India connecting farmers with tractor and agricultural equipment owners, drivers, and equipment owners via a multi-role platform.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui + Framer Motion
- **Auth**: JWT (jsonwebtoken) + bcryptjs, stored in localStorage

## Artifacts

### `artifacts/faas-platform` — KhetBook FaaS Platform (preview path: `/`)
Full multi-role smart farming platform with:
- Hero section with real tractor imagery
- Location-based search bar (filter equipment + drivers by village/district)
- Equipment listing grid with Haversine location filtering
- Driver listing section with booking dialog (broadcast system)
- AI Insights section
- Testimonials, Village Operators, Platform stats
- Booking dialogs (equipment + driver)
- Revenue model section (70%/30% split)
- Contact section + sticky mobile CTA
- Auth-aware Navbar (Sign In / Join / Dashboard buttons)

**Pages:**
- `/` — Home (public)
- `/login` — Login page (phone + password, demo admin credentials shown)
- `/signup` — Signup page (role selection: farmer/owner/driver, location detection)
- `/admin` — Admin Dashboard (users, equipment, drivers, bookings, stats)
- `/owner` — Owner Dashboard (list equipment, manage bookings, accept/reject, earnings)
- `/driver` — Driver Dashboard (profile setup, online/offline toggle, broadcast requests, earnings)

Design: Deep agricultural green (#1a4731), warm ivory background, earthy amber accent. Inter + Playfair Display fonts.

### `artifacts/api-server` — Express API Server (preview path: `/api`)
REST API with JWT-based multi-role auth.

**Public routes:**
- `GET /api/equipment` — list equipment (filter: category, available, lat/lng/radius, village, district)
- `GET /api/equipment/:id` — get single equipment
- `GET /api/bookings` — list equipment bookings
- `POST /api/bookings` — create equipment booking (defaults to status=pending)
- `GET /api/testimonials`, `/api/operators`, `/api/insights`, `/api/stats`
- `GET /api/drivers` — list available drivers (filter: lat/lng/radius, village, district)
- `POST /api/driver-bookings` — create driver booking (broadcast if no driverId given)

**Auth routes:**
- `POST /api/auth/signup` — register (farmer/owner/driver)
- `POST /api/auth/login` — login → JWT token
- `GET /api/auth/me` — current user info

**Protected routes (role-based):**
- `/api/admin/*` — admin-only: stats, manage users/equipment/drivers/bookings
- `/api/owner/*` — owner+admin: CRUD equipment, view/accept/reject bookings
- `/api/driver/*` — driver+admin: profile setup, availability toggle, view broadcast + assigned bookings

## Database Schema

Tables: `equipment`, `bookings`, `testimonials`, `operators`, `insights`, `users`, `drivers`, `driver_bookings`

**Extended columns:**
- `equipment`: ownerId, locationLat, locationLng, village, district, state
- `bookings`: farmerId, farmerLat, farmerLng, equipmentName, status defaults to "pending"
- `users`: name, phone, passwordHash, role, village, district, state, locationLat, locationLng, status
- `drivers`: userId, experience, pricePerHour, available, village, district, locationLat/Lng, bio, avatarUrl, rating, totalBookings
- `driver_bookings`: farmerName/Phone/Village, farmerId, farmerLat/Lng, driverId, slotDate/Time, durationHours, status, totalAmount, taskType

## Admin Demo Account
- Phone: `9000000000`
- Password: `admin123`

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
