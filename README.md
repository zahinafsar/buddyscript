# BuddyScript

### 1. Install dependencies

```bash
npm install
```

### 2. Start Postgres + MinIO

```bash
docker compose up -d
```

### 3. Configure environment

Copy the example env into `.env.local`:

```bash
cp .env.example .env.local
```

Then set `AUTH_SECRET` to a random 64-char hex value:

```bash
openssl rand -hex 32
```

### 4. Apply the database schema

```bash
npx drizzle-kit push
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
