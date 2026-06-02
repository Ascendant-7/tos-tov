# IP2 Week 7 Group 11 Problems & Status Report

## 🏗️ Monorepo Overview

The project is a **pnpm-based monorepo** consisting of:

- **`apps/client`**: Vue 3 + Vite frontend using Pinia and Vue Router.
- **`apps/api`**: NestJS backend providing RESTful endpoints.
- **`packages/supabase`**: Shared package for Supabase client and schema types.
- **`docs/`**: Documentation including diagrams and problem reports.

---

## 🛑 Critical Issues (Valid/Unresolved)

### 🖥️ Backend (NestJS API)

- [ ] **In-Memory Storage**: `BudgetService` still uses a local array. Data is lost on restart.
- [ ] **Auth Gaps**: Missing `logout` and `token refresh` endpoints.
- [ ] **Type Safety**: Controllers still use `Promise<any>` instead of DTOs (e.g., `AuthController`).
- [ ] **Validation**: `Budget` DTOs lack class-validator decorators.
- [ ] **Minimal Profiles**: `ProfilesController` only supports `getById`.

### 🌐 Frontend (Vue 3)

- [ ] **Auth State**: Missing Pinia store for global authentication state.
- [ ] **Security**: No navigation guards (`beforeEach`) to protect private routes.
- [ ] **Data Flow**: `HomePage` and `Community` modules still rely on hardcoded mock data.

### ⚙️ Infrastructure & DX

- [ ] **Version Mismatch**:
  - **TS**: API (5.7.3) vs Client (5.9.3) vs Supabase (6.0.3).
  - **Node**: API (>=21) vs Client (^20.19.0 || >=22.12.0).
- [ ] **Artifacts**: `out.json` and `deleteme` folders should be removed/ignored.
- [ ] **Supabase Package**: `build` dependency (v0.1.4) in `packages/supabase` is likely miscategorized.
- [ ] **Migrations**: Duplicate `create_temp_table` migration files in `packages/supabase`.

---

## ✅ Resolved / Improved

- [x] **Friends Module**: Core interfaces and logic are now present (though using mocks).
- [x] **Itinerary Filtering**: `getItinerary` now correctly filters by `trip_id`.
- [x] **UI Progress**: `ProfilePage`, `ExplorePage`, and `TripPlannerPage` have moved beyond empty placeholders.
- [x] **Schema Definitions**: `database.types.ts` now reflects the actual database tables.

---

## 📋 Recommended Action Plan (Week 7)

1. **Unify Environment**: Align Node and TypeScript versions across the workspace.
2. **Persistent Budgets**: Migrate `BudgetService` from in-memory to Supabase database.
3. **Frontend Auth**: Implement `useAuthStore` and add router guards.
4. **DTO Hardening**: Add `class-validator` to all API DTOs.
5. **Clean Up**: Remove `out.json`, `deleteme` folders, and deduplicate migrations.
