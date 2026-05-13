# SUPABASE SETUP

## DIRECTORY CHANGE

```sh
cd packages/supabase
```

reason: requires to be in the supabase package to run the scripts below.

## LOGIN

make sure you have a supabase account and is connected to the team's supabase database.

then use the command below to login. you will be prompted to press `ENTER` to go to the website.

then on the website, they will give you a verification code, which you will enter in the cli.

```sh
pnpm supabase login
```

## REFERENCE

now you must link the database to your environment.

```sh
pnpm supabase link --project-ref uhfjmbvbnuhotlnxdvgj
```

## NEW MIGRATION

now, create your new migration. 

```sh
pnpm supabase migration new <migration-name>
```

`migration-name`: what the migration does. recommended for only table management, not row.

check with:

```sh
pnpm supabase migration list
```

you may notice that your local migration list has some missing migrations from remote.

## FETCH REMOTE MIGRATION

you must fetch the remote migrations to fix synchronization.

```sh
pnpm supabase migration fetch
```

then press `Y`.

now, check your migration list again:

```sh
pnpm supabase migration list
```

now it has the same initial history.

## PUSH LOCAL MIGRATION

now, you push your new migration to the remote db.

```sh
pnpm supabase db push
```

then apply your migration by pressing `Y`.

## REMOTE DATABASE VERIFICATION

go to the supabase website at our team database and check the database for the migration application.

you should see your new tables or changes there.
