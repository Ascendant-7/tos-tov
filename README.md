# តោះទៅ Cambodia - Trip Planner

## About Repository

This repository is about a trip-planner web application that is currently in development by 6 4th-year ITC students as a school project for the course, Internet Programming II.

Our goal is to help journey lovers plan their trips in advance or on-the-go, route their journeys from their starting location to their destinations as well as pinpointing stops along the way.

Plan your trips and add friends in the mix! Post about it! All in one application.

## Members

| No | Name | ID | Role |
| -- | ---- | -- | ---- |
| 1 | Ang Panha | e20221707 | Team Lead |
| 2 | Bun Sengleang | e20220889 | Member |
| 3 | Sek Thorn | e20220341 | Member |
| 4 | Samnang Alex | e20220253 | Member |
| 5 | Hak Sengkea | e20220175 | Member |
| 6 | Sophal Mengchhiv | e20221053 | Member |

## Installation

Make sure to have these!

- [Node.js](https://nodejs.org/) (V22.12.0 to V25)
- [pnpm](https://pnpm.io) (v10.33.0 or HIGHER)

Clone this repository and install its dependencies:

```bash
git clone https://github.com/Ascendant-7/tos-tov
cd tos-tov
pnpm install
```

## Configuration

### Environment Variables

```bash
cp apps/client/.env.example apps/client/.env
cp apps/api/.env.example apps/api/.env
```

#### Supabase

setup your [supabase](https://supabase.com) project.

open your `apps/client/.env` and `apps/client.env` and copy these from your supabase project:

- `SUPABASE_URL` or `PROJECT_ID`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

#### OPENROUTE

get your api key from [openroute-service](https://openrouteservice.org).

copy the API key and set it in `apps/client/.env`: `VITE_OPENROUTESERVICE_API_KEY`

### SUPABASE LOGIN

you need to have created your [supabase](https://supabase.com) account on the website in order to login via cli.

```bash
pnpm -F @repo/supabase supabase login
```

then grab your project ID/reference from the website and link your database to this project:

```bash
pnpm supabase link --project-ref <YOUR_PROJECT_REF>
```

## Usage

```bash
pnpm -w dev
```

## Features

We bring to you many features that you'll find reliable:

- destination browsing
- trip planning with destinations and routes
- suggest trips by budget
- add friends and invite to trips
- post about your trips

## Tech Stack

This project is built as a monorepo using [pnpm workspaces](https://pnpm.io/workspaces).

### Core Technologies

- **Runtime**: [Node.js](https://nodejs.org/)
- **Language**: [Typescript](https://www.typescriptlang.org/)
- **Package Manager**: [pnpm](https://pnpm.io/)

### Infrastructure & Tooling

- **Frontend**: [Vue.js](https://vuejs.org/)
- **Backend**: [Nest.js](https://nestjs.com/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Formatting/Linting**: [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/)

## Workflow & Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for rules on branching, commit frequency (min 1 commit per 3 days), and merging.
