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

The funnel is fully walkable **without** Supabase credentials - the lead API
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
    scoring.ts            computeScore() - two-axis logic + safety override
    bands.ts              Band thresholds + worse-of-two helpers
    persona.ts            Persona detection
    drivingFactors.ts     "What's driving this" pills (risk-axis only)
  config/                 Editable content (Audrey iterates here, not in code)
    questions.ts          Question bank - ALSO the single source of scoring weights
    funnelFlow.ts         Ordered flow + conditional pruning resolver
    statCards.ts          The 3 cited stat cards
    copy.ts               ALL user-facing copy + persona framing
    compliance.ts         Mandatory disclaimers + banned-language patterns
  state/                  Funnel state machine (reducer) + useFunnel hook
  components/             Screens, result sub-components, UI primitives
tests/                    Vitest: engine, flow resolution, compliance
```

The engine and config are **decoupled from React** so they're importable in tests
without a DOM. Screens render from config - copy is never hard-coded.

## Scoring (canonical: `src/engine/`)

Max score **100** = Risk Factor Score (68) + Symptom Signal (32). Weights live in
`src/config/questions.ts` (`option.score`) and natively sum to 100 (the build
brief §5 weights scaled x4). Two-axis safety logic: the final band is the
**worse** of the total, risk-axis, and symptom-axis bands - lifestyle can never
mask symptoms. **Safety override**: if the decline is persistent *and*
someone else has noticed, the band is forced to a minimum of *Elevated*.

Risk bands (on the **risk** total): `0–25` Low · `26–50` Moderate · `51–75`
Elevated · `76–100` High.

**The displayed Brain Health Score is inverted**: `score = 100 − riskTotal`, so
**higher = healthier** (low risk → high score). Bands still classify risk, so a
high score maps to the Low band.

## /event-v3 partner consent page

`/event-v3` asks for the partner's (IHH Healthcare Singapore) consent on its
own page, from Figma "Option 2", between the landing and the instructions - so
it is answered before the demo round and the game. `/ihhsearegatta` carries the
same page, in the same place. An event with no partner in it, like
`/rotaryklwam`, has no such page. The landing keeps its own
two consents (contact, which still gates the challenge, and the brain-health
tips opt-in); the partner's wording is not a tickbox on the landing.

IHH supplied its three clauses as one all-or-nothing agreement, so the page
carries **one tick** covering all three (`Event3Consent.tsx`), with the
withdrawal right stated below it as text rather than as something to agree to.

**The tick does not gate the CTA.** Play is never blocked by a marketing
consent, so "I'm ready!" always continues; what the player chose is recorded
either way in `partner_consent` (see Supabase below), which is what makes a
decline a stored decline rather than an abandoned session.

The partner logo is not in the repo: drop it at `public/ihh-logo.png` (the
design uses roughly 60x40) and it appears beside the GMS lockup. Until then
that slot renders nothing rather than a broken image.

## Closing the v3 challenge temporarily

`EVENT3_CHALLENGE_CLOSED` (`src/config/event.ts`, currently **on**) closes the
Reaction Time Challenge and the leaderboard it feeds without taking `/event-v3`
down. While it is on, the funnel runs the landing and the partner consent page
as usual and then ends on the "That's a wrap!" screen (Figma
`Event3Wrap.tsx`) - so a printed QR code or poster still lands somewhere
deliberate. The instructions, game, questionnaire and report sit behind it and
are simply unreachable, so no new score can be posted and the board's standings
stop moving.

It is not `EVENT3_PAUSED`, which takes the whole route down to the generic
"challenge has ended" holding screen instead. Use that to close the route; use
this to close the challenge.

**To reopen:** set it to `false` and redeploy. The full arc comes straight
back. Closing is applied when the flow is *resolved*, not to the variant's flow
itself, so the question set, `achievableAxisMax` and the comparability of every
score already recorded are untouched by the switch either way (pinned by
`tests/config/event3Flow.test.ts` and `tests/config/event3Closed.test.ts`).
`/event-v6`, `/rotaryklwam` and `/ihhsearegatta` ignore the switch and keep
walking the whole flow.

**Nothing is recorded from a closed session.** The lead is written when the
report is built and the score after the game, and neither is reachable - so the
name, email and consents taken on the way to the wrap screen are not stored
anywhere. That is deliberate: the landing's required consent is about results
and a prize, and while the challenge is closed there are neither.

## /rotaryklwam (Rotary KL-WAM)

`/rotaryklwam` runs the same Daylight Ember arc as `/event-v3`, for an event
with no partner in it. Three differences, and nothing else:

- **No partner consent page.** The landing leads straight into the instructions
  and their demo round. Nothing asks for a partner consent, so
  `partner_consent` is written as `null` on both the score and the lead - "we
  never asked", the same three-state contract as everywhere else.
- **No "That's a wrap!" screen.** `EVENT3_CHALLENGE_CLOSED` closes the DBS
  challenge only: the close is applied per variant in `resolveFlow`, so it
  cannot reach across into this event (pinned by
  `tests/config/rotaryFlow.test.ts`).
- **The landing's required consent** leads with a bold "Required." instead of
  the parenthetical "(Required)", and keeps the privacy link in body colour.
  That is the only copy that differs; `COPY.screens.rotary.splash` spreads
  `DAYLIGHT_SPLASH` and overrides the one line.

Its **question set is exactly event2's**, like v3's, which is what keeps a
Rotary score comparable with every score already recorded (`achievableAxisMax`
sums a variant's question steps - see the note in `config/funnelFlow.ts`).

**The board is at `/rotaryklwam/leaderboard`**, and is the v3 board with the
prize card dropped: two columns instead of three, with the standings taking the
width the prize card had, so long names sit unclipped. The scan rail keeps its
width, and so its QR size. `ROTARY_PAUSED` (`src/config/event.ts`) is its own
pause switch, independent of every other event's.

Scores and reports are tagged `rotaryklwam` (`ROTARY_SOURCE`), so the board
ranks only this event - see **Supabase** below.

## /ihhsearegatta (IHH SEA Regatta)

`/ihhsearegatta` runs the `/event-v3` arc, partner consent page included (IHH
is the partner at this event too). Three differences, and nothing else:

- **The link is open.** There is no "That's a wrap!" screen:
  `EVENT3_CHALLENGE_CLOSED` closes the DBS challenge only, and is applied per
  variant in `resolveFlow`, so it cannot reach across into this event (pinned
  by `tests/config/ihhseaFlow.test.ts`). `IHHSEA_PAUSED`
  (`src/config/event.ts`) is its own pause switch.
- **A redesigned bridge card** on the post-game result: it opens on the
  player's own wish ("I want to be faster…"), turns it on the organ nobody
  tracks, and ends on **"Tell me more"** instead of "Continue to report".
  `COPY.screens.ihhsearegatta.gameResult` spreads `DAYLIGHT_GAME_RESULT` and
  overrides that card, so `/event-v3`, `/rotaryklwam` and the `/event-v6`
  preview keep the card they had.
- **A questionnaire invite behind that CTA** (`Event3QuizInvite.tsx`), between
  the post-game result and the first question: the offer - two free minutes for
  a personalised report - over a sample of that report. The quiz is accepted or
  declined here rather than on the result card: **"Sure!"** walks into the
  questionnaire, **"Not now"** ends the session on the closing screen (the same
  path `/event-v2` declines onto).

The sample report on the invite is drawn from the real report's own components
(`ScoreHeader`, `BigScore`, `Gauge`) at 0.4 scale, which is the factor the
design itself uses, and its band is derived from the sample score by the
engine - so the picture can never contradict the report it is a picture of.

Its **question set is exactly event2's**, like v3's: the invite is not a
question step, so a regatta score stays comparable with every score already
recorded (`achievableAxisMax` sums a variant's question steps - see the note in
`config/funnelFlow.ts`).

**The board is at `/ihhsearegatta/leaderboard`**, rebuilt to Figma 629:4815:
the pitch on the left - brain, headline, the scan block and an ember prize
panel for the **Garmin Forerunner 165** (GPS Running Smartwatch, worth $379) -
against the live standings on the right, over the fact strip and a band of
event photography.

Its uploaded assets live at the root of `public/`, and every one of them is
optional: each is settled through `decode()` (see `OptionalImage` and
`ScanCode`), so a file that is missing or misnamed is an absent photo rather
than a broken-image icon, and appears the moment it lands.

| file | what it is |
| --- | --- |
| `regatta-qr.png` | the scan code. Drawn from `PLAY_URL` instead when absent, so the board always has a way in. Carries its own frame, so the board adds none. |
| `garmin-forerunner-165-white.png` | the prize render on the panel |
| `garmin-forerunner-165-black.png` | the earlier black colourway, kept |
| `regatta-band-1.jpg`, `regatta-band-2.png`, `regatta-band-3.jpg` | the photo band along the bottom, in the design's 491:833:833 widths |

A code that is uploaded is trusted as-is: nothing here can check what it
encodes, so a code for the wrong URL is a wrong code.

Scores and reports are tagged `ihhsearegatta` (`IHHSEA_SOURCE`), so the board
ranks only this event - see **Supabase** below.

## /event-v6 (preview)

`/event-v6` walks exactly the v3 flow, and exists only to compare consent
treatments: it splits the partner's clauses into one tickbox each (the first of
which gates its CTA), against the single tick that v3 ships. `/event-v5`
previews the same wording on the landing instead of on a page of its own.

**It is a walkthrough and writes nothing.** The variant is listed in
`PREVIEW_VARIANTS` (`src/config/variants.ts`), which is the single switch every
write path checks - lead, score, newsletter opt-in, and `lib/analytics` itself,
so not even an anonymous step event is sent. The route is `noindex`, and a small
"Preview · not saved" badge sits on every screen.

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
  tips_consent boolean,             -- brain health tips consent, null = never asked
  partner_consent boolean,          -- partner (IHH) consent, null = never asked
  source       text,                -- which event this report came from
  user_agent   text
);

-- add these columns if the table already existed:
alter table public.leads add column if not exists game_time_ms integer;
-- brain-health-tips consent; nullable on purpose (see below):
alter table public.leads add column if not exists tips_consent boolean;
-- partner (IHH) consent from the /event-v3 consent page; nullable for the same
-- reason as tips_consent:
alter table public.leads add column if not exists partner_consent boolean;
-- which event the report came from, matching game_scores.source:
alter table public.leads add column if not exists source text;
create index if not exists leads_source_idx on public.leads (source);

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
  time_ms    integer not null,
  source     text,                -- which event this score was played at
  tips_consent boolean,           -- brain health tips consent, null = never asked
  partner_consent boolean         -- partner (IHH) consent, null = never asked
);
create index on public.game_scores (created_at);
create index on public.game_scores (email);
create index on public.game_scores (source);

-- add these to an existing table (safe: nullable, no backfill, no deletes):
alter table public.game_scores add column if not exists source text;
create index if not exists game_scores_source_idx on public.game_scores (source);
alter table public.game_scores add column if not exists tips_consent boolean;
alter table public.game_scores add column if not exists partner_consent boolean;

-- Reads/writes go only through the server API routes (service-role key).
alter table public.game_scores enable row level security;
```

**`source` scopes a board to one event.** Every score is tagged with the event
it was played at (`"event"`, `"event2"`, `EVENT3_SOURCE`, `ROTARY_SOURCE` or
`IHHSEA_SOURCE` from `src/config/event.ts`), and `/api/leaderboard?source=...`
filters to it. The v3, Rotary and regatta boards, and the in-funnel rank chip on
each, pass their own tag; the v1 and v2 boards send no `source` and so keep
ranking every row, history included.

**Rotary KL-WAM uses `rotaryklwam`** (`ROTARY_SOURCE`) and **the IHH SEA
Regatta uses `ihhsearegatta`** (`IHHSEA_SOURCE`), so neither event's rows ever
mix with a DBS board's or with each other's. Both tags are pinned by
`tests/config/leaderboardSource.test.ts`, since a collision would be silent -
no error, just the wrong standings on a TV at an event.

**DBS (1-2 Sep) runs both days on `dbs-day1`** - one leaderboard carrying
across the two days, so day 2 opens on day 1's standings. `DBS_DAY2_SOURCE`
exists for the next event that wants a fresh board; point `EVENT3_SOURCE`
(`src/config/event.ts`) at it and redeploy to start one.

To start a **fresh board** at any later v3 event, change `EVENT3_SOURCE` to a new
string. Older scores keep their old tag and stay in the table - they just stop
appearing on the board. Nothing is ever deleted. Rows written before the column
existed carry `null` and never match a filter.

The leaderboard shows **today's best time per email** (Singapore time), fastest
first. Players may retry; only their best counts.

**`leads.source` carries the same event tag as `game_scores.source`**, which is
what makes the board's completion stat possible: `GET /api/report-rate?source=…`
counts unique emails in `game_scores` for that bucket (people who played) and
unique emails in `leads` for the same bucket (people who got their report), and
returns the percentage. Only people who actually played count, so a lead with no
score at that event cannot push the rate above 100%, and a player who retries the
game counts once.

The `/event-v3` board polls it every 30s for the "N% folks got their brain health
report" tile. The tile stays hidden until at least `MIN_PLAYERS_FOR_RATE`
(`src/lib/reportRate.ts`) people have played - early in an event a single
unfinished quiz would otherwise read as "0% folks got their report".

**`tips_consent` records the brain health tips consent** as a three-state value:
`true` (ticked), `false` (left unticked), or `null` when we never asked - every
row written before this column existed, and any event whose landing page has no
such checkbox. It is deliberately nullable and never backfilled, so old data is
not silently read as a decline.

Where each value comes from:

- **Landing page** (`/event-v3`, `/rotaryklwam`, `/ihhsearegatta`): the "Send
  me occasional brain health tips and updates" checkbox rides along with the
  name + email capture and is written to both `game_scores.tips_consent` (with
  the score) and `leads.tips_consent` (with the lead).
- **Report page**: ticking the tips opt-in inserts into `newsletter_optins` as
  before, and now also stamps `leads.tips_consent = true` on that email's rows.
  The opt-in can only turn consent on; there is no un-tick in the UI.

**`partner_consent` records the partner (IHH) consent** from the `/event-v3`
and `/ihhsearegatta` consent page, on the same three-state contract: `true`
(ticked), `false` (left unticked), or `null` when we never asked - every row
written before this column existed, and every variant with no consent page.

The value is taken once, on the consent page between the landing and the
instructions, and carried in funnel state for the rest of the session, so it is
written twice: to `game_scores.partner_consent` with the score (which is the
only row a player who stops after the game leaves behind) and to
`leads.partner_consent` with the report. Nothing else can change it - there is
no second opt-in for it anywhere in the funnel, and no path that turns a
decline into a `true`.

Both writes are tolerant of a database that does not have the column yet: the
insert is retried without it, so a lead or a score is never lost to a pending
migration.

And a `funnel_events` table for **anonymous drop-off analytics** (no PII - a
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

And a `quiz_responses` table for **anonymous audience insights** - a
participant's demographics, brain-health profile and risk-factor answers,
written when the score is computed. **No name or email** (keyed to the random
session id only), so it's aggregate-only and can't identify a person:

```sql
create table public.quiz_responses (
  id            bigint generated always as identity primary key,
  created_at    timestamptz not null default now(),
  session_id    text not null,
  variant       text,            -- 'full' | 'event'
  age           text,            -- e.g. '40-49'
  sex           text,
  band          text,            -- low | moderate | elevated | high
  persona       text,
  risk_score    integer,
  symptom_score integer,
  total_score   integer,         -- 0-100
  game_time_ms  integer,         -- reaction-game time (event)
  answers       jsonb            -- full per-question map (lifestyle, biomedical, etc.)
);
create index on public.quiz_responses (created_at);
create index on public.quiz_responses (band);

-- Writes go only through the server API route (service-role key).
alter table public.quiz_responses enable row level security;
```

Example queries: band mix `select band, count(*) from quiz_responses group by band`;
age split `select age, count(*) ... group by age`; a lifestyle factor
`select answers->>'sleep' as sleep, count(*) ... group by 1`; speed vs profile
`select band, round(avg(game_time_ms)) ... group by band`.

And a `party_scores` table for the standalone `/party` game (sober vs
after-drinks reaction-time leaderboard; `drinks = 0` is a sober run):

```sql
create table public.party_scores (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name       text not null,
  drinks     integer not null default 0,
  time_ms    integer not null
);
create index on public.party_scores (time_ms);

-- Reads/writes go only through the server API route (service-role key).
alter table public.party_scores enable row level security;
```

`/party` reads/writes via `/api/party` (GET all attempts, POST one, DELETE to
reset). Every phone feeds this one table and the board polls every 5s, so a
tablet/TV left on `/party` shows the live leaderboard. A join QR on the board
points guests at `/party`.

Env vars (see `.env.example`): `NEXT_PUBLIC_SUPABASE_URL`,
`SUPABASE_SERVICE_ROLE_KEY` (server only - never `NEXT_PUBLIC`), and
`STORE_ANSWERS` (PDPA-safe default: raw answers are **not** persisted unless this
is `"true"`).

## Working defaults flagged for sign-off (build brief §12)

The scoring *engine* (weights, bands, safety override) is settled. These surface
choices use working defaults - encoded as named constants so they're a one-line
change once Audrey / clinical sign off:

- **Per-axis band thresholds** for the worse-of-two comparison (`src/engine/bands.ts`).
- **Q15 "what do you track" options + persona cut-offs** (`src/config/questions.ts`, `src/engine/persona.ts`).
- **Names / labels / copy** (`src/config/copy.ts`) - "Brain Health Score", band labels, bridge wording, price, etc.

## Out of scope (this build)

The booking destination (paywall CTA), the Accenture reaction-time game (§10,
deliberately separate from the score), and the React Native production port.
