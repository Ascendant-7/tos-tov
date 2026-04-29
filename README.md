# CUSTOM SETUP

## API

### ENV

#### 1. LOCAL

make sure you're in the `apps/api` directory:

```sh
cd apps/api
```

copy the env example into your `.env` file:

```sh
cp .env.example .env
```

note: don't delete `.env.example`; it's for future reference and source control.

#### 2. SUPABASE WEBSITE

next, go to my supabase organization. if you haven't join, give me your email so I can add you.

once you're invited, go to the `tos-tov` project.

as you can see in the `.env.example`, you need two variables:

- `PROJECT_ID` to fill in `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

1. `PROJECT_ID`

  sidebar: project settings > general > project id

1. `SUPABASE_ANON_KEY`

  sidebar: project settings > api keys > publishable keys > default

  fill those into your `.env`

## CLIENT

none at the moment

## DEPENDENCIES

install your dependencies:

```sh
pnpm i
```

## STARTUP

start up both API and client using my script:

```sh
pnpm -w dev
```
