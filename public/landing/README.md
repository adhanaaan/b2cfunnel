# Gray Matter - Pages

| File | What it is |
|------|-----------|
| **`index.html`** | ⭐ Long-form landing page, **GMS brand** (orange / cream / charcoal, Poppins + Inter, dot-grid texture). This is the Vercel root. |
| `quiz.html` | Premium, orange-themed **Brain Health Check** quiz funnel (personality.co-style). Links back to `index.html` from its results CTA. |

---

## Brain Health Check (`quiz.html`) - quiz funnel

A personality.co-style flow, **orange / premium** themed:

1. **Intro** - bold hook, "3 min · private · science-backed", big CTA, social proof
2. **10 questions** - one per screen, progress bar, large answer cards, **auto-advance**, Back button, selections are remembered
3. **Email capture** - "Where should we send your score?" (name + email, validated)
4. **Results** - animated Brain Health Score ring (0–100), tiered summary, **per-pillar breakdown bars**, then a dark CTA card up-selling the full Gray Matter assessment (links to `index.html`)

### Swap in your real quiz
All questions live in one place - the `QUESTIONS` array near the bottom of `quiz.html`:

```js
{ q: "Question text", pillar: "Sleep & Recovery", hint: "optional",
  options: [{label:"Best answer", score:3}, ... {label:"Worst", score:0}] }
```

- `score` runs 0 (worst) → 3 (best); the engine scales everything to /100 automatically.
- `pillar` groups answers into the results breakdown - reuse the same pillar name across questions to combine them.
- Edit `TIERS` to change the score bands and result copy.
- **Wire up leads:** there's a `TODO` in `submitEmail()` to POST `{name, email, answers, score}` to your CRM (you have HubSpot connected).

> ⚠️ Questions are evidence-based placeholders (I couldn't reach `brainhealthcheck.vercel.app` from this sandbox - egress is locked down). Paste your exact questions here, or send them to me and I'll drop them in verbatim.

---

# Long landing page (`index.html`)

A trust-first B2C landing page for **Gray Matter Cognition**, inspired by
[functionhealth.com](https://www.functionhealth.com/) (premium, medical authority,
peer-reviewed science) and [mitohealth.com](https://mitohealth.com/) (modern,
clinician-guided, personalized plan).

> ⚠️ All copy in `[BRACKETS]`, marked `TODO`, names, stats, and reviews are
> **placeholders**. Swap in your real numbers, advisors, headshots, and quotes
> before going live. Nothing here is legal/medical-reviewed.

## Quick start

```bash
open index.html        # macOS
xdg-open index.html    # Linux
# or just drag index.html into a browser
```

No build step, no dependencies. One self-contained file (fonts load from Google Fonts CDN).

## What's in `index.html` (draft 1 - "Clinical Premium")

Section order, all chosen to **signal trust & credibility**:

1. **Announcement bar** – urgency / promo
2. **Sticky nav** – with primary CTA
3. **Hero** – headline + subhead + dual CTA + trust strip (★ rating, member count, HIPAA/CLIA badge) and a mock "Brain Health Score" report card
4. **Press logos** – "As featured in" (replace with real SVGs)
5. **Stats bar** – biomarkers / members / clinician-reviewed / advisors
6. **What's Included** – 6 biomarker/cognitive panel categories
7. **How It Works** – 4 steps
8. **The Science** (dark section) – peer-reviewed, CLIA labs, clinician oversight, privacy, independence, longitudinal
9. **Advisory Board** ← *your "advisor section"* - 4 advisor cards
10. **Patient Reviews** ← *your "patient review"* - 3 verified testimonial cards
11. **Pricing** – single membership card
12. **FAQ** – accordion
13. **Final CTA**
14. **Footer** – with medical disclaimer

## Rebranding in 30 seconds

Everything visual is driven by CSS variables at the top of `index.html`:

The page uses the **GMS brand system**:

```css
:root {
  --brand:   #F77528;   /* GMS orange */
  --bg:      #F7F7F4;   /* off-white */
  --bg-soft: #FBEDD7;   /* cream (soft sections + cards) */
  --bg-deep: #2D2D2D;   /* charcoal (dark sections + footer) */
  --ink:     #2D2D2D;   /* charcoal text */
  --dot:     rgba(45,45,45,.06); /* dot-grid background texture */
  ...
}
```

Change `--brand` and the whole page re-themes. A subtle **dot-grid texture** sits
on the off-white background (tune via `--dot` + the `background-size` on `body`).
Fonts: `Poppins` (headings) + `Inter` (body) - swap the Google Fonts `<link>` to change.

## Replace before launch
- [ ] Real advisor names, credentials, institutions + **headshots** (swap the `.photo` divs for `<img>`)
- [ ] Real, **verified** patient reviews (and confirm you can use them)
- [ ] Real press logos or remove the strip
- [ ] Real stats (biomarker count, member count, rating)
- [ ] Pricing
- [ ] Legal: Privacy, Terms, HIPAA notice, and **have the medical disclaimer reviewed**
- [ ] Logo asset (currently a gradient square)

## Other draft directions to consider

I built **Draft 1 (Clinical Premium)**. If you want, I can spin up variants:

- **Draft 2 - "Warm & human":** softer palette, lifestyle photography, story-led hero
  ("Stay sharp for the people you love"), less clinical.
- **Draft 3 - "Data-forward":** dark-mode default, big animated biomarker dashboard
  as the hero, for a more tech/quantified-self audience.
- **Draft 4 - "Conversion sprint":** shorter single-scroll page optimized for paid
  ads (one promise, one CTA repeated, condensed proof).

Tell me which direction(s) and I'll build them out as separate files.
