# Chronic Kidney Disease Annual Review — SvelteKit front-end (form + dashboard)

A single-page, step-by-step SvelteKit wizard for the UK primary-care chronic
kidney disease annual review (NICE NG203, KDIGO 2012/2024), plus a clinician
dashboard. The pure engine derives the KDIGO **G-stage** (G1–G5) from the
current eGFR, the **albuminuria stage** (A1–A3) from the urine ACR, indexes the
pair into the KDIGO **risk zone** (low / moderate / high / very-high), grades
review **completeness** (complete / partial / incomplete), and — independently —
raises **flags** mapped to NICE NG203 referral and safety criteria. It is a
documentation and classification tool; it does not diagnose or prescribe, and
there is no numeric score.

## Routes

- `/` — welcome page with links to the form and the dashboard.
- `/chronic-kidney-disease-reviews` — clinician dashboard (SVAR DataGrid,
  `ssr = false`), one row per reviewed patient with the engine-computed G-stage,
  albuminuria stage, KDIGO risk zone, review completeness, referral indicator,
  and flag counts. Filterable by risk zone and completeness.
- `/chronic-kidney-disease-reviews/[id]` — the eight-section wizard
  (`new` for a fresh draft, or a sample id to seed from a demo record).
- `/chronic-kidney-disease-reviews/[id]/report` — the graded report.
- `/chronic-kidney-disease-reviews/[id]/report/pdf` — server-rendered PDF.

## Wizard sections

1. Review context — clinician, date, care setting, review type.
2. Patient and diagnosis — identifier, demographics, diabetes status, CKD cause.
3. Renal function — current and previous eGFR (rapid-decline check).
4. Albuminuria — urine ACR and whether measured this review.
5. Blood pressure — systolic and diastolic.
6. Medication review — RAAS blockade, SGLT2i, statin, nephrotoxin check.
7. Metabolic bloods — HbA1c, potassium, bicarbonate, calcium, phosphate, PTH,
   haemoglobin.
8. Referral and summary — live KDIGO/completeness readout, referral decision,
   and a clinician note.

## Engine

- G-stage: eGFR ≥ 90 → G1; 60–89 → G2; 45–59 → G3a; 30–44 → G3b; 15–29 → G4;
  &lt; 15 → G5.
- Albuminuria: ACR &lt; 3 → A1; 3–30 → A2; &gt; 30 → A3.
- KDIGO risk zone: the G × A heat-map (spec §4).
- Blood-pressure target: 130/80 mmHg with ACR ≥ 70 or diabetes; else 140/90.
- Review completeness: eGFR is the gate; complete when all bundle items (eGFR,
  ACR, BP, medication review, core bloods) are documented; incomplete when eGFR
  is missing or ≥ 2 items are missing; else partial.
- Flags: very-high-risk referral, eGFR &lt; 30 referral, ACR ≥ 70 referral,
  rapid eGFR decline, hyperkalaemia, anaemia of CKD, uncontrolled BP, nephrotoxic
  drug without dose adjustment, missing ACR, incomplete review.

## Commands

```sh
pnpm install
pnpm run check       # svelte-check (0 errors, 0 warnings)
pnpm run build       # production build
pnpm exec vitest run # engine unit tests
```
