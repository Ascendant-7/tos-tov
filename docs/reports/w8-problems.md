# IP2 Week 8 Group 11 Problems & Status Report

## 🏗️ Monorepo Overview

The project is a **pnpm-based monorepo** consisting of:

- **`apps/client`**: Vue 3 + Vite frontend using Pinia and Vue Router.
- **`apps/api`**: NestJS backend providing RESTful endpoints.
- **`packages/supabase`**: Shared package for Supabase client and schema types.
- **`docs/`**: Documentation including diagrams and problem reports.

---

## 🛑 Critical Issues (Valid/Unresolved)

### 🖥️ Backend (NestJS API)

| Module | Problem | Priority |
| :--- | :--- | :--- |
| **Budget** | `BudgetService` still uses a local array (`this.budgets`). Data is lost on restart. | 🔴 High |
| **Budget** | `Budget` DTOs lack `class-validator` decorators. Controller uses `any`. | 🟡 Medium |
| **Auth** | Missing `logout` and `token refresh` endpoints. | 🟡 Medium |
| **Profiles** | `ProfilesController` only supports `getById`. No update/list functionality. | 🟡 Medium |
| **Friends** | `FriendsModule` still uses `MockFriendsRepository`. Not yet integrated with Supabase. | 🟡 Medium |
| **General** | `Reviews` and `Profiles` entities are essentially empty classes. | 🔵 Low |

### 🌐 Frontend (Vue 3)

| Module | Problem | Priority |
| :--- | :--- | :--- |
| **Auth** | Missing Pinia store for global authentication state. LocalStorage is used directly in services. | 🔴 High |
| **Security** | No navigation guards (`beforeEach`) to protect private routes like `/profile` or `/trips`. | 🔴 High |
| **Community** | `CommunityView` and its store still rely entirely on hardcoded mock data. | 🟡 Medium |
| **Home** | `HomePage` uses mock data for weather, ongoing trips, and events. | 🟡 Medium |

### ⚙️ Infrastructure & DX

| Category | Problem | Priority |
| :--- | :--- | :--- |
| **Migrations** | Duplicate `create_temp_table` migration files (20260506022550 vs 20260507043844). | 🟡 Medium |
| **Clean Up** | `out.json` exists in root and should be removed/ignored. | 🔵 Low |
| **Types** | `ItineraryService` uses `as any` for the Supabase client. | 🔵 Low |

---

## ✅ Resolved / Improved

- [x] **Auth DTOs**: `AuthDto` and `LoginDto` now have proper `class-validator` decorators.
- [x] **Destination DTOs**: `CreateDestinationDto` now includes validation decorators.
- [x] **Review DTOs**: `CreateReviewDto` implemented with validation.
- [x] **Itinerary Logic**: `getItinerary` now correctly filters by `trip_id` and checks visibility/ownership.
- [x] **Global Validation**: `ValidationPipe` is enabled globally in `main.ts`.

---

## 📋 Recommended Action Plan (Week 8)

1. **Persistent Budgets**: Migrate `BudgetService` to Supabase. This is a carry-over high priority.
2. **Frontend Auth Store**: Create a proper Pinia store for Auth to manage user state and tokens.
3. **Router Guards**: Implement `router.beforeEach` to prevent unauthenticated access to user-specific pages.
4. **Friends Database**: Implement a `SupabaseFriendsRepository` to replace the mock implementation.
5. **Community Backend**: Create API endpoints for community posts and stories to replace frontend mocks.
6. **Clean Up**: Remove duplicate migrations and the `out.json` file.
