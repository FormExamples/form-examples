# Glasgow Coma Scale — agent instructions

Clinician-driven assessment of impaired consciousness. Collects the three
Glasgow Coma Scale responses — **Eye opening (E, 1–4)**, **Verbal response
(V, 1–5)**, and **Motor response (M, 1–6)** — via a single continuous
single-page wizard, computes the **total GCS (3–15)**, the **E/V/M breakdown**,
and a **severity band** (mild / moderate / severe), supports a **"not testable"
(NT)** result per component, and derives the secondary **GCS-Pupils (GCS-P)**
score. The output is a signed neuro-observation record.

See [`index.md`](./index.md) for the full design, the component descriptor
tables, and the assessment steps.

## Source of truth

`sql/` is the schema source of truth. After editing it, regenerate the derived
artefacts (XML, FHIR R5, protobuf, OpenAPI, Loco setup, examples, `spec/`,
`CHANGELOG.md`) with the repo generators in `bin/` — never hand-edit generated
files.

## Directory map

- `./index.md` — project overview and scoring tables
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./doc/` — clinical reference documentation (GCS structured approach, GCS-P,
  head-injury escalation)
- `./sql/` — PostgreSQL migrations (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 `.yaml` specifications
- `./front-end-with-html/` — HTML + Lily wizard (`index.html`) + dashboard
- `./front-end-with-svelte/` — SvelteKit + Lily wizard + dashboard (RESTful
  `/assessments/` list + `/assessments/[id]` form)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Scoring engine

Pure, deterministic function over the assessment. No side effects, no I/O.

- **Input shape:**
  ```ts
  interface GcsAssessment {
    // context
    assessedAt: string | null;        // ISO 8601 datetime
    assessorName: string;             // '' if unanswered
    assessorRole: string;             // '' if unanswered
    setting: string;                  // 'ed' | 'neuro' | 'critical-care' | 'pre-hospital' | ''
    // components — score is null when not testable; the NT flag records why
    eyeScore: number | null;          // 1..4
    eyeNotTestable: boolean;
    verbalScore: number | null;       // 1..5
    verbalNotTestable: boolean;
    motorScore: number | null;        // 1..6
    motorNotTestable: boolean;
    // confounders (each may justify an NT)
    intubated: boolean;
    sedated: boolean;
    paralysed: boolean;
    // pupils — for GCS-P
    leftPupilReactive: boolean | null;
    rightPupilReactive: boolean | null;
    // trend
    previousTotal: number | null;     // 3..15
    previousMotorScore: number | null;// 1..6
  }
  ```
- **Output shape:**
  ```ts
  calculateGcs(data: GcsAssessment): {
    eyeScore: number | null;          // 1..4
    verbalScore: number | null;       // 1..5
    motorScore: number | null;        // 1..6
    total: number | null;             // 3..15; null if any component NT
    breakdown: string;                // e.g. "E3 V4 M5" or "E3 V-NT M5"
    totalDisplay: string;             // e.g. "12" or "9T" (intubated verbal)
    severityBand: 'mild' | 'moderate' | 'severe' | null;
    pupilReactivityScore: number | null; // 0..2 (pupils unreactive to light)
    gcsP: number | null;              // 1..15 = total − PRS; null if undefined
    firedRules: FiredRule[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:**
  1. Resolve each component score, or `null` when its NT flag is set.
  2. `total = eye + verbal + motor` only when all three are testable; otherwise
     `null` and `severityBand = null`.
  3. Band the defined total: 13–15 `mild`, 9–12 `moderate`, 3–8 `severe`.
  4. `pupilReactivityScore` = count of pupils unreactive to light (0–2), when
     both pupils are examined.
  5. `gcsP = total − pupilReactivityScore` when both `total` and PRS are defined.
  6. Evaluate rules (§ flagged issues) and collect fired rules and flags.
- **Engine files:** `types.ts`, `gcs-rules.ts`, `gcs-grader.ts`,
  `flagged-issues.ts`, `utils.ts`.
- **Tests:** `gcs-grader.test.ts`, `flagged-issues.test.ts`.

## Flagged issues

Computed independently of the severity band; stable rule IDs shared across every
front-end and the back-end.

- **GCS ≤ 8 (coma)** — airway at risk; consider intubation and senior
  escalation (high).
- **Deteriorating GCS** — total falls ≥ 2 from `previousTotal`, or motor score
  falls from `previousMotorScore`; urgent senior / neurosurgical review and
  consider CT (high).
- **Unequal or unreactive pupils** — asymmetric reactivity or a fixed pupil;
  urgent CT head and neurosurgical referral (high).
- **Untestable component** — any component NT; the total is undefined, so flag
  the reliability limitation and record the reason (medium).
- **Falling motor score** — motor drop even when the total is stable (medium).

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric, date, and time fields (including NT components).
- camelCase property names in TypeScript and front-end Rust serde.
- snake_case in SQL and Rust internals.
- Step components named `StepNName.svelte` (1-indexed).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys via `gen_random_uuid()`.
- `created_at`, `updated_at`, `deleted_at` timestamps on every table.
- Single continuous single-page wizard — no multi-page forms.
- Import and export via JSON, XML, CSV, and TSV.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA Software and AI as a Medical Device.

## Verify

```sh
bin/test-form glasgow-coma-scale
```
