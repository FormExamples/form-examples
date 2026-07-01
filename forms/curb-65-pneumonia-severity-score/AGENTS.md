# CURB-65 Pneumonia Severity Score — Agent Instructions

Clinician-facing community-acquired pneumonia (CAP) severity assessment. Collects
the five CURB-65 criteria via a single-page wizard, computes a 0–5 score (one
point per criterion), assigns a mortality-risk band (low / intermediate / high),
recommends a site-of-care disposition, and raises advisory safety flags. Where
serum urea is unavailable, the four-criterion CRB-65 primary-care variant (0–4)
is computed instead.

See [`index.md`](./index.md) for the full design and the criterion table.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (CURB-65 / CRB-65 rules, BTS/NICE)
- `./sql/` — Liquibase-formatted Postgres schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — HTML + Lily wizard (`index.html`) + `dashboard.html`
- `./front-end-with-svelte/` — SvelteKit + Lily wizard + dashboard
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Scoring engine

- **Input shape:** `Curb65Assessment` TypeScript type mirroring the SQL schema —
  encounter/clinician identification, patient identifier, date of birth, sex,
  and the raw criterion inputs.
- **Output shape:**
  ```ts
  calculateCurb65(data: Curb65Assessment): {
    curb65Score: 0 | 1 | 2 | 3 | 4 | 5;
    crb65Score: 0 | 1 | 2 | 3 | 4 | null; // populated when urea not measured
    criteria: {
      confusion: boolean;
      urea: boolean;
      respiratoryRate: boolean;
      bloodPressure: boolean;
      ageOver65: boolean;
    };
    riskBand: 'low' | 'intermediate' | 'high';
    recommendedDisposition:
      | 'home-outpatient'
      | 'short-stay-supervised'
      | 'hospital-admission';
    firedFlags: FiredFlag[];
  }
  ```
- **Algorithm:** one point each for Confusion (new), Urea > 7 mmol/L,
  Respiratory rate ≥ 30, Blood pressure (systolic < 90 or diastolic ≤ 60), and
  age ≥ 65; sum is 0–5. Band: 0–1 low, 2 intermediate, 3–5 high. Missing inputs
  score 0 and raise `incomplete-criterion`. When `ureaMeasured === false`,
  compute CRB-65 (0–4) and band it 0 low / 1–2 intermediate / 3–4 high. Pure
  function — no side effects, no I/O.
- **Engine files:**
  - `types.ts` — `Curb65Assessment`, `Curb65Result`, `FiredFlag`, enums.
  - `curb65-rules.ts` — the five criterion predicates and their thresholds.
  - `curb65-grader.ts` — `calculateCurb65()`; sums criteria, bands, disposition,
    CRB-65 fallback.
  - `flagged-issues.ts` — advisory flags (see §Flagged issues).
  - `utils.ts` — age-from-DOB derivation, unit coercion (BUN mg/dL → urea
    mmol/L), null-safe comparisons.
- **Tests:** `curb65-grader.test.ts`, `curb65-rules.test.ts` — cover every
  boundary (urea = 7 negative, RR = 30 positive, systolic = 90 negative,
  diastolic = 60 positive, age = 65 positive) and the CRB-65 fallback path.

## Flagged issues

Fired independently of the numeric band; priority high / medium / low.

- **`high-severity-admit`** (high) — score ≥ 3: hospitalise, manage as severe CAP.
- **`consider-icu`** (high) — score 4–5: assess for intensive-care / HDU admission.
- **`hypotension`** (high) — systolic < 90 or diastolic ≤ 60 mmHg (shock risk).
- **`new-confusion`** (high) — new-onset confusion present.
- **`hypoxia`** (medium) — advisory SpO₂ < 92% recorded.
- **`incomplete-criterion`** (low) — one or more criterion inputs missing.

## Clinician override

The engine produces a computed score and disposition band. The clinician may
override the disposition on the final step with a documented reason. Both the
**computed** result and the **final** disposition are stored and rendered in the
report and FHIR Bundle.

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde.
- snake_case in SQL and Rust internals.
- Step components named `StepNName.svelte` (1-indexed).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys via `gen_random_uuid()`; `created_at`, `updated_at`,
  `deleted_at` on every table.
- Age is derived from date of birth at assessment time; the derived value is the
  scored input.

## Clinical grounding

- Lim W.S. *et al.* *Thorax* 2003; 58:377–382 (CURB-65 derivation/validation).
- British Thoracic Society CAP guidelines (2009 update; annotated 2015).
- NICE NG138 *Pneumonia (community-acquired): antimicrobial prescribing* (2019).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification) — Class IIa where
  output drives the site-of-care decision.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.

## Verify

```sh
bin/test-form curb-65-pneumonia-severity-score
```
