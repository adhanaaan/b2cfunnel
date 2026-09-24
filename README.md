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
it is answered before the demo round and the game. `/ihhsearegatta` asks for
the same consent on its **landing** instead, as a third row under the landing's
own two (see below), so it has no consent page. An event with no partner in
it - `/rotaryklwam`, `/ntuhomecoming` - has neither. The landing keeps its own
two consents everywhere (contact, which still gates the challenge, and the
brain-health tips opt-in).

IHH supplied its three clauses as one all-or-nothing agreement, so the page
carries **one tick** covering all three (`Event3Consent.tsx`), with the
withdrawal right stated below it as text rather than as something to agree to.
The wording is defined once, in `IHH_CONSENT_CLAUSES` / `IHH_CONSENT_WITHDRAWAL`
(`src/config/copy.ts`), and read by both the v3 page and the regatta landing.

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
`/event-v6`, `/rotaryklwam`, `/ntuhomecoming` and `/ihhsearegatta` ignore the
switch and keep walking the whole flow.

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

## /ntuhomecoming (NTU Homecoming)

`/ntuhomecoming` is `/rotaryklwam` under a different name and a different
leaderboard bucket. Same Daylight Ember arc, same three differences from
`/event-v3` (no partner consent page, no "That's a wrap!" screen, the bold
"Required." consent row), same question set - so an NTU score stays comparable
with every score already recorded.

It is shared rather than copied, wherever sharing is what keeps the two arcs
from drifting apart: `NTU_HOMECOMING_FLOW` *is* `ROTARY_FLOW`, so a later change
to that arc reaches this event too, and both landings read the same
`NO_PARTNER_SPLASH` copy. What each event holds of its own is the part that must
not be shared - its bucket, its pause switch, its route, and a copy block
(`COPY.screens.ntuhomecoming.splash`) so this event's wording can be changed
without touching Rotary's (pinned by `tests/config/ntuHomecomingFlow.test.ts`).

**Its bucket is the point of the route.** `NTU_HOMECOMING_SOURCE` is the literal
`ntuhomecoming` - the value written to the `source` column on both
`game_scores` and `leads` - so its board ranks only this event and nothing
played here can move a board another route is still showing. Changing the
literal strands every row already written under it, so it is pinned to the
string, not just to "something non-empty". `NTU_HOMECOMING_PAUSED` is likewise
its own switch.

**The board is at `/ntuhomecoming/leaderboard`**: the Rotary board pointed at
this bucket, with its QR built from `playUrlFor("ntuhomecoming")` so a scanned
code lands on this event's link rather than another's.

`/22grams` runs this same arc again on a bucket of its own - see below.

## /ihhsearegatta (IHH SEA Regatta)

`/ihhsearegatta` runs the `/event-v3` arc (IHH is the partner at this event
too), with these differences and nothing else:

- **Every consent is on the landing** (Figma 638:7729; `Event3Splash.tsx` with
  `design="ihhsearegatta"`). Under the two rows every daylight landing has -
  the required contact consent, led by a bold "Required.", and the tips
  opt-in - sits a third: IHH's three clauses and the withdrawal right under
  **one tick**, the same block the v3 consent page shows. It is optional, like
  the tips opt-in; what the player chose rides along with the name + email
  capture into `partner_consent`. There is **no consent page** in this arc, so
  the landing leads straight into the instructions - the page is taller than a
  phone screen and scrolls (`Event3Shell` in `scroll` mode) rather than
  squeezing the hero.
- **Its own privacy policy** at `/ihhsearegatta/privacy-policy`, behind the
  "Privacy Policy" link in the required row. The general `/privacy-policy`
  cannot serve this event: the regatta shares name, email, results, quiz
  answers and score with IHH under the consent above, and its policy says so -
  what GMS's policy covers and what IHH's notice does, the sharing itself, and
  whose retention and deletion apply to which copy. Both policies are data in
  `src/config/privacyPolicy.ts` (the sections they share are defined once) and
  rendered by `PrivacyPolicyDocument.tsx`. `COPY.screens.*.splash.privacyHref`
  is where each landing's link goes.
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

## /phkl (Pantai Hospital Kuala Lumpur)

`/phkl` is the `/ihhsearegatta` arc rebuilt for an IHH Healthcare Malaysia
event, from Figma "New Flow" (`697:26004`), so that the quiz is no longer
optional. The flow, in order:

```
landing -> speed primer -> select your age -> instructions -> game
-> great job (auto) -> quiz primer -> the quiz (age already answered)
-> analysing -> report
```

- **Every consent is on the landing**, as on the regatta (`Event3Splash.tsx`
  with `design="phkl"`): the required contact consent, the tips opt-in, and
  IHH Healthcare **Malaysia**'s three clauses plus the withdrawal right under
  one tick (`PHKL_CONSENT_CLAUSES` in `src/config/copy.ts`, linking
  `ihhhealthcare.com/my/data-protection-notice` and the Malaysian DPO). The
  PHKL rows use a 20px box and 12.5px text; the design flags the older
  18px/10px row as failing WCAG 2.5.5 and 1.4.3. The third clause still
  refers to a "Do-Not-Call registry", a Singapore PDPA term, for the partner
  to confirm.
- **Its own privacy policy** at `/phkl/privacy-policy`: the regatta's policy
  with the partner renamed, both built by `partnerPolicySections()` in
  `src/config/privacyPolicy.ts`, so the only thing that can differ between
  the two is the partner named in them.
- **The age question moves before the game** (`ageSelect`, its own step
  kind, rendered by `PhklAgeSelect.tsx` on the daylight backdrop). The
  answer is `answers.age`, exactly as the quiz's own question would store
  it, and `questionIdsIn()` counts the step as the age question, so
  `achievableAxisMax("phkl")` equals event2's and a PHKL score stays
  comparable with every score recorded (`tests/config/phklFlow.test.ts`).
  The quiz progress bar does not count it: the first question after the
  primer is "Question 1 of N". The band is also written to
  `game_scores.age_band` with the score (see Supabase below).
- **A primer either side of the game** under a GAME / BRAIN HEALTH QUIZ /
  RESULTS rail (`PhklProgressRail.tsx`): what processing speed is
  (`PhklSpeedIntro.tsx`) before the age question, and "your brain speed
  isn't fixed" (`PhklQuizIntro.tsx`) before the first question.
- **No post-game card and no invite.** After the 20th match, "Great job in
  measuring your speed!" (`PhklGreatJob.tsx`) shows the symbols rocking in a
  slow wave and walks itself into the quiz primer after 2.4 seconds (a tap
  does it sooner; reduced motion shortens the hold and stops the loop).
- **The report** (`PhklResultScreen.tsx` and `phkl/result/*`): the time,
  rank and fastest-so-far header (the standing and share-card logic is
  shared with the post-game card through `useStanding` and `useShareCard`),
  then what processing speed is, "speed was not the only thing we looked
  at" (the trend chart, a four-band risk meter, the factor chips, the Lancet
  45% and the three actions), "you've only covered 2 out of 5" (a radar with
  speed and risk filled from the player's standing and score), the Memory
  Screening Package at Pantai Hospital KL, a testimonial and the close.
  **"Retry game" and "Book memory screening" stay pinned to the bottom of
  the screen** the whole way down. Retry replays the game and the reducer
  brings the player straight back to the report with the new time
  (`GAME_DONE` jumps to `result` once the report exists; the score does not
  depend on the game, so it is kept), and the header reads "2nd record".
  Every booking button opens `PHKL_BOOKING_URL` (`src/config/eventLinks.ts`),
  **a placeholder** for Pantai KL's screening packages page until the real
  booking link arrives, and fires a `booking_click` event with its placement.
- `PHKL_PAUSED` (`src/config/event.ts`) is its own pause switch. There is no
  challenge-closed switch: the arc is open for as long as the route is up.

Scores and reports are tagged `phkl` (`PHKL_SOURCE`). **The board is at
`/phkl/leaderboard`**: the Rotary/NTU board pointed at this bucket.

Images under `public/images/phkl/`. Every one is optional: while a file is
missing the page draws a fallback in its place (never a broken image) and
picks the file up the moment it lands.

| file | what it is | until it lands |
| --- | --- | --- |
| `memory-screening-package.png` | the Pantai Memory Screening Package poster (358x630, RM460); drop a 2x export, 716x1260 | the poster's content drawn in HTML |
| `quiz-intro-sleep.jpg`, `quiz-intro-exercise.jpg`, `quiz-intro-diet.jpg` | the three factor photos on the quiz primer | warm gradient tiles under the captions |
| `screening-devices.png` | the digital cognitive assessment on a phone, a tablet and a laptop | `/landing/woman-tablet.png` |
| `report-1.png`, `report-2.png` | two pages of the full report | the frame is left out |

The Grab gift box and coupon on the `/phkl` board are not in this folder. They
are the shared renders in `public/images/general/` (`src/config/prizeArt.ts`),
which every board with a Grab prize draws.

## /phkl-3 (Pantai Hospital KL, third activation)

`/phkl-3` is `/phkl-2` again: `/phkl`'s arc (`PHKL3_FLOW = PHKL_FLOW`), the IHH
Healthcare Malaysia partner block and consent on the landing, the English /
中文 / Bahasa Melayu picker, and the report ending on the Memory Screening
Package. What it holds of its own:

- **Its bucket**, `PHKL3_SOURCE = "phkl-3"`, so its board opens empty and ranks
  only this activation. **Its own pause switch**, `PHKL3_PAUSED`.
- **Its privacy-policy link**, `/phkl-3/privacy-policy` (`/phkl`'s policy,
  served on this route).
- **Its board**, at **`/phkl-3/leaderboard`**, built to Figma `892:7134`. It is
  the frame the Siloam summit board was built to, in ringgit: the prize panel
  names the total and then the ladder, from `PHKL3_PRIZE`
  (`src/config/phkl3.ts`):

| | |
| --- | --- |
| 1ST | RM 150 voucher |
| 2ND | RM 100 voucher |
| 3RD | RM 50 voucher |

As on the summit, the headline's "RM 300" is summed from the ladder, and the
"Top 3" and the three gradient rows read the ladder's length
(`tests/config/phkl3Flow.test.ts`).

Its QR artwork, when there is one, goes in `public/images/phkl-3/qr.png` (see
the README there), never `/images/phkl/`. The design's own code is the `/phkl`
one. Until the file lands, the board generates a code for the production
`/phkl-3` URL. The gift box and the voucher stack are the shared files in
`public/images/general/`.

## /mambacares/leaderboard (the #MambaCares board)

The TV board for the GMS x #MambaCares community run, built to Figma
`813:19115` against a 1920x1080 panel. Same construction as the other boards -
one design unit `--u` = `min(100vw / 1920, 100vh / 1080)`, every size the
design's px times it, so a 16:9 screen of any resolution is the frame exactly
and everything stacks below 1024px or in portrait.

**The board is at `/mambacares/leaderboard`.** `/mambacare/leaderboard` (and
`/mambacare`) redirect to the plural, since both spellings get written down.

What differs from `/phkl/leaderboard`:

- **Fifteen rows, not six**: the leader on a wide white hero row with the time
  to beat, then ranks 2-15 in two columns of seven. The prize copy ("Top 15
  fastest minds") is written from `TOP_N`, so it cannot promise a depth the
  board does not show. Unclaimed slots are dashed "Play to claim this spot"
  rows - fifteen of them at the start of the day.
- **The QR is the donation, not the game.** It encodes
  `MAMBACARES_DONATION_URL` (`src/config/mambacares.ts`), the same short link
  every Donate button on the report opens, so the board and the funnel cannot
  point at two campaigns. An uploaded `board/donate-qr.png` overrides it -
  whatever that file encodes is where the money goes, and nothing in the code
  can check it.
- **The prizes are the run's.** The sponsor lines are data at the top of the
  page (`PRIZE_SPONSORS` - "From PMAM, SALTIFY, PRFM, 2050, Sunday Shades, and
  more!"), and the drop itself is one composed image, `board/prize-drop.png`,
  fitted into the frame's artwork box - the way `/phkl` takes its Grab render.
  Changing the prizes is a re-export of that one file, not a component edit.
- **`MAMBACARES_PAUSED` only closes the prizes.** The panel becomes "That's a
  wrap" with the number of minds tested; the donation card and the standings
  stay up, because the campaign runs to its own deadline.
- A new entry in the **top 3** takes the board over for four seconds. Three
  rather than fifteen on purpose: a top-15 takeover would fire on nearly every
  early play and then never again.

Standings and the completion stat come from `/api/leaderboard` (every 8s) and
`/api/report-rate` (every 30s), both scoped to the `mambacares` bucket
(`MAMBACARES_SOURCE`); the last good values stay on screen through an error.

Images under `public/images/mambacares/board/` - **that folder's README lists
every file, its box on the board and the size to export it at**. All of them
are optional: the board draws without any of them and picks each up the moment
it lands. The band along the bottom edge is the exception, and needs nothing
uploaded: it reuses the regatta board's three photos from the repo root, as
`/phkl` does, at the widths this frame shows of each.

## /urbanmilers (GMS x Urban Milers)

`/urbanmilers` is the `/mambacares` arc on a leaderboard of its own: the same
landing with no partner on it (but with `/22grams`' one-tick consent in place
of the two ticks - the same `ONE_TICK_CONSENT_FORM` block), the same primers either side of the game, the
same questionnaire, and the same report ending on the Dementia Singapore
fundraiser. The flow array is shared (`URBANMILERS_FLOW = MAMBACARES_FLOW`), so
the question set, `achievableAxisMax` and therefore every score recorded stay
comparable with `/mambacares`, `/phkl` and event2
(`tests/config/urbanmilersFlow.test.ts`).

What this run holds of its own is the part that must not be shared:

- **Its own bucket.** Scores and reports are tagged `urbanmilers`
  (`URBANMILERS_SOURCE`), so **the board opens empty** - fifteen unclaimed
  rows - instead of on #MambaCares' standings, and neither run can rank the
  other's players. Nothing is deleted to get there: every row already recorded
  keeps the tag it was written with. To clear this board later (a second run
  day), give `URBANMILERS_SOURCE` a new value and redeploy.
- **Its own board**, at `/urbanmilers/leaderboard` (Figma 1080:8131): three
  columns - a generated "Scan to play" code that opens `/urbanmilers`, the
  prize card (Novablast 6, Grab, Starbucks) and the 15-row standings, with its own
  artwork folder
  (`public/images/urbanmilers/board/`, whose README lists every file and its
  size). Every file there is optional, so the board is live and correct before
  any of them land.
- **Its own pause switch**, `URBANMILERS_PAUSED` (`src/config/event.ts`).
- **Its own words**, `COPY.screens.urbanmilers`. They are #MambaCares' copy with
  this run named wherever the wording names the event that is hosting it (the
  wordmark, the share sheet, the campaign's opening line). The shared screens
  read them through `runCopyFor(variant)`, so a change to either run's wording
  cannot reach the other's page.

**The campaign is deliberately still #MambaCares'.** This run raises for the
same Dementia Singapore fundraiser, so `src/config/urbanmilers.ts` starts with
that campaign's donation link, thermometer figures, crew and sponsor logos and
photographs - which is what makes the report read correctly the day the route
goes up rather than showing an empty fundraiser. Each is an independent value in
that one file: point any of them somewhere else and only `/urbanmilers` moves.
The screens read them through `communityRunFor(variant)`
(`src/config/communityRun.ts`), which is the same rule `arcCopyFor` applies to
the words - one run's link or total must never be printed on the other's page,
because both are read off a phone at a finish line.

## /siloamneurosciencesummit (Siloam Neuroscience Summit)

The `/phkl` arc run in Indonesia, and the first Indonesian event on this
funnel. The flow array is shared (`SILOAM_FLOW = PHKL_FLOW`), so the question
set, `achievableAxisMax` and therefore every score recorded stay comparable
with `/phkl`, `/mambacares` and event2 (`tests/config/siloamFlow.test.ts`).

```
landing (+ language) -> speed primer -> select your age -> instructions -> game
-> great job (auto) -> quiz primer -> the quiz -> analysing -> report
```

What this event holds of its own:

- **A language choice.** The landing opens on a two-pill picker, **English or
  Bahasa Indonesia**, and the choice carries through every screen behind it:
  the primers, the game and its guided tour, all fourteen questions, the
  analysing beat and the whole report, share sheet included. See
  **Translations** below.
- **`/22grams`' landing** (`Event3Splash.tsx` with `design="siloam"`): the
  no-partner landing at the roomier 20px/12.5px size, with that event's
  **one-tick consent** - the player confirms whose answers these are, and the
  line beneath states that registering is itself the newsletter consent. It is
  the *same* `ONE_TICK_CONSENT_FORM` object `/22grams` uses, not a copy, so a
  wording change reaches both; `tests/config/siloamPrivacyPolicy.test.ts` holds
  the two landings equal bar the policy each links. Plus the language picker,
  which `/22grams` has no need of.
- **NTU Homecoming's call to action at the end** (`SiloamOffer.tsx`), in place
  of `/phkl`'s Memory Screening Package: the ReCOGnAIze assessment as the next
  step, and the team at the booth to take it from there. **No price, no poster
  and nothing to click through to** - there is no Indonesian booking link, and
  a button that opened the Malaysian form would be worse than no button. The
  sticky bar (`SiloamStickyCta.tsx`) scrolls to that section rather than
  opening anything. Everything above it is the `/phkl` component, shared:
  header, speed explainer, risk section, baseline radar, wrap-up.
- **Its own report statistic**, `COPY.screens.siloam.report.stat` (and its
  Bahasa Indonesia twin in `config/copy.id.ts`). **AWAITING THE INDONESIAN
  FIGURE**: until it lands, both say the *global* Lancet 45%, which is true in
  Indonesia as everywhere else, so the report is correct on the day the route
  goes up. Change both, or the summit quotes one number in English and another
  in Bahasa Indonesia.
- **Its own bucket**, `siloam` (`SILOAM_SOURCE`), so the board opens empty and
  ranks only this event. The arc is `/phkl`'s, so this tag is the *only* thing
  keeping Kuala Lumpur's standings off a screen in Jakarta. To clear the board
  for a second summit day, give it a new value (`"siloam-day2"`) and redeploy.
- **Its own pause switch**, `SILOAM_PAUSED`. There is no challenge-closed
  switch; the arc is open for as long as the route is up.

**The board is at `/siloamneurosciencesummit/leaderboard`**, built to Figma
`892:7134`: the `/phkl` board pointed at this bucket, with that frame's
**prize ladder** in place of a single headline figure.

The prizes are client-confirmed and live in `SILOAM_PRIZE`
(`src/config/siloam.ts`):

| | |
| --- | --- |
| 1ST | IDR 300k voucher |
| 2ND | IDR 200k voucher |
| 3RD | IDR 100k voucher |

**Nothing on the panel is a number typed twice.** The amounts are stored as
numbers of thousands; the headline total (`IDR 600k`) is *summed* from them,
the eyebrow's "Top 3" and the three gradient rows in the standings both read
`SILOAM_PODIUM_N`, which is the ladder's own length. So the headline cannot
promise a pot the rows underneath it do not add up to, and the panel cannot
promise a depth the standings do not rank
(`tests/config/siloamFlow.test.ts`). Changing a prize, or adding a fourth,
is one edit in that config.

Two deliberate departures from the frame:

- **The QR is not the design's.** `892:7164` is the `/phkl` code; using it
  would send players at an Indonesian summit to the Kuala Lumpur funnel. The
  board generates its own against the production route.
- **The headline is set at 37px, not the frame's 41px.** The frame was set
  with "RM 300 Grab Vouchers"; "IDR 600k Grab Vouchers" is longer and at 41px
  overruns the design's 448px box onto a third line. 37px holds the designed
  two-line break at a size indistinguishable from it across a room.

The board is **in English**, copy and brain facts alike, while the funnel
behind its QR code can be read in either language. That is the brief
("leaderboard is the same as /phkl"), not an oversight: the board shows names
and times, and the language belongs to the player holding the phone rather than
to the room. `BRAIN_FACTS` is the one block of prose on it, and is the first
thing to translate if that changes.

The QR artwork goes under `public/images/siloam/` - **that folder's README
lists it, its box in the frame and what stands in until it lands**. The Grab
gift box and the tilted e-voucher stack (`892:7176`, `892:7220`) are the shared
renders in `public/images/general/` (`src/config/prizeArt.ts`), the same files
the `/phkl` boards draw. All optional; the board is live and correct before any
of them land. The three quiz-primer photos are read from `/images/phkl/`
(generic sleep/exercise/diet shots, shared rather than duplicated).

## /22grams (22 Grams)

Sharp Shot Week at 22g Frasers Tower. `/22grams` runs the **`/mambacares`
arc** - which is `/phkl`'s - and closes on the **`/siloamneurosciencesummit`
report**. The flow, in order:

```
landing -> speed primer -> select your age -> instructions -> game
-> great job (auto) -> quiz primer -> the quiz (age already answered)
-> analysing -> report
```

The flow array is shared (`TWENTY_TWO_GRAMS_FLOW = MAMBACARES_FLOW`), so the
question set, `achievableAxisMax` and therefore every score recorded stay
comparable with `/mambacares`, `/phkl` and event2
(`tests/config/twentyTwoGramsFlow.test.ts`). Its landing is #MambaCares' - the
plain two-row consent at the roomier size, no partner block - and there is no
post-game card, no questionnaire invite and no closing page: the report is the
end of the arc.

**The report is the summit's, not the fundraiser's.** `/mambacares` and
`/urbanmilers` end on the Dementia Singapore campaign; this event ends the way
`/siloamneurosciencesummit` does - the ReCOGnAIze assessment and a conversation
with the team - drawn by the same `SiloamOffer` and `SiloamStickyCta`. There is
nothing to check out of at a coffee counter, which is the same reason the
summit has no button. `usesMambaScreens("22grams")` is therefore **false**, and
pinned so: that helper is what picks the fundraising report, and this event runs
#MambaCares' steps without its screens.

**Each event reads its own words.** `arcCopyFor`, `phklReportFor` and
`boothReportFor` are all keyed on the variant, so the two events on the booth
report cannot print each other's close - the summit sends readers to a stand
ten metres away, and this one is a coffee counter in Singapore. The close in
`COPY.screens["22grams"].report.offer` is **a working default for sign-off**,
seeded from the summit's (which is NTU Homecoming's): it promises a
conversation and names nothing this activation cannot deliver. `offer.cta` is
the line to settle first, because it is the only one that says where that
conversation happens.

**Its landing takes one tick, not two.** `splash.consentForm` (this event's
block alone) replaces the two rows every other daylight landing carries: a
heading, one tick confirming whose answers these are, and - **stated rather
than asked** - that registering is the consent to be emailed. Submitting the
form therefore records the newsletter consent as given, because that is what
the line under the tick says it does. `Event3Splash` renders one shape or the
other, never both, driven by the copy block rather than by the design name, so
the landing that carries the words is the landing that gets the block
(`tests/config/twentyTwoGramsFlow.test.ts` pins that no other event has it).
The Privacy Policy link is kept on the tick's row, as on every other landing.

**Its bucket is the point of the route.** `TWENTY_TWO_GRAMS_SOURCE` is the
literal `22grams` - the value written to the `source` column on both
`game_scores` and `leads` - so its board opens empty rather than on another
event's standings, and nothing played here can move a board another route is
still showing. No row already recorded is touched to get there: rows keep the
tag they were written with. Changing the literal strands every row already
written under it, so it is pinned to the string, not just to "something
non-empty" (`tests/config/leaderboardSource.test.ts`). To clear this board for a
second event day, give it a new value - `22grams-day2` - and redeploy.
`TWENTY_TWO_GRAMS_PAUSED` is likewise its own switch, and the score endpoint
reads it per source, so pausing this event never drops another's results.

**The board is at `/22grams/leaderboard`, and it is the horizontal `/phkl`
frame** (Figma 739:10645) rather than the NTU board: the pitch on the left - the
brain, the headline, the scan block and the ember panel - the live standings on
the right, six rows with a three-deep gradient podium, then the fact strip and
the band of event photography. Its QR is built from `playUrlFor("22grams")`, so
a scanned code lands on this event's link rather than another's, and it polls
`/api/leaderboard` and `/api/report-rate` scoped to the `22grams` tag. The ember
panel carries the event's three steps; **the free drink is not on it yet** - see
the note under Sharp Shot Week below.

Board artwork under `public/images/22grams/board/` - **that folder's README
lists the one file, its box in the frame and what stands in until it lands**.
It is optional: with no `qr.png` there the board generates its own code from the
play URL, so the board is live and correct before anything is uploaded.

### Sharp Shot Week (the free-drink pop-up)

**Beat the clock and the poster takes over the screen.** A run under
`SHARP_SHOT_THRESHOLD_MS` (30s) on `/22grams` opens the Sharp Shot poster over
whatever step is showing, built to **Figma 925:9236**: a 340x536 ember card
with the campaign lockup, "Congratulations on beating the clock < 30 s", the
offer beside the drink, the UK Biobank line, and the three details a barista
reads - **the player's name, the time in plain seconds ("28.5 seconds"), and
the moment the run ended ("2026-09-21 12:35:00")**.

**The whole poster is the close** ("tap anywhere to close"), so nothing sits on
top of anything that has to be read. The backdrop is a real button, which is
what carries that to a keyboard and a screen reader; Escape works too.

**The report's pinned call to action is this event's own** (Figma 925:9246): a
floating card with the drink breaking out of its top-left corner, "Beat the
clock < 30 s, Get a free drink!" and **Retry Game**, popping in rather than
sliding up. Every other event on this report walks the reader down to its
close; this one sends them back to the game, because what is still on offer at
Sharp Shot Week is a free drink for a faster run - whether they missed it or
could beat it again. `SharpShotStickyCta` replaces `SiloamStickyCta` for this
variant only, and the report buys the extra clearance its taller card needs
rather than the shared section growing for every other event.

**It carries two cards and turns between them every five seconds**
(942:11389): the retry offer, and `GmsFollowCard`. One slot, because the report
has room for one pinned thing and both have a claim on it - the drink is why
they played, and GMS is who they would not otherwise learn about. They
cross-fade rather than swapping through an empty slot, which on a pinned bar
would read as the page losing its button, and the turn pauses while a pointer
or the keyboard is on the banner so nobody loses a button mid-reach.

One deliberate departure from that frame: the design layers the cut-out over
"*while redemption last", leaving only the part of that line clear of the cup
showing. Here the line sits in front of the cup instead - it is the one line on
the card that qualifies what is being promised, and a promise half-hidden
behind a coffee cup is worse than a broken layer order.

**The close answers a tap.** `offer.cta` is "I'm interested" and
`offer.ctaThanks` is what replaces it once tapped - and the presence of that
second string is what makes the line a BUTTON at all. The summit leaves it out,
because it has nowhere to send anyone and its team is in the room, so its line
stays the instruction it reads as. The tap fires an `interest_click` event
(anonymous, like every other `track` call), so the interest is countable rather
than a button that does nothing.

The threshold is **one number** (`src/config/twentyTwoGrams.ts`) and every
label on the poster AND on the report's banner is written from it, because the poster IS the voucher: a
headline promising `< 30 s` beside a funnel applying something else is a
barista holding a screenshot nobody can honour. `isSharpShot()` is the only
thing that answers "did this run earn a drink?", it is strictly less than the
threshold (30.0s does not qualify - the poster says *beating* the clock), and a
missing, zero or negative time is never a win. The venue named in the offer is
the same single value. Pinned by `tests/config/sharpShot.test.ts`.

**The funnel raises it, not a screen.** This arc has no post-game card at all -
the 20th match walks straight into the "great job" beat and on into the quiz -
so there is no screen for the poster to hang off, and one hung off the beat
would unmount with it mid-celebration. `Funnel.tsx` mounts it above whichever
step is showing, so it appears the moment the run is recorded and stays until
it is dismissed. `tests/config/twentyTwoGramsFlow.test.ts` pins the absence of
a `gameResult` step, because that is the assumption behind the mount point.

**It is gated on the variant as well as the time**, so no other event can hand
out this one's offer, and on the finish rather than a flag: a retake that beats
the clock again has a new `gameFinishedAt`, so it raises a fresh poster, while
dismissing one does not immediately reopen it.

**The stamp is the run's own moment, not the render's.** `GAME_DONE` carries
`at` (the caller reads the clock; the reducer stays pure) and the funnel stores
it as `gameFinishedAt`, cleared by `RETAKE_GAME` with the time it belongs to.
Reopening the poster therefore cannot restamp it. `formatStamp` writes it from
the local date parts rather than through `toLocaleString`, whose output moves
with the device's locale - a stamp reading `21/09/2026` on one phone and
`9/21/2026` on the next is one staff cannot check at a glance.

**`/22grams/poster-preview` shows it without a qualifying run.** The poster only
appears under 30 seconds, which makes it awkward to review: checking the
wording or the artwork would otherwise mean beating the clock every time. That
page opens the real component with whatever name, time and moment are typed in,
and its time box is deliberately not limited to qualifying runs - it reports,
for the number given, whether the funnel would have raised the poster, so the
29.9 / 30.0 boundary can be seen rather than argued about. It writes nothing:
no score, no lead, no analytics, and it is `noindex`.

**The free drink is not on the leaderboard yet.** The board's ember panel
carries the event's three steps, from when this route had no prize; the offer
now lives only on the poster. If it should be on the wall too, `HowItWorksPanel`
in `app/22grams/leaderboard/page.tsx` is the panel to change, and
`SHARP_SHOT_THRESHOLD_LABEL` is where the "< 30 s" has to come from.

**Gray Matter Solutions has its own band on it** (Figma 942:11120, the revised
frame). The card is redeemed at a partner's counter and names 22g three times
over, so the house that built the test carries: the lockup at the top left -
`/gms-ntu-logo.png`, the one this build already ships, whited out with
`brightness-0 invert` because the file is the dark version every other screen
puts on cream and this card is white-on-ember (the same treatment
`Event2Splash` and `Event3Wrap` give it, so there is no second copy to keep in
step) - and the **"follow us" card** across the foot: the Instagram code,
"World Alzheimer's Month", "Follow for more brain health events" and the
address.

That card is `GmsFollowCard`, and it is a component because two surfaces show
it: this band, and every other five seconds on the report's pinned banner. Both
hand it a box and it fills what it is given, so the two cannot drift into
different cards. Its address is printed AND encoded, derived from `GMS_SITE_URL`
in `config/eventLinks.ts` so a reader cannot be shown one place and sent to
another. **The code is a tap target as well as a scan target** - it links to
`GMS_INSTAGRAM_URL`, which is also what the fallback code encodes, because the
person holding the phone the card is on cannot scan their own screen.

**Both links stop the click there.** On the poster this card sits inside a
takeover that closes on a tap ANYWHERE, and that takeover is the voucher:
opening Instagram must not also throw away the thing they came to redeem.
Tapping anywhere else on the card, or Escape, still closes it. Its code is the one file this poster still needs - see
`public/images/22grams/README.md`; until it lands the card draws a plain code
for the same profile, so it is scannable from the day it ships.

**How it is built.** The card draws in the design's own pixels: one unit,
`--p`, is one design pixel - the card scaled to fill the width inside a 20px
gutter, capped at 1.25x so a 340px card does not balloon on a desktop, and
giving way to the height on a short screen. `--p` is a LENGTH rather than a
unitless scale (the same idiom the TV boards use for `--u`), because CSS cannot
divide a length by a length to get a ratio. Everything else is the project's
own: the ember gradient is the one the bridge card and the speed popup already
use, the text colour is the `cream` token (which is exactly the design's
`cream/base`), and the dashes are `#fde68a`, the Processing Speed light tone.
The lockup's face (Lexend Zetta) is imported in the component rather than the
root layout, so only this screen pays for it.

Its two images are optional like every other in this build - the wordmark falls
back to type and the drink to a drawn cup - so the poster is correct and
redeemable before either lands. **Both are exports the design already has**
(`image 322` and `image 323` on that node); see
`public/images/22grams/README.md` for their boxes.

## /general

The Reaction Time Challenge with no event's name on it - the route to point a
one-off activation at when there is no partner, no prize and no country in the
brief. `/general` runs the **`/siloamneurosciencesummit` arc** (which is
`/phkl`'s) and closes on that event's booth report. The flow, in order:

```
landing -> speed primer -> select your age -> instructions -> game
-> great job (auto) -> quiz primer -> the quiz (age already answered)
-> analysing -> report
```

The flow array is shared (`GENERAL_FLOW = PHKL_FLOW`, the same array the summit
takes), so the question set, `achievableAxisMax` and therefore every score
recorded stay comparable with the summit's, `/phkl`'s and event2's
(`tests/config/generalFlow.test.ts`). There is no post-game card, no
questionnaire invite and no closing page: the report is the end of the arc.

**Three things are deliberately not the summit's.**

- **No language choice.** The summit is the only multilingual event on this
  funnel; `/general` is English-only like every other route, so `app/general/page.tsx`
  mounts no `LanguageProvider`, `offersLanguageChoice("general")` is **false**
  and pinned so, and `copyFor("general", …)` hands back the `COPY` object
  itself in every language rather than a merged copy of it. Nothing about the
  translation layer is reachable from this route.
- **The landing is `/22grams`'** - the plain landing at the roomier size with no
  partner block, and the **one-tick consent** (`splash.consentForm`): a heading,
  one tick confirming whose answers these are, and - stated rather than asked -
  that registering is the consent to be emailed. The block is the *same object*
  the summit and `/22grams` carry, not a copy, so one wording change reaches all
  three (asserted by identity in `tests/config/twentyTwoGramsFlow.test.ts`). It
  links the **shared** `/privacy-policy`, not the summit's Indonesian notice:
  there is no country-specific policy to link from a route with no country in
  its name, and inheriting one would be worse than linking none.
- **The board is `/ntuhomecoming`'s**, not the summit's prize board: the scan
  rail on the left and the live standings on the right, eight rows with the
  leader on the gradient, then the fact strip and the footer. There is no prize
  on this route, so there is no prize panel and the space buys full names on
  every row instead. Its QR is built from `playUrlFor("general")` and it polls
  `/api/leaderboard` and `/api/report-rate` scoped to the `general` tag. It is a
  copy of that board rather than a shared component, as every board in this app
  is: an event screen is the thing most likely to be redesigned mid-run, and two
  events must never be able to change each other's TV.

**The report is the summit's**, drawn by the same `SiloamOffer` and
`SiloamStickyCta` - the ReCOGnAIze assessment and a conversation with the team,
with no price and nothing to click through to. It has no `ctaThanks`, so the
call to action stays the line it reads as rather than becoming a button: this
route makes no promise to follow up that whoever is running it has not made.
`offer.cta` ("Speak to our team at the booth") is **the line to settle per
activation** - it is the only one that says where that conversation happens.
Its headline statistic is the shared Lancet card read from `config/statCards.ts`
rather than typed out, because unlike the summit's this one is not holding a
slot for a country figure.

**Each event still reads its own words.** `arcCopyFor`, `reportStatFor`,
`phklReportFor` and `boothReportFor` are all keyed on the variant, so the three
events on the booth report cannot print each other's close.

**Its bucket is the point of the route.** `GENERAL_SOURCE` is the literal
`general` - the value written to the `source` column on both `game_scores` and
`leads` - so its board opens empty rather than on another event's standings, and
nothing played here can move a board another route is still showing. Rows keep
the tag they were written with; changing the literal strands every row already
written under it, which is exactly how a second event day gets a fresh board
(give it `general-day2` and redeploy). `GENERAL_PAUSED` is likewise its own
switch, and the score endpoint reads it per source, so pausing this route never
drops another's results.

No board artwork is needed: this board generates its own QR from the play URL
and carries no prize image.

## Translations (English and Bahasa Indonesia)

One event uses this today, and the whole layer is **inert for every other**:
nothing else mounts `LanguageProvider`, so `useLanguage()` returns `"en"` and
`copyFor()` hands back the `COPY` object **itself**, not a merged copy of it.
That identity is asserted in `tests/config/siloamLanguage.test.ts` and is the
containment argument for the whole feature.

| Piece | Where |
| --- | --- |
| The language list and the storage key | `src/config/language.ts` |
| The picker on the landing | `src/components/screens/siloam/LanguagePicker.tsx` |
| The choice, and the hooks screens read it through | `src/components/LanguageContext.tsx` |
| Bahasa Indonesia copy (overlay) | `src/config/copy.id.ts` |
| Bahasa Indonesia questions (words only) | `src/config/questions.id.ts` |
| Bahasa Indonesia actions | `src/config/actions.ts` |
| The merge | `src/lib/deepMerge.ts` |

How it works, and the rules that matter:

- **The list is English and Bahasa Indonesia, and only those two.** The
  ReCOGnAIze assessment offers Mandarin and Bahasa Melayu; neither belongs at
  an Indonesian summit, and the test pins the list so neither can come back
  through a shared edit.
- **A translation is an overlay, not a second config.** Anything it leaves out
  renders in English rather than as a blank - the failure mode worth designing
  for, because it is the one that happens at an event. Screens no Indonesian
  player reaches (the paywall, the booking page, the community-run report) are
  deliberately untranslated.
- **Arrays replace whole, never element by element.** A list of consent clauses
  or report paragraphs only reads correctly as a set; a per-index merge would
  leave one English paragraph inside an Indonesian block. Translate a list in
  full or leave it in English.
- **A translation changes WORDS AND NOTHING ELSE.** `questions.id.ts` carries
  no ids, no axes, no `showIf` and no scores: `questionsFor()` replaces prompts
  and option labels on the English bank and copies every number and branch
  across untouched. An Indonesian player and an English one with the same
  answers get the same score, on the same scale as every score already
  recorded. Same for `pickActions`: the language changes the three lines, never
  which three.
- **Screens read `useCopy()` / `useArcCopy()` / `usePhklReportCopy()`**, never
  `COPY` directly, wherever they can be reached in more than one language.
  `arcCopyFor(variant, copy)` and `phklReportFor(variant, copy)` are what keep
  a shared component from naming one event's block - without them the summit's
  report would print Pantai Hospital's words.
- **The privacy policy is NOT machine-translated.** It is what people are
  consenting to, and it stays in English until reviewed Indonesian text is
  supplied with the UU PDP rewrite.
- Adding a language: add it to `LANGUAGES`, add an overlay to
  `COPY_BY_LANGUAGE` and (optionally) `QUESTIONS_TEXT_BY_LANGUAGE`, add a row
  to `ACTION_TABLES`, and check `ordinalFor` in `lib/format.ts` handles how
  that language builds "2nd".

## The Siloam summit's privacy policy (Indonesia's UU PDP)

`/siloamneurosciencesummit/privacy-policy` is **the one document on this site
not written against Singapore's PDPA**. That event runs in Indonesia, so its
policy is written against **UU No. 27 Tahun 2022 tentang Pelindungan Data
Pribadi** ("UU PDP"), in `src/config/privacyPolicyIndonesia.ts`. Every other
policy still links the PDPA text in `config/privacyPolicy.ts`, and a test holds
that separation.

**It is served in Bahasa Indonesia and English, and opens in Indonesian.** That
is not a nicety: art. 22 requires a request for consent to be put in Indonesian
and to be plainly understandable, and this document is what the landing's
consent row points at. The toggle is local state on the page - it deliberately
does *not* inherit the funnel's language, because the consent row opens the
policy in a new tab and a new tab's `sessionStorage` is a copy at best.

It is not the general policy with a country swapped. Each section exists to
answer something the UU PDP requires and the PDPA does not:

| What the UU PDP requires | Where it lands |
| --- | --- |
| Health data is **specific** personal data (art. 4(2)) | §2 names the quiz answers and the Brain Health Score as such, rather than listing them as one row of five |
| A **lawful basis per purpose** (art. 20(2)) | §3 pairs every purpose with its basis instead of resting everything on consent |
| **Broader rights** (arts. 5-13): erasure, restriction, portability, objection to automated processing, compensation | §7 lists all of them; none has a PDPA equivalent |
| **Automated processing** may be objected to (art. 10) | §10 answers it directly, because a Brain Health Score *is* automated processing |
| Breach notified within **3 x 24 hours** (art. 46) | §9 commits to that, not to "as soon as practicable" |
| **Cross-border transfer** conditions (art. 56) | §6 exists only because GMS is in Singapore, so every record this event takes leaves Indonesia immediately |
| **Extraterritorial reach** (art. 2) | §1 says why a Singapore company is in scope at all |
| Children need parental consent (art. 25) | §11 |

**Still owed: legal review.** The text is accurate about what the funnel does
(`/api/lead`, `/api/score`, `/api/newsletter`, `/api/response`) and about the
statute it names, but it is a legal document and an Indonesian practitioner has
to sign it off before the event. Put these two in front of them first, because
they are what a request or a complaint gets measured against:

1. the retention periods in `config/privacy.ts`, and
2. the consent wording on the landing (`ONE_TICK_CONSENT_FORM`).

`tests/config/siloamPrivacyPolicy.test.ts` is not legal review and does not
pretend to be. It holds the failures nobody would see on the page: the wrong
statute named, a right or a deadline dropped, one language drifting out of step
with the other, or a contact address the rest of the site no longer answers on.

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
  partner_consent boolean,        -- partner (IHH) consent, null = never asked
  age_band     text               -- age band asked before the game (/phkl), null = never asked
);
create index on public.game_scores (created_at);
create index on public.game_scores (email);
create index on public.game_scores (source);

-- add these to an existing table (safe: nullable, no backfill, no deletes):
alter table public.game_scores add column if not exists source text;
create index if not exists game_scores_source_idx on public.game_scores (source);
alter table public.game_scores add column if not exists tips_consent boolean;
alter table public.game_scores add column if not exists partner_consent boolean;
-- the age band chosen before the game (/phkl), an option id of the `age`
-- question such as "40-49"; null where the funnel never asked:
alter table public.game_scores add column if not exists age_band text;

-- Reads/writes go only through the server API routes (service-role key).
alter table public.game_scores enable row level security;
```

**`source` scopes a board to one event.** Every score is tagged with the event
it was played at (`"event"`, `"event2"`, `EVENT3_SOURCE`, `ROTARY_SOURCE`,
`NTU_HOMECOMING_SOURCE` or `IHHSEA_SOURCE` from `src/config/event.ts` -
`eventSource(variant)` is the single place that mapping lives), and
`/api/leaderboard?source=...` filters to it. The v3, Rotary, NTU and regatta
boards, and the in-funnel rank chip on each, pass their own tag; the v1 and v2
boards send no `source` and so keep ranking every row, history included.

**Rotary KL-WAM uses `rotaryklwam`** (`ROTARY_SOURCE`), **NTU Homecoming uses
`ntuhomecoming`** (`NTU_HOMECOMING_SOURCE`) and **the IHH SEA Regatta uses
`ihhsearegatta`** (`IHHSEA_SOURCE`), so no event's rows ever mix with a DBS
board's or with each other's. The two community runs are split the same way -
**`mambacares`** (`MAMBACARES_SOURCE`) and **`urbanmilers`**
(`URBANMILERS_SOURCE`) - which is what opens each new run's board empty while
they share every screen. Every tag is pinned by
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

- **Landing page** (`/event-v3`, `/rotaryklwam`, `/ntuhomecoming`,
  `/ihhsearegatta`): the "Send me occasional brain health tips and updates"
  checkbox rides along with the
  name + email capture and is written to both `game_scores.tips_consent` (with
  the score) and `leads.tips_consent` (with the lead).
- **Report page**: ticking the tips opt-in inserts into `newsletter_optins` as
  before, and now also stamps `leads.tips_consent = true` on that email's rows.
  The opt-in can only turn consent on; there is no un-tick in the UI.

**`partner_consent` records the partner (IHH) consent** - from the `/event-v3`
consent page, or from the `/ihhsearegatta` landing - on the same three-state
contract: `true` (ticked), `false` (left unticked), or `null` when we never
asked - every row written before this column existed, and every variant that
never puts the partner's consent to the player.

The value is taken once - on the consent page between the landing and the
instructions (v3), or with the name + email capture on the landing (regatta) -
and carried in funnel state for the rest of the session, so it is written
twice: to `game_scores.partner_consent` with the score (which is the only row a
player who stops after the game leaves behind) and to `leads.partner_consent`
with the report. Nothing else can change it - there is no second opt-in for it
anywhere in the funnel, and no path that turns a decline into a `true`.

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

Env vars (see `.env.example`): `NEXT_PUBLIC_SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY` (server only - never `NEXT_PUBLIC`).

`/api/lead` writes the quiz answers to `leads.answers` alongside the score they
produced, which is what the privacy policy says we keep ("Your name, email and
quiz answers"). The same answers also land, without name or email, in
`quiz_responses` via `/api/response` for aggregate reporting.

## Working defaults flagged for sign-off (build brief §12)

The scoring *engine* (weights, bands, safety override) is settled. These surface
choices use working defaults - encoded as named constants so they're a one-line
change once Audrey / clinical sign off:

- **Per-axis band thresholds** for the worse-of-two comparison (`src/engine/bands.ts`).
- **Q15 "what do you track" options + persona cut-offs** (`src/config/questions.ts`, `src/engine/persona.ts`).
- **Names / labels / copy** (`src/config/copy.ts`) - "Brain Health Score", band labels, bridge wording, price, etc.

### /siloamneurosciencesummit, specifically

Three things on the Siloam summit are working defaults waiting on the client,
each a one-line change and each flagged in the file it lives in:

- **The landing's consent wording**, in both languages
  (`ONE_TICK_CONSENT_FORM` in `config/copy.ts`, `config/copy.id.ts`). It is
  `/22grams`' wording, and the policy it links describes that shape. UU PDP
  art. 22 requires a consent request to be put in Indonesian and to be plainly
  understandable, so the Bahasa Indonesia rendering is the one that matters
  here - both are for counsel to confirm with the policy.
- **The privacy policy** at `/siloamneurosciencesummit/privacy-policy`
  (`config/privacyPolicyIndonesia.ts`). Now written against Indonesia's UU PDP
  in both languages - see the section below - but **not yet reviewed by
  counsel**, which is the one thing still owed on it.
- **The report's headline statistic**, in both languages
  (`COPY.screens.siloam.report.stat`). Currently the *global* Lancet 45%
  awaiting the Indonesian figure. Change both languages together.

The **prize amounts are settled** (IDR 300k / 200k / 100k, confirmed by the
client) and are no longer on this list, and the board's Grab artwork is in
(`public/images/general/`).

## Out of scope (this build)

The booking destination (paywall CTA), the Accenture reaction-time game (§10,
deliberately separate from the score), and the React Native production port.
