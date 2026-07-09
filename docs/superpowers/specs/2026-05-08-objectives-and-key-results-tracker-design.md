# Objectives and Key Results tracker — design spec

**Date:** 2026-05-08
**Slug:** `objectives-and-key-results-tracker`
**Form directory:** `forms/objectives-and-key-results-tracker/`
**Status:** Draft, pending implementation plan

## 1. Overview

A general-purpose Objectives and Key Results (OKR) tracker that adapts the
`forms/issue-tracker/` scaffold to a non-clinical subject. One submission
captures one **Objective** with its **1–5 Key Results** through a single-page,
ten-step wizard, applies a seven-axis scoring engine, and produces a signed
report with a composite Red / Amber / Green status and a list of risk flags.

The OKR tracker is the second non-clinical sibling in the monorepo (after
`issue-tracker`): it reuses the same scaffold (single-page wizard → SQL → XML
+ DTD → FHIR R5 → four front-ends + Rust full-stack) but treats the
*objective itself* as the subject.

### Scope and intended users

- **Setting:** team OKR rituals, departmental planning, company strategy
  reviews, individual performance objectives, quarterly business reviews.
- **Users:** OKR owners (DRIs), team leads, department heads, executives,
  OKR coaches, programme managers.
- **Subjects:** any objective at any organisational level — individual,
  team, department, or company.

## 2. Form shape

- One continuous **single-page wizard** of ten steps (per repo rule "no
  multi-page forms").
- Step components named `Step01OwnerAndCycle.svelte` … `Step10ScoreAndSignOff.svelte`.
- Each submission persists one parent `okr_objective` row plus 1–5
  `okr_key_result` rows.
- Cardinality of Key Results: **1–5** (standard OKR practice is 3–5; a
  hard cap of 5 enforces focus).
- **Cascading:** every objective declares a `level`
  (`individual` / `team` / `department` / `company`) and an optional
  `parent_objective_id` foreign key to the objective it ladders up to.
  The FK is self-referential on `okr_objective`.
- **Time horizon:** configurable per objective via a `cycle` enum
  (`monthly` / `quarterly` / `half-yearly` / `annual` / `custom`) plus
  explicit `cycle_start_date` and `cycle_end_date`. Quarterly is the
  default.

### Ten-step single-page wizard

| # | Step | Captures |
| --- | --- | --- |
| 1 | Reporter & cycle | reporter id, role, reporting time, level, cycle, `cycle_start_date`, `cycle_end_date` |
| 2 | Objective | one-sentence title (qualitative), long description, strategic theme, `parent_objective_id` if applicable |
| 3 | Participants | DRI (Directly Responsible Individual), contributors, reviewers, stakeholders to inform |
| 4 | Strategic alignment | how this objective ladders to the parent / mission, business-value statement |
| 5 | Key Results | 1–5 KRs, each: title, type (`numeric` / `milestone` / `binary`), `start_value`, `current_value`, `target_value`, unit, KR-level owner, due date |
| 6 | Initiatives | planned actions, projects, programmes that drive each KR (free text + optional links) |
| 7 | Risks & dependencies | known risks, blockers, external dependencies, mitigation plans |
| 8 | Check-in narrative | latest update prose, what changed since last check-in, current blockers, asks |
| 9 | Forecast | per-KR end-of-cycle confidence, expected final value, residual risk to objective |
| 10 | Score & sign-off | the seven scores, computed composite RAG, risk flags, override + reason, signature |

Notes on Step 5 KR types:

- `numeric` — requires `start_value`, `current_value`, `target_value`, and
  `unit` (e.g. revenue $1 M → $5 M).
- `milestone` — uses an ordered JSONB list of named milestones with
  completion booleans.
- `binary` — single done / not-done toggle.

Steps 5 and 6 grow dynamically as KRs are added; the UI caps at 5.

Per repo conventions: empty string `''` for unanswered text fields, `null`
for unanswered numeric fields, camelCase property names in TypeScript,
snake_case in SQL and Rust, `serde(rename_all = "camelCase")` on shared
Rust structs.

## 3. Scoring engine — seven independent scales

Each scale is independent and recorded once per objective in `okr_grade`.
The composite RAG status uses the **worst-band-finding** algorithm from
`issue-tracker` — one critical dimension drives the objective to Red.

| # | Score | Range | Origin | Purpose |
| --- | --- | --- | --- | --- |
| 1 | `score_by_progress_percent` | 0 – 100 | Doerr, *Measure What Matters* (2018) | Mean of per-KR `progress_fraction` (clamped to `[0, 1]`), expressed as percent. `progress_fraction` is computed by KR type: `numeric` → `(current − start) / (target − start)`; `milestone` → `count(done) / count(total)`; `binary` → `1.0` if done else `0.0` |
| 2 | `score_by_confidence_decile` | 1 – 10 | Industry practice (Atlassian, Asana) | Owner's stated confidence in achieving the objective by `cycle_end_date` |
| 3 | `score_by_stretch_tier` | 1 – 3 | Google OKR — *committed* / *aspirational* / *moonshot* | Risk-tolerance classification; modulates the RAG thresholds for progress |
| 4 | `score_by_alignment_grade` | 1 – 5 | Enterprise OKR practice (Profit.co, Quantive) | Fit to `parent_objective_id` / strategic theme; 1 = mis-aligned, 5 = directly furthers parent |
| 5 | `score_by_impact_tier` | 1 – 5 | MoSCoW prioritisation (Clegg & Barker, 1994) | Business / mission value if achieved; 1 = nice-to-have, 5 = mission-critical |
| 6 | `score_by_smart_quality` | 0 – 5 | Doran (1981), *Management Review* | Count of SMART attributes the objective + KRs satisfy: Specific, Measurable, Achievable, Relevant, Time-bound |
| 7 | `score_by_pace_deviation_percent` | −100 .. +100 | PMI earned-value analysis (SPI / CPI) | Deviation from expected linear pace at this point in the cycle; negative = behind |

### Composite RAG status

| RAG | Drivers (any-of for Amber and Red, all-of for Green) |
| --- | --- |
| **Green** (on track) | progress ≥ 70 % (committed) / ≥ 30 % (aspirational); confidence ≥ 7; alignment ≥ 4; SMART quality ≥ 4; pace deviation ≥ −10 % |
| **Amber** (at risk) | any single mid-band finding |
| **Red** (off track) | progress < 30 % (committed) / < 10 % (aspirational); OR confidence ≤ 3; OR alignment ≤ 2; OR SMART quality ≤ 1; OR pace deviation ≤ −50 % |

`stretch_tier` does not produce its own RAG — it modulates the progress
thresholds (a moonshot at 40 % can still be Green; a committed at 40 %
is Red). The rule that fired is captured in `okr_grade_rule`; risk flags
in `okr_grade_flag`.

## 4. Risk flags

Computed independently of the composite RAG, with priority `high` /
`medium` / `low`. Stored in `okr_grade_flag`. Mostly negative; one
positive flag for recognition.

| Flag | Priority | Trigger |
| --- | --- | --- |
| `mis-aligned` | high | `alignment_grade` ≤ 2 |
| `orphaned` | high | level ∈ {individual, team, department} AND `parent_objective_id` IS NULL |
| `non-smart` | high | `smart_quality` ≤ 1 |
| `unmeasurable` | high | no KR of type `numeric` or `milestone` (i.e. only binary or none) |
| `no-dri` | high | DRI participant missing |
| `committed-at-risk` | high | `stretch_tier = committed` AND `progress_percent` < 50 AND ≥ 50 % of cycle elapsed |
| `pace-collapse` | high | `pace_deviation_percent` ≤ −50 |
| `confidence-collapse` | medium | confidence dropped ≥ 3 deciles since previous check-in |
| `stale-check-in` | medium | days since last check-in > max(14, 25 % of cycle length) |
| `cascading-broken` | medium | `parent_objective_id` references an objective whose status is `retired`, `cancelled`, or `missed` |
| `over-scoped` | low | KR count > 5 (UI-capped, kept as a guard for imported data) |
| `moonshot-progress` | low (positive) | `stretch_tier = moonshot` AND `progress_percent` ≥ 70 — worth recognising |

## 5. SQL data model

Liquibase PostgreSQL migrations under
`forms/objectives-and-key-results-tracker/sql/`. Most fields are
inline on the parent `okr_objective` table with section-prefixed columns
(following the issue-tracker pattern); child tables exist only for true
1-to-many relationships (Key Results and Check-ins).

### Migration files

| # | File | Purpose |
| --- | --- | --- |
| 0 | `00_extensions.sql` | `pgcrypto`, `pg_trgm` |
| 1 | `01_create_function_set_updated_at.sql` | Shared trigger function |
| 2 | `02_create_table_reporter.sql` | Person who submitted the form |
| 3 | `03_create_table_participant.sql` | Generic participant rows linked to an objective |
| 4 | `04_create_table_okr_objective.sql` | Parent row — metadata, all section fields, seven raw scores |
| 5 | `05_create_table_okr_key_result.sql` | 1–5 KRs per objective (true 1-to-many) |
| 6 | `06_create_table_okr_check_in.sql` | Many per objective; preserves history of progress narratives |
| 7 | `07_create_table_okr_grade.sql` | 1:1 with `okr_objective`; computed + signed RAG |
| 8 | `08_create_table_okr_grade_rule.sql` | Rule that drove the composite RAG |
| 9 | `09_create_table_okr_grade_flag.sql` | One row per flag triggered |

### `okr_objective` — selected columns

```
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
created_at, updated_at, deleted_at
reporter_id UUID NOT NULL REFERENCES reporter(id) ON DELETE CASCADE
parent_objective_id UUID REFERENCES okr_objective(id)  -- self-ref, nullable

status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','active','at-risk','achieved','missed','retired','cancelled'))
level VARCHAR(20) NOT NULL DEFAULT ''
    CHECK (level IN ('individual','team','department','company',''))
cycle VARCHAR(20) NOT NULL DEFAULT ''
    CHECK (cycle IN ('monthly','quarterly','half-yearly','annual','custom',''))
cycle_start_date DATE
cycle_end_date DATE

team_or_org_name VARCHAR(255) NOT NULL DEFAULT ''
strategic_theme VARCHAR(255) NOT NULL DEFAULT ''
external_reference VARCHAR(255) NOT NULL DEFAULT ''

-- Step 2: Objective
obj_title VARCHAR(500) NOT NULL DEFAULT ''
obj_long_description TEXT NOT NULL DEFAULT ''

-- Step 4: Strategic alignment
sa_parent_summary TEXT NOT NULL DEFAULT ''
sa_business_value_statement TEXT NOT NULL DEFAULT ''

-- Step 6: Initiatives
in_initiatives TEXT NOT NULL DEFAULT ''
in_supporting_links TEXT NOT NULL DEFAULT ''

-- Step 7: Risks & dependencies
rk_known_risks TEXT NOT NULL DEFAULT ''
rk_dependencies TEXT NOT NULL DEFAULT ''
rk_blockers TEXT NOT NULL DEFAULT ''
rk_mitigation_plans TEXT NOT NULL DEFAULT ''

-- Step 9: Forecast
fc_expected_end_state TEXT NOT NULL DEFAULT ''
fc_residual_risk TEXT NOT NULL DEFAULT ''

-- Raw input scores (the seven scales)
score_by_progress_percent          NUMERIC(5,2)   -- 0..100
score_by_confidence_decile         INTEGER        -- 1..10
score_by_stretch_tier              INTEGER        -- 1..3
score_by_alignment_grade           INTEGER        -- 1..5
score_by_impact_tier               INTEGER        -- 1..5
score_by_smart_quality             INTEGER        -- 0..5
score_by_pace_deviation_percent    NUMERIC(5,2)   -- -100..+100
```

Indexes: `reporter_id`, `parent_objective_id`, `status`, `level`, `cycle`,
plus a GIN trigram index on `obj_title` for search.

### `okr_key_result` — 1–5 per objective

```
id UUID PRIMARY KEY
okr_objective_id UUID NOT NULL FK
position INTEGER NOT NULL CHECK (position BETWEEN 1 AND 5)
UNIQUE (okr_objective_id, position)

title VARCHAR(500) NOT NULL DEFAULT ''
kr_type VARCHAR(20) NOT NULL DEFAULT ''
    CHECK (kr_type IN ('numeric','milestone','binary',''))
unit VARCHAR(40) NOT NULL DEFAULT ''       -- e.g. 'USD','users','%','count','-'
start_value, current_value, target_value NUMERIC(20,4)  -- nullable for non-numeric types
milestones_json JSONB                      -- ordered list for kr_type='milestone'
binary_done BOOLEAN                        -- for kr_type='binary'
owner_name VARCHAR(255) NOT NULL DEFAULT ''
due_date DATE
progress_fraction NUMERIC(6,4)             -- computed; 0.0..1.0
```

### `okr_check_in` — many per objective

```
id UUID PRIMARY KEY
okr_objective_id UUID NOT NULL FK
checked_in_at TIMESTAMPTZ NOT NULL DEFAULT now()
narrative TEXT NOT NULL DEFAULT ''
since_last_changes TEXT NOT NULL DEFAULT ''
blockers TEXT NOT NULL DEFAULT ''
asks TEXT NOT NULL DEFAULT ''
confidence_decile_at_check_in INTEGER  -- snapshot used by confidence-collapse flag
```

### `okr_grade` — 1:1 with `okr_objective`

Same shape as `issue_tracker_grade`: echoes the seven scores, plus
`computed_composite_rag` and `final_composite_rag` ∈
`('green','amber','red','')`, `override_reason`, a `recommendation` ∈
`('continue','escalate','re-scope','retire','split','merge','')`,
`triage_notes`, `signed_by`, `signed_at`, `graded_at`.

`okr_grade_rule` and `okr_grade_flag` have the same structure as their
issue-tracker counterparts.

### Conventions confirmed

UUIDv4 primary keys; `created_at` / `updated_at` / `deleted_at` on every
table; snake_case throughout SQL and Rust; empty string `''` default for
unanswered text fields; `null` for unanswered numerics.

## 6. Outputs, front-ends, and full-stack

### Outputs

| Format | Purpose |
| --- | --- |
| HTML report preview | In-browser review of the signed objective with all sections and computed RAG |
| PDF download | Via `pdfmake`, identical layout to the HTML preview, suitable for archival |
| FHIR R5 JSON | One `Goal` resource per objective; KRs map to `Goal.target[]`; check-ins to `Provenance`; auto-generated by `bin/fhir-r5/generate-fhir-r5-representations.py` from the SQL migrations |
| XML + DTD | Per-table XML representation auto-generated by `bin/xml-representations/generate-xml-representations.py` |
| Plain-text summary | Triage-line for chat / email pasting (level, RAG, progress, confidence, KR list, flags) |

### Front-end and full-stack sub-projects

| Sub-project | Purpose |
| --- | --- |
| `front-end-form-with-html/` | Static single-page wizard, vanilla HTML + JS, no build step |
| `front-end-form-with-svelte/` | SvelteKit + Tailwind wizard with `Step01..Step10` components in `src/lib/components/ui/` |
| `front-end-dashboard-with-html/` | HTML table dashboard — one row per objective |
| `front-end-dashboard-with-svelte/` | SvelteKit + SVAR Grid dashboard with filters by level / status / RAG / owner / parent / cycle and KR-expanding row detail |
| `full-stack-with-loco-tera-htmx-alpine/` | Rust backend (axum + Loco) + Tera templates + HTMX + Alpine.js; server-rendered wizard and dashboard with PostgreSQL persistence |
| `full-stack-with-loco-tera-htmx-alpine-setup` | Executable shell script running `cargo loco generate scaffold` for each entity (`reporter`, `participant`, `okr_objective`, `okr_key_result`, `okr_check_in`, `okr_grade`, `okr_grade_rule`, `okr_grade_flag`) |

### Dashboard columns (Svelte + SVAR Grid)

`title` · `level` · `parent_objective_summary` · `dri` · `cycle` · `RAG` ·
`progress %` · `confidence /10` · `# KRs` · `# flags` · `last_check_in_at`.

Filters: level, status, RAG, owner, parent, cycle. Click a row → expanded
panel showing each KR with its `progress_fraction`, all flags with
priority, and the latest check-in narrative.

### Scoring engine

Pure TypeScript module in
`front-end-form-with-svelte/src/lib/scoring/` and pure Rust module under
the full-stack `crates/scoring/`. Both operate on the same input shape
(seven raw scores + KR rows + cycle dates) and produce the same
`{ computed_composite_rag, rules_fired, flags }` output. They are
unit-tested against shared fixtures so the front-end preview matches
the back-end recompute.

## 7. Compliance and references

- Doerr, J. *Measure What Matters.* 2018 — OKR origin and practice.
- Doran, G. T. *There's a S.M.A.R.T. way to write management's goals
  and objectives.* Management Review, 1981.
- Clegg, D. & Barker, R. *Case Method Fast-Track: A RAD Approach.*
  Addison-Wesley, 1994 — origin of MoSCoW prioritisation.
- Project Management Institute — earned-value management (SPI / CPI).
- ISO/IEC/IEEE 26514:2022 — *Design and development of information
  for users.*
- ISO 31000:2018 — *Risk management: Guidelines.*
- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — relevant when
  the OKR tracker is used inside a regulated quality-management system.

## 8. Verify

```sh
bin/test-form objectives-and-key-results-tracker
```
