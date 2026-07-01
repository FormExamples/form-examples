# Post-Anaesthesia Care Unit (PACU) Record — Agent Instructions

Recovery-room record for patients emerging from anaesthesia or sedation.
Collects serial post-operative observations via a single continuous single-page
wizard and computes a discharge-readiness score. The primary instrument is the
**Modified Aldrete Score** — five parameters (activity, respiration,
circulation, consciousness, oxygen saturation), each 0–2, total **0–10** —
where **≥ 9 with the oxygen-saturation parameter satisfied** is the threshold
for discharge from PACU. An optional **PADSS** (Post-Anaesthesia Discharge
Scoring System, five criteria 0–2, total 0–10, ≥ 9 = street-fit) covers
day-surgery discharge home. The record also raises red flags (Aldrete < 9,
hypoxia, unstable vitals, uncontrolled pain, uncontrolled PONV, bleeding).

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (Aldrete 1970/1995, PADSS)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Scoring engine

- **Input shape:** `PacuRecord` TypeScript type — the five Aldrete parameter
  inputs, optional PADSS criterion inputs, airway/pain/PONV fields, plus context
  and identification fields.
- **Output shape:**
  ```ts
  gradePacu(data: PacuRecord): {
    activityScore: 0 | 1 | 2;
    respirationScore: 0 | 1 | 2;
    circulationScore: 0 | 1 | 2;
    consciousnessScore: 0 | 1 | 2;
    oxygenSaturationScore: 0 | 1 | 2;
    aldreteTotal: number;            // 0..10
    readinessBand: 'not-ready' | 'discharge-ready';
    padssTotal: number | null;       // 0..10 when day-surgery criteria supplied
    padssStreetFit: boolean | null;
    firedParameters: FiredParameter[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — each Aldrete parameter contributes 0–2; the total
  0–10 determines the readiness band. Discharge-ready requires
  `aldreteTotal >= 9` **and** `oxygenSaturationScore === 2`. PADSS is summed
  independently when supplied (`padssStreetFit = padssTotal >= 9`). See spec §4.
  A missing parameter contributes 0 and raises a data-completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `aldrete-rules.ts`,
  `aldrete-grader.ts`, `flagged-issues.ts`.
- **Tests:** `aldrete-grader.test.ts`, `aldrete-rules.test.ts` — cover the
  discharge boundary (total 8/9), the SpO₂-gated discharge case (total 9 with
  oxygen-saturation score < 2 stays not-ready), every parameter's 0/1/2 levels,
  and the PADSS ≥ 9 boundary.

## Flagged issues

Computed independently of the total (see spec §5), each with a priority:

- **Not ready for discharge** (high) — `aldreteTotal < 9` or
  `oxygenSaturationScore < 2`.
- **Hypoxia** (high) — `oxygenSaturationScore < 2` (SpO₂ below the room-air
  threshold or oxygen-dependent).
- **Unstable vital signs** (high) — `circulationScore < 2` or
  `respirationScore < 2`.
- **Uncontrolled pain** (medium) — pain score above the acceptable threshold.
- **Uncontrolled PONV** (medium) — persistent nausea/vomiting despite
  antiemetics.
- **Surgical bleeding** (high) — PADSS surgical-bleeding criterion below 2 /
  bleeding flagged.
- **Incomplete assessment** (low) — any Aldrete parameter input missing; the
  total may understate risk.

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde.
- snake_case in SQL and Rust internals.
- Step components named `StepNName.svelte` (1-indexed).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys via `gen_random_uuid()`.
- `created_at`, `updated_at`, `deleted_at` timestamps on every table.
- Import and export via JSON, XML, CSV, and TSV.
- Generated artefacts (XML, FHIR, protobuf, OpenAPI, Loco setup) are never
  hand-edited.

## Clinical grounding

- Aldrete J.A., Kroulik D. A postanesthetic recovery score. *Anesth Analg*
  1970; 49(6):924–934.
- Aldrete J.A. The post-anesthesia recovery score revisited. *J Clin Anesth*
  1995; 7(1):89–91.
- Chung F. Discharge criteria — a new trend (PADSS). *Can J Anaesth* 1995;
  42(11):1056–1058.
- Association of Anaesthetists. *Immediate post-anaesthesia recovery* (2013).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form post-anaesthesia-care-unit-record
```
