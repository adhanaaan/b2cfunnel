# Brain Health Quiz

A free, consumer-facing brain health quiz for **Gray Matter Solutions (GMS)**. A
lead magnet that estimates a user's brain health profile and routes them to the
paid ReCOGnAIze neurologist consult. Single KPI: quiz completion → booked consult.

> This is an **educational / wellness** tool, deliberately on the wellness side of
> the Singapore HSA line. It does not diagnose. See `src/config/compliance.ts`.

## Stack

- **Next.js 15** (App Router) + **TypeScript** + **Tailwind CSS**
- Scoring engine: **canonical in TypeScript**, pure & deterministic, unit-tested with **Vitest**
- Lead capture: **Supabase** via a server-only API route
- Design system: **Clinical Empathy** (Plus Jakarta Sans, 8px roundness, primary `#f77528`)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase keys (optional for local dev)
npm run dev                  # http://localhost:3000
```

The funnel is fully walkable **without** Supabase credentials — the lead API
no-ops gracefully when keys are absent.

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run test` | Run the Vitest suite (engine + flow + compliance) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | Next/ESLint |

## Architecture

```
app/                      Thin routing layer
  page.tsx                Mounts <Funnel/>
  api/lead/route.ts       POST -> Supabase insert (service key, Node runtime)
src/
  engine/                 Scoring engine (pure TS, the source of truth)
    scoring.ts            computeScore() — two-axis logic + safety override
    bands.ts              Band thresholds + worse-of-two helpers
    persona.ts            Persona detection
    drivingFactors.ts     "What's driving this" pills (risk-axis only)
  config/                 Editable content (Audrey iterates here, not in code)
    questions.ts          Question bank — ALSO the single source of scoring weights
    funnelFlow.ts         Ordered flow + conditional pruning resolver
    statCards.ts          The 3 cited stat cards
    copy.ts               ALL user-facing copy + persona framing
    compliance.ts         Mandatory disclaimers + banned-language patterns
  state/                  Funnel state machine (reducer) + useFunnel hook
  components/             Screens, result sub-components, UI primitives
tests/                    Vitest: engine, flow resolution, compliance
```

The engine and config are **decoupled from React** so they're importable in tests
without a DOM. Screens render from config — copy is never hard-coded.

## Scoring (canonical: `src/engine/`)

Max score **100** = Risk Factor Score (68) + Symptom Signal (32). Weights live in
`src/config/questions.ts` (`option.score`) and natively sum to 100 (the build
brief §5 weights scaled x4). Two-axis safety logic: the final band is the
**worse** of the total, risk-axis, and symptom-axis bands — lifestyle can never
mask symptoms. **Safety override**: if the decline is persistent *and*
someone else has noticed, the band is forced to a minimum of *Elevated*.

Bands by total: `0–24` Low · `25–52` Moderate · `53–76` Elevated · `77–100` High.

## Supabase

Create a `leads` table:

```sql
create table public.leads (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  email        text not null,
  name         text,
  persona      text,
  risk_score   numeric,
  symptom_score numeric,
  total_score  numeric,
  band         text,
  answers      jsonb,
  user_agent   text
);

-- add this column if the table already existed:
alter table public.leads add column if not exists game_time_ms integer;

-- RLS on, with NO anon insert policy: writes happen only through the server
-- route using the service-role key, so the public key can never write.
alter table public.leads enable row level security;
```

And a `game_scores` table for the event Reaction Time Challenge leaderboard:

```sql
create table public.game_scores (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text not null,
  email      text not null,
  time_ms    integer not null
);
create index on public.game_scores (created_at);
create index on public.game_scores (email);

-- Reads/writes go only through the server API routes (service-role key).
alter table public.game_scores enable row level security;
```

The leaderboard shows **today's best time per email** (Singapore time), fastest
first. Players may retry; only their best counts.

And a `funnel_events` table for **anonymous drop-off analytics** (no PII — a
random per-session id, the step name and the variant):

```sql
create table public.funnel_events (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  session_id text not null,
  event      text not null,       -- e.g. 'step_view', 'hook_declined'
  step       text,                -- e.g. 'question:age', 'leaderboard'
  variant    text                 -- 'full' | 'event'
);
create index on public.funnel_events (created_at);
create index on public.funnel_events (session_id);

-- Writes go only through the server API route (service-role key).
alter table public.funnel_events enable row level security;
```

A `step_view` row is written each time a participant reaches a step, plus a
`hook_declined` row when they opt out of the brain-health check. To see the
funnel, count **distinct `session_id` per `step`** (ordered by where each step
sits in the flow); the gap between consecutive steps is your drop-off.

Env vars (see `.env.example`): `NEXT_PUBLIC_SUPABASE_URL`,
`SUPABASE_SERVICE_ROLE_KEY` (server only — never `NEXT_PUBLIC`), and
`STORE_ANSWERS` (PDPA-safe default: raw answers are **not** persisted unless this
is `"true"`).

## Working defaults flagged for sign-off (build brief §12)

The scoring *engine* (weights, bands, safety override) is settled. These surface
choices use working defaults — encoded as named constants so they're a one-line
change once Audrey / clinical sign off:

- **Per-axis band thresholds** for the worse-of-two comparison (`src/engine/bands.ts`).
- **Q15 "what do you track" options + persona cut-offs** (`src/config/questions.ts`, `src/engine/persona.ts`).
- **Names / labels / copy** (`src/config/copy.ts`) — "Brain Health Score", band labels, bridge wording, price, etc.

## Out of scope (this build)

The booking destination (paywall CTA), the Accenture reaction-time game (§10,
deliberately separate from the score), and the React Native production port.
