# CUSTOM SETUP

Here, I will only show you how to test supabase connection.

## 1. ENV

### LOCAL

make sure you're in the `apps/api` directory:

```sh
cd apps/api
```

copy the env example into your `.env` file:

```sh
cp .env.example .env
```

note: don't delete `.env.example`; it's for future reference and source control.

### SUPABASE WEBSITE

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

## 2. SETUP & STARTUP

```sh
pnpm i
pnpm -F api start:dev`
```

### 3. TEST

in a separate terminal:

```sh
curl http://localhost:3000/test-connection
```

expected: a json with `"msg": "ok"`
