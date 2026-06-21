# IP2 Week 6 Group 11 Problems

## Legend

`AP: Ang Panha`
`BS: Bun Sengleang`
`ST: Sek Thorn`
`SA: Samnang Alex`
`HS: Hak Sengkea`
`SM: Sophal Mengchhiv`

`**: Everyone`
`??: Not Determined`
`!!: On Hold`

`CAUSE: the person who caused this`

`FIXER: the person who'll fix this`

## Backend (NestJS API)

### Configuration & Environment

- `[CAUSE/FIXER-AP][RESOLVED]` **Missing `.env.example` file**: The SETUP.md references `cp .env.example .env` but the file doesn't exist in the workspace
- `[CAUSE-ST][FIXER-AP][RESOLVED]` **Inconsistent Supabase configuration**: supabase.service.ts in API uses hardcoded environment variables, while it should use the ConfigService from the root
- `[CAUSE/FIXER-AP][RESOLVED]` **TypeScript strict mode partial**: `noImplicitAny` is set to `false`, contradicting other strict settings

### Data Layer Issues

- `[CAUSE/FIXER-SM]` **Budget service using in-memory storage**: budget.service.ts stores data in a local array instead of Supabase, making data non-persistent and unsuitable for multi-instance deployment
- `[CAUSE/FIXER-??]` **Misaligned database schema and migrations**: Multiple migrations exist with duplicate tables (two `create_temp_table.sql` files) and unclear naming conventions
- `[CAUSE/FIXER-SM]` **Missing DTO validation on Budget**: create-budget.dto.ts has no validation decorators for required/optional fields

### Incomplete Module Implementations

- `[CAUSE/FIXER-HS]` **Friends module incomplete**: Contains dependency injection setup for `FriendsRepository` but implementation files missing (`friends.repository.ts`, `friendship-status.enum.ts`)
- `[CAUSE/FIXER-ST]` **Profiles module minimal**: Only implements `getById` endpoint; missing create, update, delete operations
- `[CAUSE/FIXER-ST]` **Auth module incomplete**: No token refresh mechanism, no logout endpoint, minimal profile integration after registration
- `[CAUSE/FIXER-SA]` **Reviews module incomplete**: Service file cut off at line 47; full implementation unclear
- `[CAUSE/FIXER-BS]` **Itinerary module questionable logic**: `getItinerary` has a fallback query that fetches all days without trip filtering (lines 18-27)

### API Inconsistencies

- `[CAUSE/FIXER-**]` **Generic return types**: Multiple controllers use `Promise<any>` instead of typed DTOs (auth.controller.ts lines 11, 18)
- `[CAUSE/FIXER-ST]` **Missing error handling**: Auth controller has no HTTP error response decorators; all exceptions handled implicitly
- `[CAUSE/FIXER-SM]` **Inconsistent endpoint patterns**: Budget uses integer IDs while destinations/reviews use UUIDs

---

## Frontend (Vue 3 + Vite)

### Incomplete Page Components

- **Empty placeholder pages**:
  - `[CAUSE/FIXER-ST]` ProfilePage.vue - completely empty
  - `[CAUSE/FIXER-SA]` ExplorePage.vue - completely empty  
  - `[CAUSE/FIXER-HS]` CommunityPage.vue - completely empty
  - `[CAUSE/FIXER-BS]` TripPlannerPage.vue - completely empty
- `[CAUSE/FIXER-**]` **Router path mismatch**: Router imports from `../pages/` and `@/core/pages/` but some referenced files don't exist

### Module Structure

- `[CAUSE/FIXER-**]` **Missing API integration**: Client modules have no actual API calls to backend; uses hardcoded data (stores/homepage.ts has mock data)
- `[CAUSE/FIXER-**]` **Missing auth stores**: No Pinia store for authentication state management
- `[CAUSE/FIXER-**]` **Route guard missing**: Router has no authentication guards despite auth routes existing

### Testing & Configuration

- `[CAUSE/FIXER-!!]` **Outdated test placeholder**: e2e/vue.spec.ts references "You did it!" which doesn't exist in App.vue
- `[CAUSE/FIXER-!!]` **Mismatched test assertion**: **tests**/App.spec.ts expects text that isn't in the actual App.vue template
- `[CAUSE/FIXER-!!]` **Missing .oxlintrc.json**: ESLint config references `.oxlintrc.json` file that doesn't exist

### UI Issues

- `[CAUSE/FIXER-**]` **Hardcoded mock data**: All frontend displays use hardcoded destination, event, and weather data with no API binding

---

## Monorepo Structure

### Documentation

- `[CAUSE/FIXER-AP!!]` **Duplicate migration files**: Supabase migrations include two `create_temp_table.sql` files (different timestamps, unclear purpose)
- `[CAUSE/FIXER-AP!!]` **Incomplete/stale README**: API/client READMEs lack comprehensive setup, testing, and deployment instructions
- `[CAUSE/FIXER-AP!!]` **Deleted placeholder folders**: deleteme and deleteme directories should be removed

### Build Configuration

- `[CAUSE/FIXER-AP!!]` **Inconsistent TypeScript versions**:
  - API: `^5.7.3`
  - Client: `~5.9.3`
  - Supabase package: `^6.0.3` (unusually high, likely a typo)
- `[CAUSE/FIXER-AP!!]` **Node version mismatch**: Root/API require `>=21`, but client requires `^20.19.0 || >=22.12.0`
- `[CAUSE/FIXER-AP!!]` **Type checking tool inconsistency**: API uses `tsc` while client uses `vue-tsc`

### Database

- `[CAUSE/FIXER-**!!]` **Missing table definitions**: Referenced tables (`budgets`, `friends`, `itinerary_trips`) not defined in migrations
- `[CAUSE/FIXER-**!!]` **RLS policies incomplete**: Only `destinations` has RLS policy migration; other tables missing security definitions
- `[CAUSE/FIXER-!!]` **Stale migrations**: `20260507000106_remote_schema.sql` purpose unclear

### Package Management

- `[CAUSE/FIXER-AP!!]` **Unresolved dependency**: `build` package in supabase `dependencies` (v0.1.4) is unclear—likely should be in `devDependencies`
- `[CAUSE/FIXER-AP!!]` **pnpm workspace allowBuilds**: Whitelists specific packages that may not need it; could indicate build issues

### Out-of-Scope Files

- `[CAUSE/FIXER-??]` **Binary artifact**: out.json is a UTF-16 encoded file (likely generated output); should be in .gitignore

---

## API Integration & Data Flow

### Critical Missing Links

- `[CAUSE/FIXER-**]` Frontend has **zero integration** with backend endpoints; all data is mocked
- Auth endpoints exist but client has no auth service to call them
- `[CAUSE/FIXER-**]` No API client configuration for cross-origin requests
- `[CAUSE/FIXER-**]` CORS is enabled with wildcard (`true`) in development, creating security issues

### Supabase Setup

- `[CAUSE/FIXER-AP!!]` Package generation requires manual `pnpm -F @repo/supabase build` step not automated
- `[CAUSE/FIXER-??]` Database types (database.types.ts) only defines `user` table; other tables missing from schema
