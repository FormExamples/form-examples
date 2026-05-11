# Issue Tracker — Agent Instructions

A general-purpose issue tracker. Captures any reportable problem (bug,
outage, safety event, complaint, blocker) through a 10-step single-page
wizard with nine SOAP-style sections (CC / Pt / Sx / Fx / Hx / Ix / Dx /
Tx / Px), grades it on **seven independent scoring scales** (priority,
severity, magnitude, harm, failure-condition, MoSCoW, frequency), and
emits a composite priority plus safety flags.

See [`index.md`](./index.md) for the full design and the 10-step wizard
table.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./seed.md` — original design seed (preserved verbatim)
- `./doc/` — reference documentation (LFPSE, MoSCoW, Saffir-Simpson, etc.)
- `./sql-migrations/` — Liquibase-formatted Postgres schema
- `./xml-representations/` — generated XML + DTD per SQL table
- `./fhir-r5/` — generated FHIR HL7 R5 JSON per SQL entity
- `./front-end-form-with-html/` — static single-page issue wizard
- `./front-end-form-with-svelte/` — SvelteKit single-page issue wizard
- `./front-end-dashboard-with-html/` — HTML review table
- `./front-end-dashboard-with-svelte/` — SvelteKit SVAR DataGrid review dashboard
- `./full-stack-with-loco-tera-htmx-alpine/` — Rust backend with server-rendered HTMX UI

## Scoring engine

- **Input shape:** `IssueTrackerAssessment` TypeScript type containing the
  nine SOAP-style sub-types plus reporter and metadata fields.
- **Output shape:**
  ```ts
  gradeIssue(data: IssueTrackerAssessment): {
    scoreByPriorityRank: number;        // 1, 2, 3, ...
    scoreBySeverityOfImpact: 1 | 2 | 3 | 4 | 5;
    scoreByMagnitudeOfDamage: number;   // 1..10
    scoreByHarmGrade: 0 | 1 | 2 | 3 | 4;
    scoreByFailureCondition: 'A' | 'B' | 'C' | 'D' | 'E';
    scoreByMoscowRequirement: 1 | 2 | 3 | 4;
    scoreByFrequencyPercent: number;    // 0..100
    compositePriority: 'low' | 'moderate' | 'high' | 'critical';
    firedRules: FiredRule[];
    additionalFlags: AdditionalFlag[];
  }
  ```
- **Algorithm:** max-grade — the worst single-dimension finding sets the
  composite. The composite is `low` only when *every* score is in its
  low band.
- **Engine files:** `types.ts`, `utils.ts`, `priority-rules.ts`,
  `severity-rules.ts`, `magnitude-rules.ts`, `harm-rules.ts`,
  `failure-rules.ts`, `moscow-rules.ts`, `frequency-rules.ts`,
  `composite-grader.ts`, `flagged-issues.ts`.
- **Tests:** `composite-grader.test.ts`, plus one per scoring rule file.

## Cross-domain rules

These rules borrow from outside medicine and aviation:

- **Severity-catastrophic flag** — `score_by_severity_of_impact = 5` →
  `severity-catastrophic` flag (high priority).
- **Magnitude-total-destruction flag** — `score_by_magnitude_of_damage = 10`
  → `magnitude-total-destruction` flag (high).
- **Harm-fatal flag** — `score_by_harm_grade = 4` → `harm-fatal` flag (high)
  and triggers LFPSE escalation when the issue is clinical.
- **Failure-catastrophic flag** — `score_by_failure_condition = 'A'` →
  `failure-catastrophic` flag (high).
- **Frequency-universal flag** — `score_by_frequency_percent ≥ 95` →
  `frequency-universal` flag (high).
- **Requirement-mandatory flag** — `score_by_moscow_requirement = 1` and
  composite priority is high or critical → `requirement-mandatory` flag.
- **Regulatory escalation** — issue category in (`clinical-safety`,
  `data-protection`, `workplace-safety`, `medical-device`) and harm ≥ 2
  → `regulatory` flag (high).

## Reporter override

The grading engine produces a computed composite priority. The reporter
(or triager) may override the priority on step 10 with a documented reason.
Both the **computed** priority and the **final** priority are stored and
rendered in the report and FHIR Bundle.

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric fields.
- camelCase property names in TypeScript.
- snake_case in SQL and Rust.
- Step components named `StepNName.svelte` (1-indexed).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys; `created_at` + `updated_at` timestamps on every table.
- The data-entry UI lives in `front-end-form-with-*` directories per
  monorepo convention; even though this is a non-clinical form the
  same naming is retained.

## Front-end SvelteKit stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`)
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`
- `pdfmake` for server-side PDF
- Vitest for engine unit tests
- Single-page wizard with `StepNavigation` and `ProgressBar`

## Reviewer-dashboard stack

- SvelteKit + SVAR DataGrid (`@svar-ui/svelte-grid`) with the Willow theme.
- Sortable columns; dropdown filters on composite priority, severity,
  harm grade, failure condition, environment, system, assignee.
- Backend API client with sample-data fallback for standalone development.

## Backend stack

- Rust edition 2024
- Loco 0.16 framework on axum 0.8
- SeaORM 1.1 with PostgreSQL 18
- Tera templates with HTMX 2.0.8 and Alpine.js 3.14.8
- `serde(rename_all = "camelCase")` for front-end interop

## Compliance

- ISO/IEC 27035 — information-security incident management.
- ISO 31000:2018 — risk-management guidelines.
- NHS LFPSE harm-grade alignment for clinical safety issues.
- ICO personal-data-breach notification interfaces.
- HSE RIDDOR reporting interfaces for workplace safety issues.
- MDCG 2019-11 Rev.1 (EU MDR Software Classification).
- UK MHRA Software and AI as a Medical Device.

## Verify

```sh
bin/test-form issue-tracker
```
