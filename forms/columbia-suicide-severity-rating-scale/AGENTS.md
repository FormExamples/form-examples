# Columbia Suicide Severity Rating Scale (C-SSRS) — Agent Instructions

A structured suicide-risk assessment collected via a single continuous
single-page wizard. It records the severity of suicidal ideation on a five-point
ordinal scale (1 wish to be dead → 5 active ideation with specific plan and
intent), categories of suicidal behaviour (actual, interrupted, aborted attempt;
preparatory acts; non-suicidal self-injury), and the lethality of any actual
attempt, then derives a **Low / Moderate / High** risk tier with a management
recommendation. It is a severity- and status-classification instrument, **not**
a summed score.

Handle this instrument professionally: it is a validated clinical screening tool
used by trained staff. The software stratifies risk and prompts escalation; it
does not diagnose or replace clinical judgement.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (Posner 2011, NICE NG225)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Classification engine

- **Input shape:** `CssrsAssessment` TypeScript type — the ideation items Q1–Q5,
  optional intensity sub-items, behaviour categories, recency, lethality, means,
  and the context and identification fields.
- **Output shape:**
  ```ts
  gradeCssrs(data: CssrsAssessment): {
    ideationLevel: 0 | 1 | 2 | 3 | 4 | 5;
    suicidalBehaviourPresent: boolean;
    recentBehaviour: boolean;
    riskTier: 'low' | 'moderate' | 'high';
    firedCriteria: FiredCriterion[];
    flaggedIssues: FlaggedIssue[];
    managementRecommendation: string;
  }
  ```
- **Algorithm:** ordinal + categorical, not additive. `ideationLevel` is the
  highest affirmative ideation item (0–5). `suicidalBehaviourPresent` is any of
  actual / interrupted / aborted attempt or preparatory acts (NSSI excluded).
  The tier is: **High** if ideation level ≥ 4, or behaviour within the past 3
  months, or high-lethality attempt (actual ≥ 3 or potential = 2); **Moderate**
  if ideation level 3 or any non-recent suicidal behaviour; **Low** otherwise.
  See spec §4.
- **Engine files:** `types.ts`, `utils.ts`, `cssrs-rules.ts`, `cssrs-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `cssrs-grader.test.ts`, `cssrs-rules.test.ts` — cover each ideation
  level 0–5, every behaviour category, both recency windows, the lethality
  thresholds (actual 2/3, potential 1/2), and each risk tier.

## Flagged issues

Computed independently of the tier (see spec §5): immediate safety / crisis
referral (`riskTier == high`, high), active plan and intent (ideation level 5,
high), recent suicide attempt (actual attempt within 3 months, high),
high-lethality attempt (high), access to lethal means (high), recent preparatory
acts (medium), non-suicidal self-injury (medium), incomplete assessment (low).

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

- Posner K. *et al.* The Columbia–Suicide Severity Rating Scale. *American
  Journal of Psychiatry* 2011; 168(12):1266–1277.
- NICE NG225. *Self-harm: assessment, management and preventing recurrence.*
- NICE CG133. *Self-harm: longer-term management.*
- US FDA and SAMHSA guidance recognizing the C-SSRS.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form columbia-suicide-severity-rating-scale
```
