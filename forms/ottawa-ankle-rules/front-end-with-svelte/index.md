# Ottawa Ankle Rules — SvelteKit front-end

Consolidated SvelteKit front-end for the **Ottawa Ankle Rules (and Ottawa Foot
Rules)**: a single-page, step-by-step questionnaire wizard plus a clinician
dashboard, both driven by the same pure decision engine.

- **Framework:** SvelteKit 2, Svelte 5 runes, Tailwind CSS 4.
- **Dashboard:** SVAR Svelte DataGrid (client-only route, `ssr = false`).
- **PDF:** `pdfmake` via a SvelteKit server endpoint.
- **Tests:** Vitest over the decision engine.
- **Design system:** Lily Design System (Svelte headless) component contract.

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Welcome page linking to the form and dashboard |
| `/ottawa-ankle-ruleses` | Clinician dashboard (SVAR DataGrid) |
| `/ottawa-ankle-ruleses/[id]` | Single-page assessment wizard |
| `/ottawa-ankle-ruleses/[id]/report` | Graded report |
| `/ottawa-ankle-ruleses/[id]/report/pdf` | PDF endpoint (POST) |

## Wizard steps

1. **Assessment context** — clinician name and role, date/time, care setting,
   injured side, hours since injury.
2. **Patient identification** — identifier, age (years), sex.
3. **Applicability** — assessment reliability (no intoxication, distracting
   injury, or sensory deficit).
4. **Pain zones** — malleolar-zone pain and midfoot-zone pain (the two
   preconditions).
5. **Ankle bone tenderness** — criteria A1 (lateral malleolus) and A2 (medial
   malleolus), with the live ankle decision.
6. **Foot bone tenderness** — criteria F1 (fifth-metatarsal base) and F2
   (navicular), with the live foot decision.
7. **Weight-bearing** — able to bear weight immediately after injury and now
   (derives "unable to bear weight", A3/F3).
8. **Summary and decision** — the two live imaging decisions and a free-text
   clinical note.

## Decision rule

This is a boolean **decision rule, not a score** — there is no total and no risk
band. The engine emits two independent imaging decisions plus the shared derived
input:

- `unableToBearWeight = ableToBearWeightImmediately == 'no' && ableToBearWeightNow == 'no'`
- `ankleXrayIndicated = malleolarZonePain == 'yes' && (lateralMalleolusTenderness == 'yes' || medialMalleolusTenderness == 'yes' || unableToBearWeight)`
- `footXrayIndicated = midfootZonePain == 'yes' && (fifthMetatarsalBaseTenderness == 'yes' || navicularTenderness == 'yes' || unableToBearWeight)`

The two decisions are independent (ankle only, foot only, both, or neither is
valid); `unableToBearWeight` feeds both.

## Develop

```sh
pnpm install
pnpm dev            # dev server
pnpm run check      # svelte-check (type-check)
pnpm run build      # production build
pnpm exec vitest run # unit tests
```
