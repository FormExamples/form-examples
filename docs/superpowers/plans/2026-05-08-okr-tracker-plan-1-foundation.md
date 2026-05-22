# OKR Tracker — Plan 1: Foundation (scaffold + SQL + XML + FHIR + scoring engine)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the foundation of the `objectives-and-key-results-tracker` form: scaffolded directory, ten Liquibase SQL migrations, auto-generated XML and FHIR R5 representations, and a pure scoring engine implemented in TypeScript (Vitest) and Rust (`cargo test`) against a shared JSON fixture set.

**Architecture:** Mirror the existing `forms/issue-tracker/` scaffold. The scoring engine has identical TS and Rust ports living under `front-end-form-with-svelte/src/lib/engine/` and `full-stack-with-loco-tera-htmx-alpine/src/scoring/`. Both ports consume the same fixtures from `forms/objectives-and-key-results-tracker/test-fixtures/scoring/*.json`. SQL is the source of truth; XML and FHIR JSON are auto-generated from the migrations.

**Tech Stack:** PostgreSQL 18 + Liquibase SQL format, TypeScript 5 + Vitest 3, Rust 2024 edition + cargo test, Python 3 generation scripts (existing repo tooling).

**Reference spec:** [`docs/superpowers/specs/2026-05-08-objectives-and-key-results-tracker-design.md`](../specs/2026-05-08-objectives-and-key-results-tracker-design.md)

**Out of scope (covered by later plans):** wizard UI in HTML and SvelteKit; HTML and Svelte dashboards; full Loco / axum / Tera / HTMX / Alpine.js Rust app; PDF export.

**Plan-1 acceptance gate:** all of (a) `psql` roundtrip script applies migrations and inserts/selects pass; (b) `bin/xml-representations/generate-xml-representations.py forms/objectives-and-key-results-tracker` exits 0 and produces non-empty XML+DTD per table; (c) `bin/fhir-r5/generate-fhir-r5-representations.py forms/objectives-and-key-results-tracker` exits 0 and produces non-empty JSON per table; (d) `cd forms/objectives-and-key-results-tracker/front-end-form-with-svelte && pnpm install && pnpm test` exits 0 with all scoring-engine tests passing; (e) `cd forms/objectives-and-key-results-tracker/full-stack-with-loco-tera-htmx-alpine && cargo test` exits 0 with all scoring tests passing.

`bin/test-form objectives-and-key-results-tracker` is **not** a Plan-1 gate — it requires the wizard templates and full Loco scaffold delivered by later plans.

---

## Phase A — Scaffold and form-level docs

### Task 1: Scaffold the form directory

**Files:**
- Run: `bin/create-form objectives-and-key-results-tracker`
- Move: `objectives-and-key-results-tracker/seed.md` → `forms/objectives-and-key-results-tracker/seed.md`
- Remove: empty staging directory `objectives-and-key-results-tracker/`

- [ ] **Step 1: Run the scaffold script**

```sh
cd "$(git rev-parse --show-toplevel)"
bin/create-form objectives-and-key-results-tracker
```

Expected: prints `mkdir -p` lines and rsyncs the `skel/` template into `forms/objectives-and-key-results-tracker/`. Verify with:

```sh
ls forms/objectives-and-key-results-tracker
```

Expected listing: `AGENTS.md  CLAUDE.md  doc/  fhir-r5/  front-end-dashboard-with-html/  front-end-dashboard-with-svelte/  front-end-form-with-html/  front-end-form-with-svelte/  full-stack-with-loco-tera-htmx-alpine/  full-stack-with-loco-tera-htmx-alpine-new/  index.md  plan.md  README.md  sql-migrations/  tasks.md  xml-representations/`

- [ ] **Step 2: Move the seed file from the staging directory**

```sh
mv objectives-and-key-results-tracker/seed.md forms/objectives-and-key-results-tracker/seed.md
rmdir objectives-and-key-results-tracker
```

- [ ] **Step 3: Commit the scaffold**

```sh
git add forms/objectives-and-key-results-tracker
git rm -r --cached objectives-and-key-results-tracker 2>/dev/null || true
git commit -m "Scaffold objectives-and-key-results-tracker form"
```

---

### Task 2: Write `index.md` for the form

**Files:**
- Modify: `forms/objectives-and-key-results-tracker/index.md`

- [ ] **Step 1: Write `index.md` (replace the empty file)**

```markdown
# Objectives and Key Results tracker

A general-purpose Objectives and Key Results (OKR) tracker. Each submission
captures one Objective with its 1–5 Key Results through a single-page,
ten-step wizard, applies a seven-axis scoring engine, and produces a
signed report with a composite Red / Amber / Green status and a list of
risk flags.

This form is the second non-clinical sibling in the monorepo (after
`issue-tracker`): it reuses the same scaffold (single-page wizard → SQL
→ XML + DTD → FHIR R5 → four front-ends + Rust full-stack) but treats
the *objective itself* as the subject.

## Scope and intended users

- **Setting:** team OKR rituals, departmental planning, company strategy
  reviews, individual performance objectives, quarterly business reviews.
- **Users:** OKR owners (DRIs), team leads, department heads, executives,
  OKR coaches, programme managers.
- **Subjects:** any objective at any organisational level — individual,
  team, department, or company.

## Ten-step single-page wizard

| # | Step | Captures |
| --- | --- | --- |
| 1 | Reporter & cycle | reporter id, role, level, cycle, cycle_start_date, cycle_end_date |
| 2 | Objective | title, long description, strategic theme, parent_objective_id |
| 3 | Participants | DRI, contributors, reviewers, stakeholders to inform |
| 4 | Strategic alignment | how this ladders to the parent / mission, business-value statement |
| 5 | Key Results | 1–5 KRs, each: title, type, start/current/target value, unit, owner, due date |
| 6 | Initiatives | planned actions, projects, programmes that drive each KR |
| 7 | Risks & dependencies | known risks, blockers, external dependencies, mitigation plans |
| 8 | Check-in narrative | latest update, what changed, current blockers, asks |
| 9 | Forecast | per-KR end-of-cycle confidence, expected final value, residual risk |
| 10 | Score & sign-off | seven scores, computed RAG, risk flags, override, signature |

## Seven scoring scales

| # | Score | Range | Origin |
| --- | --- | --- | --- |
| 1 | progress_percent | 0–100 | Doerr, *Measure What Matters* (2018) |
| 2 | confidence_decile | 1–10 | Industry practice (Atlassian, Asana) |
| 3 | stretch_tier | 1–3 | Google OKR — committed / aspirational / moonshot |
| 4 | alignment_grade | 1–5 | Enterprise OKR practice (Profit.co, Quantive) |
| 5 | impact_tier | 1–5 | MoSCoW prioritisation (Clegg & Barker, 1994) |
| 6 | smart_quality | 0–5 | Doran (1981) — SMART criteria count |
| 7 | pace_deviation_percent | −100..+100 | PMI earned-value analysis (SPI/CPI) |

Composite RAG uses the worst-band-finding algorithm (modulated by
stretch_tier for the progress threshold). Twelve risk flags are
computed independently.

See [the design spec](../../docs/superpowers/specs/2026-05-08-objectives-and-key-results-tracker-design.md)
for the full data model, RAG thresholds, and flag triggers.

## Verify

```sh
bin/test-form objectives-and-key-results-tracker
```
```

- [ ] **Step 2: Commit**

```sh
git add forms/objectives-and-key-results-tracker/index.md
git commit -m "OKR tracker: write index.md"
```

---

### Task 3: Author `AGENTS.md`, `plan.md`, `tasks.md`

**Files:**
- Modify: `forms/objectives-and-key-results-tracker/AGENTS.md`
- Modify: `forms/objectives-and-key-results-tracker/plan.md`
- Modify: `forms/objectives-and-key-results-tracker/tasks.md`

- [ ] **Step 1: Write `AGENTS.md`**

```markdown
# Objectives and Key Results tracker — agent instructions

The OKR tracker form. See [`index.md`](index.md) for scope, scoring scales,
RAG thresholds, and risk flags. See the design spec at
[`docs/superpowers/specs/2026-05-08-objectives-and-key-results-tracker-design.md`](../../docs/superpowers/specs/2026-05-08-objectives-and-key-results-tracker-design.md)
for the full data model.

## Patterns

- Closest sibling: `forms/issue-tracker/`. When in doubt, mirror its
  layout and naming.
- The scoring engine has identical TS and Rust ports, sharing JSON
  fixtures under `test-fixtures/scoring/`.
- SQL is the source of truth. XML and FHIR JSON are auto-generated by
  scripts under `bin/xml-representations/` and `bin/fhir-r5/`.
- Wizard is one continuous single-page form (no multi-page wizards).

## Per-stack documentation

- [Front-end with SvelteKit / Tailwind / SVAR](../../AGENTS/front-end-with-sveltekit-tailwind-svar.md)
- [Full-stack with Loco / Tera / HTMX / Alpine](../../AGENTS/full-stack-with-loco-tera-htmx-alpine.md)
- [SQL migrations](../../AGENTS/sql-migrations.md)
- [XML representations](../../AGENTS/xml-representations.md)
- [FHIR HL7 R5](../../AGENTS/fhir-r5.md)
```

- [ ] **Step 2: Write `plan.md`** (a status summary, not the implementation plan itself)

```markdown
# OKR tracker — implementation plan

Implementation is split across six plans under
`docs/superpowers/plans/`. Each plan produces a working, testable
artefact on its own.

| # | Plan | Status |
| --- | --- | --- |
| 1 | [Foundation: SQL + XML + FHIR + scoring engine](../../docs/superpowers/plans/2026-05-08-okr-tracker-plan-1-foundation.md) | in progress |
| 2 | front-end-form-with-html (vanilla wizard) | pending |
| 3 | front-end-form-with-svelte (SvelteKit wizard) | pending |
| 4 | front-end-dashboard-with-html | pending |
| 5 | front-end-dashboard-with-svelte (SVAR Grid) | pending |
| 6 | full-stack-with-loco-tera-htmx-alpine | pending |
```

- [ ] **Step 3: Write `tasks.md`**

```markdown
# OKR tracker — task list

- [ ] Plan 1: Foundation — scaffold, SQL migrations, XML, FHIR, scoring engine
- [ ] Plan 2: HTML wizard
- [ ] Plan 3: SvelteKit wizard
- [ ] Plan 4: HTML dashboard
- [ ] Plan 5: Svelte + SVAR dashboard
- [ ] Plan 6: Full-stack Rust app
```

- [ ] **Step 4: Commit**

```sh
git add forms/objectives-and-key-results-tracker/AGENTS.md \
        forms/objectives-and-key-results-tracker/plan.md \
        forms/objectives-and-key-results-tracker/tasks.md
git commit -m "OKR tracker: author AGENTS.md, plan.md, tasks.md"
```

---

## Phase B — SQL migrations

All migrations are Liquibase SQL format (`--liquibase formatted sql`,
`--changeset author:N`, matching `--rollback`). Conventions per
[`AGENTS/sql-migrations.md`](../../AGENTS/sql-migrations.md): UUIDv4 PKs
via `gen_random_uuid()`, canonical first four columns, snake_case,
comprehensive `COMMENT ON` for every table and column, GIN trigram
indexes on free-text search columns.

### Task 4: `00_extensions.sql`

**Files:**
- Create: `forms/objectives-and-key-results-tracker/sql-migrations/00_extensions.sql`

- [ ] **Step 1: Write the migration**

```sql
--liquibase formatted sql

--changeset author:1
CREATE EXTENSION IF NOT EXISTS pgcrypto;
--rollback DROP EXTENSION IF EXISTS pgcrypto;

--changeset author:2
CREATE EXTENSION IF NOT EXISTS pg_trgm;
--rollback DROP EXTENSION IF EXISTS pg_trgm;
```

- [ ] **Step 2: Verify it parses by piping into psql against a scratch DB**

```sh
createdb okr_scratch || true
psql -d okr_scratch -v ON_ERROR_STOP=1 -f forms/objectives-and-key-results-tracker/sql-migrations/00_extensions.sql
```

Expected: `CREATE EXTENSION` success messages with no error.

- [ ] **Step 3: Commit**

```sh
git add forms/objectives-and-key-results-tracker/sql-migrations/00_extensions.sql
git commit -m "OKR tracker: SQL 00_extensions"
```

---

### Task 5: `01_create_function_set_updated_at.sql`

**Files:**
- Create: `forms/objectives-and-key-results-tracker/sql-migrations/01_create_function_set_updated_at.sql`

- [ ] **Step 1: Write the migration**

```sql
--liquibase formatted sql

--changeset author:1
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--rollback DROP FUNCTION IF EXISTS set_updated_at();

COMMENT ON FUNCTION set_updated_at() IS
    'Trigger function: set NEW.updated_at = now() on every row update.';
```

- [ ] **Step 2: Verify it loads**

```sh
psql -d okr_scratch -v ON_ERROR_STOP=1 -f forms/objectives-and-key-results-tracker/sql-migrations/01_create_function_set_updated_at.sql
```

Expected: `CREATE FUNCTION`, `COMMENT`.

- [ ] **Step 3: Commit**

```sh
git add forms/objectives-and-key-results-tracker/sql-migrations/01_create_function_set_updated_at.sql
git commit -m "OKR tracker: SQL 01_create_function_set_updated_at"
```

---

### Task 6: `02_create_table_reporter.sql`

**Files:**
- Create: `forms/objectives-and-key-results-tracker/sql-migrations/02_create_table_reporter.sql`
- Reference: `forms/issue-tracker/sql-migrations/02_create_table_reporter.sql` (mirror structure)

- [ ] **Step 1: Read the issue-tracker reporter migration to mirror structure**

```sh
cat forms/issue-tracker/sql-migrations/02_create_table_reporter.sql
```

- [ ] **Step 2: Write the OKR reporter migration** (identical schema; the table is generic)

```sql
--liquibase formatted sql

--changeset author:1
CREATE TABLE reporter (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_reporter_updated_at
    BEFORE UPDATE ON reporter
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE reporter IS
    'Person who submitted an OKR objective via the wizard.';
COMMENT ON COLUMN reporter.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN reporter.created_at IS 'Timestamp when this row was created.';
COMMENT ON COLUMN reporter.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN reporter.deleted_at IS 'Timestamp when the record was soft-deleted.';
COMMENT ON COLUMN reporter.name IS 'Display name of the reporter.';
COMMENT ON COLUMN reporter.email IS 'Email address of the reporter.';
COMMENT ON COLUMN reporter.role IS 'Free-text role label (e.g. team lead, OKR coach, executive).';

--rollback DROP TABLE reporter;
```

- [ ] **Step 3: Apply and verify**

```sh
psql -d okr_scratch -v ON_ERROR_STOP=1 -f forms/objectives-and-key-results-tracker/sql-migrations/02_create_table_reporter.sql
psql -d okr_scratch -c "INSERT INTO reporter (name) VALUES ('Alice') RETURNING id;"
```

Expected: a UUID is printed.

- [ ] **Step 4: Commit**

```sh
git add forms/objectives-and-key-results-tracker/sql-migrations/02_create_table_reporter.sql
git commit -m "OKR tracker: SQL 02_create_table_reporter"
```

---

### Task 7: `03_create_table_participant.sql`

**Files:**
- Create: `forms/objectives-and-key-results-tracker/sql-migrations/03_create_table_participant.sql`

- [ ] **Step 1: Write the migration**

```sql
--liquibase formatted sql

--changeset author:1
CREATE TABLE participant (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    okr_objective_id UUID NOT NULL,
    role TEXT NOT NULL DEFAULT ''
        CHECK (role IN ('dri','contributor','reviewer','stakeholder','observer','')),
    name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_participant_updated_at
    BEFORE UPDATE ON participant
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX participant_index_okr_objective_id ON participant(okr_objective_id);

COMMENT ON TABLE participant IS
    'A participant linked to an OKR objective: DRI, contributor, reviewer, stakeholder, or observer.';
COMMENT ON COLUMN participant.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN participant.created_at IS 'Timestamp when this row was created.';
COMMENT ON COLUMN participant.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN participant.deleted_at IS 'Timestamp when the record was soft-deleted.';
COMMENT ON COLUMN participant.okr_objective_id IS
    'Foreign key to okr_objective. The FK constraint is added in the okr_objective migration via ALTER TABLE.';
COMMENT ON COLUMN participant.role IS
    'Participant role: dri (Directly Responsible Individual), contributor, reviewer, stakeholder, or observer.';
COMMENT ON COLUMN participant.name IS 'Display name of the participant.';
COMMENT ON COLUMN participant.email IS 'Email address of the participant.';
COMMENT ON COLUMN participant.notes IS 'Free-text notes about the participant role.';

--rollback DROP TABLE participant;
```

Note: `okr_objective_id` cannot be a `REFERENCES` constraint here because `okr_objective` does not exist yet. The FK is added in Task 8 via `ALTER TABLE`.

- [ ] **Step 2: Apply**

```sh
psql -d okr_scratch -v ON_ERROR_STOP=1 -f forms/objectives-and-key-results-tracker/sql-migrations/03_create_table_participant.sql
```

- [ ] **Step 3: Commit**

```sh
git add forms/objectives-and-key-results-tracker/sql-migrations/03_create_table_participant.sql
git commit -m "OKR tracker: SQL 03_create_table_participant"
```

---

### Task 8: `04_create_table_okr_objective.sql`

This is the largest migration — the parent table.

**Files:**
- Create: `forms/objectives-and-key-results-tracker/sql-migrations/04_create_table_okr_objective.sql`

- [ ] **Step 1: Write the migration**

```sql
--liquibase formatted sql

--changeset author:1
CREATE TABLE okr_objective (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    reporter_id UUID NOT NULL REFERENCES reporter(id) ON DELETE CASCADE,
    parent_objective_id UUID REFERENCES okr_objective(id) ON DELETE SET NULL,

    status TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft','active','at-risk','achieved','missed','retired','cancelled')),
    level TEXT NOT NULL DEFAULT ''
        CHECK (level IN ('individual','team','department','company','')),
    cycle TEXT NOT NULL DEFAULT ''
        CHECK (cycle IN ('monthly','quarterly','half-yearly','annual','custom','')),
    cycle_start_date DATE,
    cycle_end_date DATE,

    team_or_org_name TEXT NOT NULL DEFAULT '',
    strategic_theme TEXT NOT NULL DEFAULT '',
    external_reference TEXT NOT NULL DEFAULT '',

    -- Step 2: Objective
    obj_title TEXT NOT NULL DEFAULT '',
    obj_long_description TEXT NOT NULL DEFAULT '',

    -- Step 4: Strategic alignment
    sa_parent_summary TEXT NOT NULL DEFAULT '',
    sa_business_value_statement TEXT NOT NULL DEFAULT '',

    -- Step 6: Initiatives
    in_initiatives TEXT NOT NULL DEFAULT '',
    in_supporting_links TEXT NOT NULL DEFAULT '',

    -- Step 7: Risks & dependencies
    rk_known_risks TEXT NOT NULL DEFAULT '',
    rk_dependencies TEXT NOT NULL DEFAULT '',
    rk_blockers TEXT NOT NULL DEFAULT '',
    rk_mitigation_plans TEXT NOT NULL DEFAULT '',

    -- Step 9: Forecast
    fc_expected_end_state TEXT NOT NULL DEFAULT '',
    fc_residual_risk TEXT NOT NULL DEFAULT '',

    -- Raw input scores (the seven scales)
    score_by_progress_percent NUMERIC(5,2)
        CHECK (score_by_progress_percent IS NULL OR score_by_progress_percent BETWEEN 0 AND 100),
    score_by_confidence_decile INTEGER
        CHECK (score_by_confidence_decile IS NULL OR score_by_confidence_decile BETWEEN 1 AND 10),
    score_by_stretch_tier INTEGER
        CHECK (score_by_stretch_tier IS NULL OR score_by_stretch_tier BETWEEN 1 AND 3),
    score_by_alignment_grade INTEGER
        CHECK (score_by_alignment_grade IS NULL OR score_by_alignment_grade BETWEEN 1 AND 5),
    score_by_impact_tier INTEGER
        CHECK (score_by_impact_tier IS NULL OR score_by_impact_tier BETWEEN 1 AND 5),
    score_by_smart_quality INTEGER
        CHECK (score_by_smart_quality IS NULL OR score_by_smart_quality BETWEEN 0 AND 5),
    score_by_pace_deviation_percent NUMERIC(5,2)
        CHECK (score_by_pace_deviation_percent IS NULL OR score_by_pace_deviation_percent BETWEEN -100 AND 100)
);

CREATE TRIGGER trigger_okr_objective_updated_at
    BEFORE UPDATE ON okr_objective
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

ALTER TABLE participant
    ADD CONSTRAINT participant_okr_objective_id_fkey
    FOREIGN KEY (okr_objective_id) REFERENCES okr_objective(id) ON DELETE CASCADE;

CREATE INDEX okr_objective_index_reporter_id ON okr_objective(reporter_id);
CREATE INDEX okr_objective_index_parent_objective_id ON okr_objective(parent_objective_id);
CREATE INDEX okr_objective_index_status ON okr_objective(status);
CREATE INDEX okr_objective_index_level ON okr_objective(level);
CREATE INDEX okr_objective_index_cycle ON okr_objective(cycle);
CREATE INDEX okr_objective_index_obj_title_trgm
    ON okr_objective
    USING GIN (obj_title gin_trgm_ops);

COMMENT ON TABLE okr_objective IS
    'Main OKR objective row. Holds reporter and metadata, all step fields, and the seven raw input scores. Computed scores live in okr_grade.';
COMMENT ON COLUMN okr_objective.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN okr_objective.created_at IS 'Timestamp when this row was created.';
COMMENT ON COLUMN okr_objective.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN okr_objective.deleted_at IS 'Timestamp when the record was soft-deleted.';
COMMENT ON COLUMN okr_objective.reporter_id IS 'Foreign key to the reporter who submitted the objective.';
COMMENT ON COLUMN okr_objective.parent_objective_id IS
    'Self-referential foreign key: the parent objective this one ladders up to. NULL for top-level objectives.';
COMMENT ON COLUMN okr_objective.status IS
    'Lifecycle status: draft, active, at-risk, achieved, missed, retired, cancelled.';
COMMENT ON COLUMN okr_objective.level IS
    'Organisational level: individual, team, department, company.';
COMMENT ON COLUMN okr_objective.cycle IS
    'Time horizon: monthly, quarterly, half-yearly, annual, custom.';
COMMENT ON COLUMN okr_objective.cycle_start_date IS 'First day of the OKR cycle.';
COMMENT ON COLUMN okr_objective.cycle_end_date IS 'Last day of the OKR cycle.';
COMMENT ON COLUMN okr_objective.team_or_org_name IS 'Owning team or organisational unit name.';
COMMENT ON COLUMN okr_objective.strategic_theme IS 'Strategic theme or pillar this objective ladders to.';
COMMENT ON COLUMN okr_objective.external_reference IS 'External tracker id, ticket, or strategy doc reference.';
COMMENT ON COLUMN okr_objective.obj_title IS 'Step 2: one-sentence qualitative objective statement.';
COMMENT ON COLUMN okr_objective.obj_long_description IS 'Step 2: free-text long description of the objective.';
COMMENT ON COLUMN okr_objective.sa_parent_summary IS
    'Step 4: how this objective ladders to the parent or to the mission.';
COMMENT ON COLUMN okr_objective.sa_business_value_statement IS
    'Step 4: business value statement — why this objective matters.';
COMMENT ON COLUMN okr_objective.in_initiatives IS
    'Step 6: planned actions, projects, programmes that drive each KR.';
COMMENT ON COLUMN okr_objective.in_supporting_links IS 'Step 6: free-text supporting links and references.';
COMMENT ON COLUMN okr_objective.rk_known_risks IS 'Step 7: known risks to achieving the objective.';
COMMENT ON COLUMN okr_objective.rk_dependencies IS 'Step 7: external dependencies.';
COMMENT ON COLUMN okr_objective.rk_blockers IS 'Step 7: current blockers.';
COMMENT ON COLUMN okr_objective.rk_mitigation_plans IS 'Step 7: planned mitigations for the risks above.';
COMMENT ON COLUMN okr_objective.fc_expected_end_state IS
    'Step 9: forecast — expected end-of-cycle state per KR (free text).';
COMMENT ON COLUMN okr_objective.fc_residual_risk IS 'Step 9: residual risk to the objective at end-of-cycle.';
COMMENT ON COLUMN okr_objective.score_by_progress_percent IS
    'Score 1 of 7: progress percent 0-100. Mean of per-KR progress_fraction (clamped) expressed as percent.';
COMMENT ON COLUMN okr_objective.score_by_confidence_decile IS
    'Score 2 of 7: owner confidence decile 1-10.';
COMMENT ON COLUMN okr_objective.score_by_stretch_tier IS
    'Score 3 of 7: stretch tier 1-3 — 1=committed, 2=aspirational, 3=moonshot.';
COMMENT ON COLUMN okr_objective.score_by_alignment_grade IS
    'Score 4 of 7: alignment grade 1-5 to parent or strategic theme.';
COMMENT ON COLUMN okr_objective.score_by_impact_tier IS
    'Score 5 of 7: impact tier 1-5 — business value if achieved.';
COMMENT ON COLUMN okr_objective.score_by_smart_quality IS
    'Score 6 of 7: SMART criteria count 0-5 (Specific, Measurable, Achievable, Relevant, Time-bound).';
COMMENT ON COLUMN okr_objective.score_by_pace_deviation_percent IS
    'Score 7 of 7: pace deviation percent -100..+100 from expected linear pace at this point in the cycle.';

--rollback DROP TABLE okr_objective CASCADE;
```

- [ ] **Step 2: Apply and verify a roundtrip**

```sh
psql -d okr_scratch -v ON_ERROR_STOP=1 -f forms/objectives-and-key-results-tracker/sql-migrations/04_create_table_okr_objective.sql
psql -d okr_scratch -c "INSERT INTO reporter (name) VALUES ('Alice') RETURNING id" >/tmp/r.txt
RID=$(awk 'NR==3{print $1}' /tmp/r.txt)
psql -d okr_scratch -c "INSERT INTO okr_objective (reporter_id, level, cycle, obj_title) VALUES ('$RID', 'team', 'quarterly', 'Reduce churn by 30%') RETURNING id"
```

Expected: a UUID is printed.

- [ ] **Step 3: Verify CHECK constraints reject invalid values**

```sh
psql -d okr_scratch -c "INSERT INTO okr_objective (reporter_id, level) VALUES ('$RID', 'galactic')" 2>&1 | grep -q "violates check constraint" && echo "OK: rejected invalid level"
```

Expected: prints `OK: rejected invalid level`.

- [ ] **Step 4: Commit**

```sh
git add forms/objectives-and-key-results-tracker/sql-migrations/04_create_table_okr_objective.sql
git commit -m "OKR tracker: SQL 04_create_table_okr_objective"
```

---

### Task 9: `05_create_table_okr_key_result.sql`

**Files:**
- Create: `forms/objectives-and-key-results-tracker/sql-migrations/05_create_table_okr_key_result.sql`

- [ ] **Step 1: Write the migration**

```sql
--liquibase formatted sql

--changeset author:1
CREATE TABLE okr_key_result (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    okr_objective_id UUID NOT NULL REFERENCES okr_objective(id) ON DELETE CASCADE,
    position INTEGER NOT NULL CHECK (position BETWEEN 1 AND 5),

    title TEXT NOT NULL DEFAULT '',
    kr_type TEXT NOT NULL DEFAULT ''
        CHECK (kr_type IN ('numeric','milestone','binary','')),
    unit TEXT NOT NULL DEFAULT '',
    start_value NUMERIC(20,4),
    current_value NUMERIC(20,4),
    target_value NUMERIC(20,4),
    milestones_json JSONB,
    binary_done BOOLEAN,
    owner_name TEXT NOT NULL DEFAULT '',
    due_date DATE,
    progress_fraction NUMERIC(6,4)
        CHECK (progress_fraction IS NULL OR progress_fraction BETWEEN 0 AND 1),

    UNIQUE (okr_objective_id, position)
);

CREATE TRIGGER trigger_okr_key_result_updated_at
    BEFORE UPDATE ON okr_key_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX okr_key_result_index_okr_objective_id ON okr_key_result(okr_objective_id);

COMMENT ON TABLE okr_key_result IS
    'A Key Result for an objective. 1-5 rows per okr_objective; UNIQUE on (okr_objective_id, position).';
COMMENT ON COLUMN okr_key_result.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN okr_key_result.created_at IS 'Timestamp when this row was created.';
COMMENT ON COLUMN okr_key_result.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN okr_key_result.deleted_at IS 'Timestamp when the record was soft-deleted.';
COMMENT ON COLUMN okr_key_result.okr_objective_id IS 'Foreign key to the parent okr_objective.';
COMMENT ON COLUMN okr_key_result.position IS 'Display order 1-5; UNIQUE per objective.';
COMMENT ON COLUMN okr_key_result.title IS 'One-sentence Key Result statement.';
COMMENT ON COLUMN okr_key_result.kr_type IS
    'Key Result type: numeric (start/current/target), milestone (ordered list), or binary (done flag).';
COMMENT ON COLUMN okr_key_result.unit IS
    'Unit of measure for numeric KRs: USD, users, percent, count, etc.';
COMMENT ON COLUMN okr_key_result.start_value IS 'Numeric KR: starting value at cycle start.';
COMMENT ON COLUMN okr_key_result.current_value IS 'Numeric KR: latest observed value.';
COMMENT ON COLUMN okr_key_result.target_value IS 'Numeric KR: target value at cycle end.';
COMMENT ON COLUMN okr_key_result.milestones_json IS
    'Milestone KR: ordered JSONB list, each {name, done, completed_at}.';
COMMENT ON COLUMN okr_key_result.binary_done IS 'Binary KR: done flag.';
COMMENT ON COLUMN okr_key_result.owner_name IS 'Optional KR-level owner name (may differ from objective DRI).';
COMMENT ON COLUMN okr_key_result.due_date IS 'Optional due date for this KR (defaults to objective cycle_end_date).';
COMMENT ON COLUMN okr_key_result.progress_fraction IS
    'Computed progress fraction 0.0-1.0; numeric → (cur-start)/(target-start) clamped, milestone → done/total, binary → 0 or 1.';

--rollback DROP TABLE okr_key_result;
```

- [ ] **Step 2: Apply and verify**

```sh
psql -d okr_scratch -v ON_ERROR_STOP=1 -f forms/objectives-and-key-results-tracker/sql-migrations/05_create_table_okr_key_result.sql
psql -d okr_scratch -c "INSERT INTO okr_key_result (okr_objective_id, position, title, kr_type) SELECT id, 1, 'Lift NPS to 50', 'numeric' FROM okr_objective LIMIT 1 RETURNING id"
```

Expected: a UUID is printed.

- [ ] **Step 3: Verify position 6 is rejected**

```sh
psql -d okr_scratch -c "INSERT INTO okr_key_result (okr_objective_id, position, title) SELECT id, 6, 'Out of range' FROM okr_objective LIMIT 1" 2>&1 | grep -q "violates check constraint" && echo "OK: rejected position 6"
```

- [ ] **Step 4: Commit**

```sh
git add forms/objectives-and-key-results-tracker/sql-migrations/05_create_table_okr_key_result.sql
git commit -m "OKR tracker: SQL 05_create_table_okr_key_result"
```

---

### Task 10: `06_create_table_okr_check_in.sql`

**Files:**
- Create: `forms/objectives-and-key-results-tracker/sql-migrations/06_create_table_okr_check_in.sql`

- [ ] **Step 1: Write the migration**

```sql
--liquibase formatted sql

--changeset author:1
CREATE TABLE okr_check_in (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    okr_objective_id UUID NOT NULL REFERENCES okr_objective(id) ON DELETE CASCADE,
    checked_in_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    narrative TEXT NOT NULL DEFAULT '',
    since_last_changes TEXT NOT NULL DEFAULT '',
    blockers TEXT NOT NULL DEFAULT '',
    asks TEXT NOT NULL DEFAULT '',
    confidence_decile_at_check_in INTEGER
        CHECK (confidence_decile_at_check_in IS NULL OR confidence_decile_at_check_in BETWEEN 1 AND 10)
);

CREATE TRIGGER trigger_okr_check_in_updated_at
    BEFORE UPDATE ON okr_check_in
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX okr_check_in_index_okr_objective_id ON okr_check_in(okr_objective_id);
CREATE INDEX okr_check_in_index_checked_in_at ON okr_check_in(checked_in_at);

COMMENT ON TABLE okr_check_in IS
    'Periodic progress check-in narrative for an objective. Many rows per okr_objective.';
COMMENT ON COLUMN okr_check_in.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN okr_check_in.created_at IS 'Timestamp when this row was created.';
COMMENT ON COLUMN okr_check_in.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN okr_check_in.deleted_at IS 'Timestamp when the record was soft-deleted.';
COMMENT ON COLUMN okr_check_in.okr_objective_id IS 'Foreign key to the parent okr_objective.';
COMMENT ON COLUMN okr_check_in.checked_in_at IS 'When this check-in was made.';
COMMENT ON COLUMN okr_check_in.narrative IS 'Free-text update narrative.';
COMMENT ON COLUMN okr_check_in.since_last_changes IS 'Summary of what changed since the previous check-in.';
COMMENT ON COLUMN okr_check_in.blockers IS 'Current blockers as of this check-in.';
COMMENT ON COLUMN okr_check_in.asks IS 'Asks for help / decisions / resources at this check-in.';
COMMENT ON COLUMN okr_check_in.confidence_decile_at_check_in IS
    'Confidence decile snapshot 1-10 at this check-in; used by the confidence-collapse flag.';

--rollback DROP TABLE okr_check_in;
```

- [ ] **Step 2: Apply and verify**

```sh
psql -d okr_scratch -v ON_ERROR_STOP=1 -f forms/objectives-and-key-results-tracker/sql-migrations/06_create_table_okr_check_in.sql
psql -d okr_scratch -c "INSERT INTO okr_check_in (okr_objective_id, narrative, confidence_decile_at_check_in) SELECT id, 'Pilot results positive', 7 FROM okr_objective LIMIT 1 RETURNING id"
```

- [ ] **Step 3: Commit**

```sh
git add forms/objectives-and-key-results-tracker/sql-migrations/06_create_table_okr_check_in.sql
git commit -m "OKR tracker: SQL 06_create_table_okr_check_in"
```

---

### Task 11: `07_create_table_okr_grade.sql`

**Files:**
- Create: `forms/objectives-and-key-results-tracker/sql-migrations/07_create_table_okr_grade.sql`

- [ ] **Step 1: Write the migration**

```sql
--liquibase formatted sql

--changeset author:1
CREATE TABLE okr_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    okr_objective_id UUID NOT NULL UNIQUE REFERENCES okr_objective(id) ON DELETE CASCADE,

    score_by_progress_percent NUMERIC(5,2)
        CHECK (score_by_progress_percent IS NULL OR score_by_progress_percent BETWEEN 0 AND 100),
    score_by_confidence_decile INTEGER
        CHECK (score_by_confidence_decile IS NULL OR score_by_confidence_decile BETWEEN 1 AND 10),
    score_by_stretch_tier INTEGER
        CHECK (score_by_stretch_tier IS NULL OR score_by_stretch_tier BETWEEN 1 AND 3),
    score_by_alignment_grade INTEGER
        CHECK (score_by_alignment_grade IS NULL OR score_by_alignment_grade BETWEEN 1 AND 5),
    score_by_impact_tier INTEGER
        CHECK (score_by_impact_tier IS NULL OR score_by_impact_tier BETWEEN 1 AND 5),
    score_by_smart_quality INTEGER
        CHECK (score_by_smart_quality IS NULL OR score_by_smart_quality BETWEEN 0 AND 5),
    score_by_pace_deviation_percent NUMERIC(5,2)
        CHECK (score_by_pace_deviation_percent IS NULL OR score_by_pace_deviation_percent BETWEEN -100 AND 100),

    computed_composite_rag TEXT NOT NULL DEFAULT ''
        CHECK (computed_composite_rag IN ('green','amber','red','')),
    final_composite_rag TEXT NOT NULL DEFAULT ''
        CHECK (final_composite_rag IN ('green','amber','red','')),
    override_reason TEXT NOT NULL DEFAULT '',

    recommendation TEXT NOT NULL DEFAULT ''
        CHECK (recommendation IN ('continue','escalate','re-scope','retire','split','merge','')),
    triage_notes TEXT NOT NULL DEFAULT '',

    signed_by TEXT NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_okr_grade_updated_at
    BEFORE UPDATE ON okr_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE okr_grade IS
    'Computed and signed-off grading result for an objective. 1:1 with okr_objective.';
COMMENT ON COLUMN okr_grade.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN okr_grade.created_at IS 'Timestamp when this row was created.';
COMMENT ON COLUMN okr_grade.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN okr_grade.deleted_at IS 'Timestamp when the record was soft-deleted.';
COMMENT ON COLUMN okr_grade.okr_objective_id IS 'Foreign key to the parent okr_objective row (UNIQUE, 1:1).';
COMMENT ON COLUMN okr_grade.score_by_progress_percent IS 'Score 1 of 7: echoed from okr_objective for dashboard joins.';
COMMENT ON COLUMN okr_grade.score_by_confidence_decile IS 'Score 2 of 7: echoed from okr_objective.';
COMMENT ON COLUMN okr_grade.score_by_stretch_tier IS 'Score 3 of 7: echoed from okr_objective.';
COMMENT ON COLUMN okr_grade.score_by_alignment_grade IS 'Score 4 of 7: echoed from okr_objective.';
COMMENT ON COLUMN okr_grade.score_by_impact_tier IS 'Score 5 of 7: echoed from okr_objective.';
COMMENT ON COLUMN okr_grade.score_by_smart_quality IS 'Score 6 of 7: echoed from okr_objective.';
COMMENT ON COLUMN okr_grade.score_by_pace_deviation_percent IS 'Score 7 of 7: echoed from okr_objective.';
COMMENT ON COLUMN okr_grade.computed_composite_rag IS
    'Composite RAG computed by the engine using the worst-band-finding algorithm: green, amber, or red.';
COMMENT ON COLUMN okr_grade.final_composite_rag IS
    'Composite RAG signed off by the reviewer (may equal or differ from computed).';
COMMENT ON COLUMN okr_grade.override_reason IS
    'Reason the reviewer set final differently from computed (mandatory when they differ).';
COMMENT ON COLUMN okr_grade.recommendation IS
    'Overall recommendation: continue, escalate, re-scope, retire, split, merge.';
COMMENT ON COLUMN okr_grade.triage_notes IS 'Free-text reviewer summary notes.';
COMMENT ON COLUMN okr_grade.signed_by IS 'Name or identifier of the reviewer who signed off.';
COMMENT ON COLUMN okr_grade.signed_at IS 'Timestamp of the reviewer electronic signature.';
COMMENT ON COLUMN okr_grade.graded_at IS 'Timestamp when the engine last computed the result.';

--rollback DROP TABLE okr_grade;
```

- [ ] **Step 2: Apply and verify**

```sh
psql -d okr_scratch -v ON_ERROR_STOP=1 -f forms/objectives-and-key-results-tracker/sql-migrations/07_create_table_okr_grade.sql
psql -d okr_scratch -c "INSERT INTO okr_grade (okr_objective_id, computed_composite_rag) SELECT id, 'amber' FROM okr_objective LIMIT 1 RETURNING id"
```

- [ ] **Step 3: Commit**

```sh
git add forms/objectives-and-key-results-tracker/sql-migrations/07_create_table_okr_grade.sql
git commit -m "OKR tracker: SQL 07_create_table_okr_grade"
```

---

### Task 12: `08_create_table_okr_grade_rule.sql`

**Files:**
- Create: `forms/objectives-and-key-results-tracker/sql-migrations/08_create_table_okr_grade_rule.sql`
- Reference: `forms/issue-tracker/sql-migrations/06_create_table_issue_tracker_grade_rule.sql`

- [ ] **Step 1: Read the reference**

```sh
cat forms/issue-tracker/sql-migrations/06_create_table_issue_tracker_grade_rule.sql
```

- [ ] **Step 2: Write the migration** (mirror the issue-tracker structure, swap the FK)

```sql
--liquibase formatted sql

--changeset author:1
CREATE TABLE okr_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    okr_grade_id UUID NOT NULL REFERENCES okr_grade(id) ON DELETE CASCADE,
    rule_id TEXT NOT NULL DEFAULT '',
    instrument TEXT NOT NULL DEFAULT ''
        CHECK (instrument IN (
            'progress','confidence','stretch','alignment',
            'impact','smart','pace','composite',''
        )),
    grade TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_okr_grade_rule_updated_at
    BEFORE UPDATE ON okr_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX okr_grade_rule_index_okr_grade_id ON okr_grade_rule(okr_grade_id);

COMMENT ON TABLE okr_grade_rule IS
    'A grading rule that fired during composite RAG computation. Many rows per okr_grade.';
COMMENT ON COLUMN okr_grade_rule.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN okr_grade_rule.created_at IS 'Timestamp when this row was created.';
COMMENT ON COLUMN okr_grade_rule.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN okr_grade_rule.deleted_at IS 'Timestamp when the record was soft-deleted.';
COMMENT ON COLUMN okr_grade_rule.okr_grade_id IS 'Foreign key to the parent okr_grade.';
COMMENT ON COLUMN okr_grade_rule.rule_id IS 'Stable rule identifier (e.g. R-PROGRESS-RED-COMMITTED).';
COMMENT ON COLUMN okr_grade_rule.instrument IS
    'Which scoring instrument fired the rule: progress, confidence, stretch, alignment, impact, smart, pace, or composite.';
COMMENT ON COLUMN okr_grade_rule.grade IS 'Grade band the rule attached: green, amber, red.';
COMMENT ON COLUMN okr_grade_rule.category IS 'Free-text category, e.g. progress, alignment, smart.';
COMMENT ON COLUMN okr_grade_rule.description IS 'Human-readable rule description.';

--rollback DROP TABLE okr_grade_rule;
```

- [ ] **Step 3: Apply and verify**

```sh
psql -d okr_scratch -v ON_ERROR_STOP=1 -f forms/objectives-and-key-results-tracker/sql-migrations/08_create_table_okr_grade_rule.sql
```

- [ ] **Step 4: Commit**

```sh
git add forms/objectives-and-key-results-tracker/sql-migrations/08_create_table_okr_grade_rule.sql
git commit -m "OKR tracker: SQL 08_create_table_okr_grade_rule"
```

---

### Task 13: `09_create_table_okr_grade_flag.sql`

**Files:**
- Create: `forms/objectives-and-key-results-tracker/sql-migrations/09_create_table_okr_grade_flag.sql`

- [ ] **Step 1: Write the migration**

```sql
--liquibase formatted sql

--changeset author:1
CREATE TABLE okr_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    okr_grade_id UUID NOT NULL REFERENCES okr_grade(id) ON DELETE CASCADE,
    flag_code TEXT NOT NULL DEFAULT ''
        CHECK (flag_code IN (
            'mis-aligned','orphaned','non-smart','unmeasurable','no-dri',
            'committed-at-risk','pace-collapse','confidence-collapse',
            'stale-check-in','cascading-broken','over-scoped','moonshot-progress',''
        )),
    priority TEXT NOT NULL DEFAULT ''
        CHECK (priority IN ('high','medium','low','')),
    description TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_okr_grade_flag_updated_at
    BEFORE UPDATE ON okr_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX okr_grade_flag_index_okr_grade_id ON okr_grade_flag(okr_grade_id);
CREATE INDEX okr_grade_flag_index_flag_code ON okr_grade_flag(flag_code);

COMMENT ON TABLE okr_grade_flag IS
    'A risk flag attached to an OKR grade. Computed independently of the composite RAG.';
COMMENT ON COLUMN okr_grade_flag.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN okr_grade_flag.created_at IS 'Timestamp when this row was created.';
COMMENT ON COLUMN okr_grade_flag.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN okr_grade_flag.deleted_at IS 'Timestamp when the record was soft-deleted.';
COMMENT ON COLUMN okr_grade_flag.okr_grade_id IS 'Foreign key to the parent okr_grade.';
COMMENT ON COLUMN okr_grade_flag.flag_code IS
    'Flag code: mis-aligned, orphaned, non-smart, unmeasurable, no-dri, committed-at-risk, pace-collapse, confidence-collapse, stale-check-in, cascading-broken, over-scoped, moonshot-progress.';
COMMENT ON COLUMN okr_grade_flag.priority IS 'Flag priority: high, medium, low.';
COMMENT ON COLUMN okr_grade_flag.description IS 'Human-readable description of why the flag fired.';

--rollback DROP TABLE okr_grade_flag;
```

- [ ] **Step 2: Apply and verify**

```sh
psql -d okr_scratch -v ON_ERROR_STOP=1 -f forms/objectives-and-key-results-tracker/sql-migrations/09_create_table_okr_grade_flag.sql
```

- [ ] **Step 3: Commit**

```sh
git add forms/objectives-and-key-results-tracker/sql-migrations/09_create_table_okr_grade_flag.sql
git commit -m "OKR tracker: SQL 09_create_table_okr_grade_flag"
```

---

## Phase C — SQL roundtrip test

### Task 14: Author and run a roundtrip shell script

**Files:**
- Create: `forms/objectives-and-key-results-tracker/sql-migrations/_roundtrip-test.sh`

- [ ] **Step 1: Write the roundtrip test script**

```sh
#!/bin/sh
# Roundtrip test: drop & recreate okr_roundtrip DB, apply all migrations,
# insert one full objective + KRs + check-in + grade + rule + flag, select back.
set -euf

DB=okr_roundtrip
HERE="$(cd "$(dirname "$0")" && pwd)"

dropdb --if-exists "$DB"
createdb "$DB"

for f in "$HERE"/0?_*.sql; do
    echo "Applying $f"
    psql -d "$DB" -v ON_ERROR_STOP=1 -f "$f"
done

psql -d "$DB" -v ON_ERROR_STOP=1 <<'SQL'
INSERT INTO reporter (id, name, email, role)
VALUES ('11111111-1111-1111-1111-111111111111', 'Alice Chen', 'alice@example.com', 'team-lead');

INSERT INTO okr_objective (id, reporter_id, status, level, cycle,
    cycle_start_date, cycle_end_date, obj_title, obj_long_description,
    score_by_progress_percent, score_by_confidence_decile, score_by_stretch_tier,
    score_by_alignment_grade, score_by_impact_tier, score_by_smart_quality,
    score_by_pace_deviation_percent)
VALUES ('22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'active', 'team', 'quarterly',
    DATE '2026-04-01', DATE '2026-06-30',
    'Reduce customer churn by 30%', 'Q2 priority for retention team',
    47.0, 6, 1, 4, 5, 4, -15.0);

INSERT INTO participant (okr_objective_id, role, name, email)
VALUES ('22222222-2222-2222-2222-222222222222', 'dri', 'Alice Chen', 'alice@example.com');

INSERT INTO okr_key_result (okr_objective_id, position, title, kr_type,
    unit, start_value, current_value, target_value, progress_fraction)
VALUES ('22222222-2222-2222-2222-222222222222', 1, 'Lift NPS from 32 to 50',
    'numeric', 'points', 32, 43, 50, 0.6111);

INSERT INTO okr_check_in (okr_objective_id, narrative,
    confidence_decile_at_check_in)
VALUES ('22222222-2222-2222-2222-222222222222', 'Pilot results positive', 7);

INSERT INTO okr_grade (id, okr_objective_id,
    score_by_progress_percent, score_by_confidence_decile, score_by_stretch_tier,
    score_by_alignment_grade, score_by_impact_tier, score_by_smart_quality,
    score_by_pace_deviation_percent,
    computed_composite_rag, final_composite_rag,
    recommendation, signed_by, signed_at)
VALUES ('33333333-3333-3333-3333-333333333333',
    '22222222-2222-2222-2222-222222222222',
    47.0, 6, 1, 4, 5, 4, -15.0,
    'amber', 'amber',
    'continue', 'Alice Chen', now());

INSERT INTO okr_grade_rule (okr_grade_id, rule_id, instrument, grade, category, description)
VALUES ('33333333-3333-3333-3333-333333333333', 'R-COMPOSITE-AMBER',
    'composite', 'amber', 'composite',
    'Composite RAG is amber: progress mid-band, pace slightly behind.');

INSERT INTO okr_grade_flag (okr_grade_id, flag_code, priority, description)
VALUES ('33333333-3333-3333-3333-333333333333', 'pace-collapse', 'high',
    'Pace deviation -15% — within tolerance but trending behind.');

-- Verify roundtrip
SELECT (SELECT COUNT(*) FROM okr_objective)    AS objectives,
       (SELECT COUNT(*) FROM okr_key_result)   AS key_results,
       (SELECT COUNT(*) FROM okr_check_in)     AS check_ins,
       (SELECT COUNT(*) FROM okr_grade)        AS grades,
       (SELECT COUNT(*) FROM okr_grade_rule)   AS rules,
       (SELECT COUNT(*) FROM okr_grade_flag)   AS flags;
SQL

echo "OK: roundtrip succeeded"
```

- [ ] **Step 2: Make it executable and run it**

```sh
chmod +x forms/objectives-and-key-results-tracker/sql-migrations/_roundtrip-test.sh
forms/objectives-and-key-results-tracker/sql-migrations/_roundtrip-test.sh
```

Expected last lines:

```
 objectives | key_results | check_ins | grades | rules | flags
------------+-------------+-----------+--------+-------+-------
          1 |           1 |         1 |      1 |     1 |     1
OK: roundtrip succeeded
```

- [ ] **Step 3: Commit**

```sh
git add forms/objectives-and-key-results-tracker/sql-migrations/_roundtrip-test.sh
git commit -m "OKR tracker: SQL roundtrip test script"
```

---

## Phase D — XML representations

### Task 15: Generate XML + DTD per table

**Files:**
- Will create: `forms/objectives-and-key-results-tracker/xml-representations/<table>.xml` and `<table>.dtd` for each table

- [ ] **Step 1: Run the generator script for this form only**

```sh
python3 bin/xml-representations/generate-xml-representations.py forms/objectives-and-key-results-tracker
```

- [ ] **Step 2: Verify expected files exist and are non-empty**

```sh
for t in reporter participant okr_objective okr_key_result okr_check_in okr_grade okr_grade_rule okr_grade_flag; do
    test -s "forms/objectives-and-key-results-tracker/xml-representations/$t.xml" || { echo "MISSING: $t.xml"; exit 1; }
    test -s "forms/objectives-and-key-results-tracker/xml-representations/$t.dtd" || { echo "MISSING: $t.dtd"; exit 1; }
done
echo "OK: all XML+DTD files generated"
```

- [ ] **Step 3: Commit the generated files**

```sh
git add forms/objectives-and-key-results-tracker/xml-representations/
git commit -m "OKR tracker: generate XML + DTD representations"
```

---

## Phase E — FHIR R5 representations

### Task 16: Generate FHIR R5 JSON per table

**Files:**
- Will create: `forms/objectives-and-key-results-tracker/fhir-r5/<table>.json` for each table

- [ ] **Step 1: Run the generator script**

```sh
python3 bin/fhir-r5/generate-fhir-r5-representations.py forms/objectives-and-key-results-tracker
```

- [ ] **Step 2: Verify expected files exist and are non-empty**

```sh
for t in reporter participant okr_objective okr_key_result okr_check_in okr_grade okr_grade_rule okr_grade_flag; do
    test -s "forms/objectives-and-key-results-tracker/fhir-r5/$t.json" || { echo "MISSING: $t.json"; exit 1; }
done
echo "OK: all FHIR R5 JSON files generated"
```

- [ ] **Step 3: Validate the JSON is well-formed**

```sh
for f in forms/objectives-and-key-results-tracker/fhir-r5/*.json; do
    python3 -c "import json,sys; json.load(open(sys.argv[1]))" "$f" || { echo "BAD JSON: $f"; exit 1; }
done
echo "OK: all JSON well-formed"
```

- [ ] **Step 4: Commit**

```sh
git add forms/objectives-and-key-results-tracker/fhir-r5/
git commit -m "OKR tracker: generate FHIR R5 JSON representations"
```

---

## Phase F — TypeScript scoring engine (Vitest)

### Task 17: Bootstrap the SvelteKit project skeleton (engine + vitest only)

**Files:**
- Create: `forms/objectives-and-key-results-tracker/front-end-form-with-svelte/package.json`
- Create: `forms/objectives-and-key-results-tracker/front-end-form-with-svelte/tsconfig.json`
- Create: `forms/objectives-and-key-results-tracker/front-end-form-with-svelte/vitest.config.ts`
- Create: `forms/objectives-and-key-results-tracker/front-end-form-with-svelte/.gitignore`
- Reference: `forms/issue-tracker/front-end-form-with-svelte/{package.json,vitest.config.ts,tsconfig.json}`

- [ ] **Step 1: Read the reference files and copy minimal versions**

```sh
cat forms/issue-tracker/front-end-form-with-svelte/package.json
cat forms/issue-tracker/front-end-form-with-svelte/vitest.config.ts
cat forms/issue-tracker/front-end-form-with-svelte/tsconfig.json
```

- [ ] **Step 2: Write `package.json`**

```json
{
  "name": "objectives-and-key-results-tracker-front-end-form-with-svelte",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "check": "vitest run --reporter=basic"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 3: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*.ts"]
}
```

- [ ] **Step 4: Write `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['src/**/*.test.ts'],
	},
});
```

- [ ] **Step 5: Write `.gitignore`**

```gitignore
node_modules/
.svelte-kit/
build/
dist/
*.log
```

- [ ] **Step 6: Install and verify**

```sh
cd forms/objectives-and-key-results-tracker/front-end-form-with-svelte
pnpm install
pnpm test
```

Expected: vitest exits successfully (`No test files found, exiting with code 0` is acceptable here; we add tests in the next tasks).

- [ ] **Step 7: Commit**

```sh
cd "$(git rev-parse --show-toplevel)"
git add forms/objectives-and-key-results-tracker/front-end-form-with-svelte/{package.json,tsconfig.json,vitest.config.ts,.gitignore,pnpm-lock.yaml} 2>/dev/null
git commit -m "OKR tracker: bootstrap SvelteKit project (engine + vitest only)"
```

---

### Task 18: Define `types.ts` for the scoring engine

**Files:**
- Create: `forms/objectives-and-key-results-tracker/front-end-form-with-svelte/src/lib/engine/types.ts`

- [ ] **Step 1: Write the types**

```ts
// Domain types for the OKR scoring engine.
// Mirrored in src/scoring/types.rs in the Rust port.

export type RagBand = 'green' | 'amber' | 'red';

export type StretchTier = 1 | 2 | 3; // 1=committed, 2=aspirational, 3=moonshot

export type Instrument =
	| 'progress' | 'confidence' | 'stretch' | 'alignment'
	| 'impact' | 'smart' | 'pace' | 'composite';

export type FlagCode =
	| 'mis-aligned' | 'orphaned' | 'non-smart' | 'unmeasurable' | 'no-dri'
	| 'committed-at-risk' | 'pace-collapse' | 'confidence-collapse'
	| 'stale-check-in' | 'cascading-broken' | 'over-scoped' | 'moonshot-progress';

export type FlagPriority = 'high' | 'medium' | 'low';

export interface RawScores {
	progressPercent: number | null;        // 0..100
	confidenceDecile: number | null;       // 1..10
	stretchTier: StretchTier | null;
	alignmentGrade: number | null;         // 1..5
	impactTier: number | null;             // 1..5
	smartQuality: number | null;           // 0..5
	paceDeviationPercent: number | null;   // -100..+100
}

export interface KeyResult {
	position: number;                      // 1..5
	title: string;
	krType: 'numeric' | 'milestone' | 'binary' | '';
	startValue: number | null;
	currentValue: number | null;
	targetValue: number | null;
	milestonesJson: { name: string; done: boolean }[] | null;
	binaryDone: boolean | null;
	progressFraction: number | null;       // 0..1, computed
}

export interface ObjectiveContext {
	level: 'individual' | 'team' | 'department' | 'company' | '';
	parentObjectiveId: string | null;
	parentObjectiveStatus: string | null;  // for cascading-broken flag
	driPresent: boolean;
	cycleStartDate: string | null;         // ISO yyyy-mm-dd
	cycleEndDate: string | null;
	checkedInAt: string | null;            // ISO timestamp of latest check-in
	previousConfidenceDecile: number | null;
}

export interface FiredRule {
	ruleId: string;
	instrument: Instrument;
	grade: RagBand | string;
	category: string;
	description: string;
}

export interface FiredFlag {
	flagCode: FlagCode;
	priority: FlagPriority;
	description: string;
}

export interface GradeResult {
	computedCompositeRag: RagBand;
	rulesFired: FiredRule[];
	flags: FiredFlag[];
}

export interface ObjectiveAssessment {
	scores: RawScores;
	keyResults: KeyResult[];
	context: ObjectiveContext;
	now: string;                           // ISO timestamp; injectable for tests
}
```

- [ ] **Step 2: Type-check**

```sh
cd forms/objectives-and-key-results-tracker/front-end-form-with-svelte
pnpm exec tsc --noEmit
```

Expected: no output (success).

- [ ] **Step 3: Commit**

```sh
cd "$(git rev-parse --show-toplevel)"
git add forms/objectives-and-key-results-tracker/front-end-form-with-svelte/src/lib/engine/types.ts
git commit -m "OKR tracker: TS scoring types"
```

---

### Task 19: Author shared scoring fixtures

The fixtures live at the form root (not under either language) so both the
TS and Rust ports consume the same JSON inputs.

**Files:**
- Create: `forms/objectives-and-key-results-tracker/test-fixtures/scoring/01-green-on-track.json`
- Create: `forms/objectives-and-key-results-tracker/test-fixtures/scoring/02-amber-mid-band.json`
- Create: `forms/objectives-and-key-results-tracker/test-fixtures/scoring/03-red-pace-collapse.json`
- Create: `forms/objectives-and-key-results-tracker/test-fixtures/scoring/04-red-mis-aligned.json`
- Create: `forms/objectives-and-key-results-tracker/test-fixtures/scoring/05-moonshot-progress.json`
- Create: `forms/objectives-and-key-results-tracker/test-fixtures/scoring/06-non-smart.json`
- Create: `forms/objectives-and-key-results-tracker/test-fixtures/scoring/07-orphaned.json`
- Create: `forms/objectives-and-key-results-tracker/test-fixtures/scoring/08-unmeasurable.json`
- Create: `forms/objectives-and-key-results-tracker/test-fixtures/scoring/09-stale-check-in.json`
- Create: `forms/objectives-and-key-results-tracker/test-fixtures/scoring/10-confidence-collapse.json`
- Create: `forms/objectives-and-key-results-tracker/test-fixtures/scoring/11-no-dri.json`
- Create: `forms/objectives-and-key-results-tracker/test-fixtures/scoring/12-committed-at-risk.json`
- Create: `forms/objectives-and-key-results-tracker/test-fixtures/scoring/13-cascading-broken.json`
- Create: `forms/objectives-and-key-results-tracker/test-fixtures/scoring/14-over-scoped.json`
- Create: `forms/objectives-and-key-results-tracker/test-fixtures/scoring/README.md`

- [ ] **Step 1: Write `README.md` describing the fixture shape**

```markdown
# Scoring engine fixtures

Each JSON file is one scoring scenario consumed by both the TypeScript
(`front-end-form-with-svelte`) and Rust (`full-stack-with-loco-tera-htmx-alpine`)
ports. Shape:

```json
{
  "name": "human-readable name",
  "input": { /* ObjectiveAssessment shape */ },
  "expected": {
    "computedCompositeRag": "green" | "amber" | "red",
    "expectedFlags": [{"flagCode": "...", "priority": "high|medium|low"}]
  }
}
```

Adding a fixture: drop a new `NN-name.json` here and both test suites pick
it up automatically (TS via `import.meta.glob`, Rust via `fs::read_dir`).
```

- [ ] **Step 2: Write `01-green-on-track.json`**

```json
{
  "name": "All seven axes healthy → green",
  "input": {
    "scores": {
      "progressPercent": 80, "confidenceDecile": 8, "stretchTier": 1,
      "alignmentGrade": 5, "impactTier": 4, "smartQuality": 5,
      "paceDeviationPercent": 0
    },
    "keyResults": [{
      "position": 1, "title": "Lift NPS to 50", "krType": "numeric",
      "startValue": 32, "currentValue": 46, "targetValue": 50,
      "milestonesJson": null, "binaryDone": null, "progressFraction": 0.7778
    }],
    "context": {
      "level": "team", "parentObjectiveId": "p-1",
      "parentObjectiveStatus": "active", "driPresent": true,
      "cycleStartDate": "2026-04-01", "cycleEndDate": "2026-06-30",
      "checkedInAt": "2026-05-08T12:00:00Z", "previousConfidenceDecile": 7
    },
    "now": "2026-05-08T12:00:00Z"
  },
  "expected": {
    "computedCompositeRag": "green",
    "expectedFlags": []
  }
}
```

- [ ] **Step 3: Write `02-amber-mid-band.json`**

```json
{
  "name": "Mid-band progress on a committed objective → amber",
  "input": {
    "scores": {
      "progressPercent": 55, "confidenceDecile": 5, "stretchTier": 1,
      "alignmentGrade": 3, "impactTier": 3, "smartQuality": 3,
      "paceDeviationPercent": -20
    },
    "keyResults": [{
      "position": 1, "title": "X", "krType": "numeric",
      "startValue": 0, "currentValue": 55, "targetValue": 100,
      "milestonesJson": null, "binaryDone": null, "progressFraction": 0.55
    }],
    "context": {
      "level": "team", "parentObjectiveId": "p-1",
      "parentObjectiveStatus": "active", "driPresent": true,
      "cycleStartDate": "2026-04-01", "cycleEndDate": "2026-06-30",
      "checkedInAt": "2026-05-08T12:00:00Z", "previousConfidenceDecile": 5
    },
    "now": "2026-05-08T12:00:00Z"
  },
  "expected": {
    "computedCompositeRag": "amber",
    "expectedFlags": []
  }
}
```

- [ ] **Step 4: Write `03-red-pace-collapse.json`**

```json
{
  "name": "Pace deviation -60% → red via pace-collapse",
  "input": {
    "scores": {
      "progressPercent": 30, "confidenceDecile": 5, "stretchTier": 1,
      "alignmentGrade": 4, "impactTier": 4, "smartQuality": 4,
      "paceDeviationPercent": -60
    },
    "keyResults": [{
      "position": 1, "title": "X", "krType": "numeric",
      "startValue": 0, "currentValue": 30, "targetValue": 100,
      "milestonesJson": null, "binaryDone": null, "progressFraction": 0.3
    }],
    "context": {
      "level": "team", "parentObjectiveId": "p-1",
      "parentObjectiveStatus": "active", "driPresent": true,
      "cycleStartDate": "2026-04-01", "cycleEndDate": "2026-06-30",
      "checkedInAt": "2026-05-08T12:00:00Z", "previousConfidenceDecile": 5
    },
    "now": "2026-05-08T12:00:00Z"
  },
  "expected": {
    "computedCompositeRag": "red",
    "expectedFlags": [{"flagCode": "pace-collapse", "priority": "high"}]
  }
}
```

- [ ] **Step 5: Write `04-red-mis-aligned.json`**

```json
{
  "name": "alignment_grade 1 → red and mis-aligned flag",
  "input": {
    "scores": {
      "progressPercent": 70, "confidenceDecile": 8, "stretchTier": 1,
      "alignmentGrade": 1, "impactTier": 3, "smartQuality": 4,
      "paceDeviationPercent": 0
    },
    "keyResults": [{
      "position": 1, "title": "X", "krType": "numeric",
      "startValue": 0, "currentValue": 70, "targetValue": 100,
      "milestonesJson": null, "binaryDone": null, "progressFraction": 0.7
    }],
    "context": {
      "level": "team", "parentObjectiveId": "p-1",
      "parentObjectiveStatus": "active", "driPresent": true,
      "cycleStartDate": "2026-04-01", "cycleEndDate": "2026-06-30",
      "checkedInAt": "2026-05-08T12:00:00Z", "previousConfidenceDecile": 8
    },
    "now": "2026-05-08T12:00:00Z"
  },
  "expected": {
    "computedCompositeRag": "red",
    "expectedFlags": [{"flagCode": "mis-aligned", "priority": "high"}]
  }
}
```

- [ ] **Step 6: Write `05-moonshot-progress.json`**

```json
{
  "name": "Moonshot at 75% → green and moonshot-progress flag",
  "input": {
    "scores": {
      "progressPercent": 75, "confidenceDecile": 7, "stretchTier": 3,
      "alignmentGrade": 5, "impactTier": 5, "smartQuality": 5,
      "paceDeviationPercent": -5
    },
    "keyResults": [{
      "position": 1, "title": "10x ARR", "krType": "numeric",
      "startValue": 0, "currentValue": 75, "targetValue": 100,
      "milestonesJson": null, "binaryDone": null, "progressFraction": 0.75
    }],
    "context": {
      "level": "company", "parentObjectiveId": null,
      "parentObjectiveStatus": null, "driPresent": true,
      "cycleStartDate": "2026-01-01", "cycleEndDate": "2026-12-31",
      "checkedInAt": "2026-05-08T12:00:00Z", "previousConfidenceDecile": 6
    },
    "now": "2026-05-08T12:00:00Z"
  },
  "expected": {
    "computedCompositeRag": "green",
    "expectedFlags": [{"flagCode": "moonshot-progress", "priority": "low"}]
  }
}
```

- [ ] **Step 7: Write `06-non-smart.json`**

```json
{
  "name": "smart_quality 1 → red and non-smart flag",
  "input": {
    "scores": {
      "progressPercent": 70, "confidenceDecile": 7, "stretchTier": 1,
      "alignmentGrade": 4, "impactTier": 4, "smartQuality": 1,
      "paceDeviationPercent": 0
    },
    "keyResults": [{
      "position": 1, "title": "Make things better", "krType": "numeric",
      "startValue": 0, "currentValue": 70, "targetValue": 100,
      "milestonesJson": null, "binaryDone": null, "progressFraction": 0.7
    }],
    "context": {
      "level": "team", "parentObjectiveId": "p-1",
      "parentObjectiveStatus": "active", "driPresent": true,
      "cycleStartDate": "2026-04-01", "cycleEndDate": "2026-06-30",
      "checkedInAt": "2026-05-08T12:00:00Z", "previousConfidenceDecile": 7
    },
    "now": "2026-05-08T12:00:00Z"
  },
  "expected": {
    "computedCompositeRag": "red",
    "expectedFlags": [{"flagCode": "non-smart", "priority": "high"}]
  }
}
```

- [ ] **Step 8: Write `07-orphaned.json`**

```json
{
  "name": "team-level objective with no parent → orphaned flag",
  "input": {
    "scores": {
      "progressPercent": 70, "confidenceDecile": 8, "stretchTier": 1,
      "alignmentGrade": 4, "impactTier": 4, "smartQuality": 4,
      "paceDeviationPercent": 0
    },
    "keyResults": [{
      "position": 1, "title": "X", "krType": "numeric",
      "startValue": 0, "currentValue": 70, "targetValue": 100,
      "milestonesJson": null, "binaryDone": null, "progressFraction": 0.7
    }],
    "context": {
      "level": "team", "parentObjectiveId": null,
      "parentObjectiveStatus": null, "driPresent": true,
      "cycleStartDate": "2026-04-01", "cycleEndDate": "2026-06-30",
      "checkedInAt": "2026-05-08T12:00:00Z", "previousConfidenceDecile": 8
    },
    "now": "2026-05-08T12:00:00Z"
  },
  "expected": {
    "computedCompositeRag": "green",
    "expectedFlags": [{"flagCode": "orphaned", "priority": "high"}]
  }
}
```

- [ ] **Step 9: Write `08-unmeasurable.json`**

```json
{
  "name": "Only binary KRs → unmeasurable flag",
  "input": {
    "scores": {
      "progressPercent": 50, "confidenceDecile": 7, "stretchTier": 1,
      "alignmentGrade": 4, "impactTier": 4, "smartQuality": 4,
      "paceDeviationPercent": 0
    },
    "keyResults": [{
      "position": 1, "title": "Done?", "krType": "binary",
      "startValue": null, "currentValue": null, "targetValue": null,
      "milestonesJson": null, "binaryDone": false, "progressFraction": 0.0
    }],
    "context": {
      "level": "team", "parentObjectiveId": "p-1",
      "parentObjectiveStatus": "active", "driPresent": true,
      "cycleStartDate": "2026-04-01", "cycleEndDate": "2026-06-30",
      "checkedInAt": "2026-05-08T12:00:00Z", "previousConfidenceDecile": 7
    },
    "now": "2026-05-08T12:00:00Z"
  },
  "expected": {
    "computedCompositeRag": "amber",
    "expectedFlags": [{"flagCode": "unmeasurable", "priority": "high"}]
  }
}
```

- [ ] **Step 10: Write `09-stale-check-in.json`**

```json
{
  "name": "No check-in for 30 days in a 90-day cycle → stale-check-in",
  "input": {
    "scores": {
      "progressPercent": 70, "confidenceDecile": 7, "stretchTier": 1,
      "alignmentGrade": 4, "impactTier": 4, "smartQuality": 4,
      "paceDeviationPercent": 0
    },
    "keyResults": [{
      "position": 1, "title": "X", "krType": "numeric",
      "startValue": 0, "currentValue": 70, "targetValue": 100,
      "milestonesJson": null, "binaryDone": null, "progressFraction": 0.7
    }],
    "context": {
      "level": "team", "parentObjectiveId": "p-1",
      "parentObjectiveStatus": "active", "driPresent": true,
      "cycleStartDate": "2026-04-01", "cycleEndDate": "2026-06-30",
      "checkedInAt": "2026-04-08T12:00:00Z", "previousConfidenceDecile": 7
    },
    "now": "2026-05-08T12:00:00Z"
  },
  "expected": {
    "computedCompositeRag": "green",
    "expectedFlags": [{"flagCode": "stale-check-in", "priority": "medium"}]
  }
}
```

(Threshold: `max(14, 25% × 90) = max(14, 22.5) ≈ 23` days. 30 days > 23.)

- [ ] **Step 11: Write `10-confidence-collapse.json`**

```json
{
  "name": "Confidence dropped 4 deciles since last check-in → flag",
  "input": {
    "scores": {
      "progressPercent": 60, "confidenceDecile": 4, "stretchTier": 1,
      "alignmentGrade": 4, "impactTier": 4, "smartQuality": 4,
      "paceDeviationPercent": -10
    },
    "keyResults": [{
      "position": 1, "title": "X", "krType": "numeric",
      "startValue": 0, "currentValue": 60, "targetValue": 100,
      "milestonesJson": null, "binaryDone": null, "progressFraction": 0.6
    }],
    "context": {
      "level": "team", "parentObjectiveId": "p-1",
      "parentObjectiveStatus": "active", "driPresent": true,
      "cycleStartDate": "2026-04-01", "cycleEndDate": "2026-06-30",
      "checkedInAt": "2026-05-05T12:00:00Z", "previousConfidenceDecile": 8
    },
    "now": "2026-05-08T12:00:00Z"
  },
  "expected": {
    "computedCompositeRag": "amber",
    "expectedFlags": [{"flagCode": "confidence-collapse", "priority": "medium"}]
  }
}
```

- [ ] **Step 12: Write `11-no-dri.json`**

```json
{
  "name": "DRI missing → no-dri flag",
  "input": {
    "scores": {
      "progressPercent": 70, "confidenceDecile": 7, "stretchTier": 1,
      "alignmentGrade": 4, "impactTier": 4, "smartQuality": 4,
      "paceDeviationPercent": 0
    },
    "keyResults": [{
      "position": 1, "title": "X", "krType": "numeric",
      "startValue": 0, "currentValue": 70, "targetValue": 100,
      "milestonesJson": null, "binaryDone": null, "progressFraction": 0.7
    }],
    "context": {
      "level": "team", "parentObjectiveId": "p-1",
      "parentObjectiveStatus": "active", "driPresent": false,
      "cycleStartDate": "2026-04-01", "cycleEndDate": "2026-06-30",
      "checkedInAt": "2026-05-08T12:00:00Z", "previousConfidenceDecile": 7
    },
    "now": "2026-05-08T12:00:00Z"
  },
  "expected": {
    "computedCompositeRag": "green",
    "expectedFlags": [{"flagCode": "no-dri", "priority": "high"}]
  }
}
```

- [ ] **Step 13: Write `12-committed-at-risk.json`**

```json
{
  "name": "Committed objective at 30% progress, 80% of cycle elapsed → committed-at-risk + red",
  "input": {
    "scores": {
      "progressPercent": 30, "confidenceDecile": 5, "stretchTier": 1,
      "alignmentGrade": 4, "impactTier": 4, "smartQuality": 4,
      "paceDeviationPercent": -30
    },
    "keyResults": [{
      "position": 1, "title": "X", "krType": "numeric",
      "startValue": 0, "currentValue": 30, "targetValue": 100,
      "milestonesJson": null, "binaryDone": null, "progressFraction": 0.3
    }],
    "context": {
      "level": "team", "parentObjectiveId": "p-1",
      "parentObjectiveStatus": "active", "driPresent": true,
      "cycleStartDate": "2026-04-01", "cycleEndDate": "2026-06-30",
      "checkedInAt": "2026-06-15T12:00:00Z", "previousConfidenceDecile": 5
    },
    "now": "2026-06-15T12:00:00Z"
  },
  "expected": {
    "computedCompositeRag": "red",
    "expectedFlags": [{"flagCode": "committed-at-risk", "priority": "high"}]
  }
}
```

(Cycle: 04-01 → 06-30 = 90 days; `now` 06-15 = 75 days elapsed = 83% — passes ≥50% gate. Progress 30% < 50%. Pace at -30% is amber, not pace-collapse.)

- [ ] **Step 14: Write `13-cascading-broken.json`**

```json
{
  "name": "Parent objective is retired → cascading-broken flag",
  "input": {
    "scores": {
      "progressPercent": 70, "confidenceDecile": 7, "stretchTier": 1,
      "alignmentGrade": 4, "impactTier": 4, "smartQuality": 4,
      "paceDeviationPercent": 0
    },
    "keyResults": [{
      "position": 1, "title": "X", "krType": "numeric",
      "startValue": 0, "currentValue": 70, "targetValue": 100,
      "milestonesJson": null, "binaryDone": null, "progressFraction": 0.7
    }],
    "context": {
      "level": "team", "parentObjectiveId": "p-1",
      "parentObjectiveStatus": "retired", "driPresent": true,
      "cycleStartDate": "2026-04-01", "cycleEndDate": "2026-06-30",
      "checkedInAt": "2026-05-08T12:00:00Z", "previousConfidenceDecile": 7
    },
    "now": "2026-05-08T12:00:00Z"
  },
  "expected": {
    "computedCompositeRag": "green",
    "expectedFlags": [{"flagCode": "cascading-broken", "priority": "medium"}]
  }
}
```

- [ ] **Step 15: Write `14-over-scoped.json`** (six KRs — only reachable via imported data, but the flag exists for that case)

```json
{
  "name": "Six KRs (above the UI cap of 5) → over-scoped flag",
  "input": {
    "scores": {
      "progressPercent": 70, "confidenceDecile": 7, "stretchTier": 1,
      "alignmentGrade": 4, "impactTier": 4, "smartQuality": 4,
      "paceDeviationPercent": 0
    },
    "keyResults": [
      {"position": 1, "title": "K1", "krType": "numeric", "startValue": 0, "currentValue": 7, "targetValue": 10, "milestonesJson": null, "binaryDone": null, "progressFraction": 0.7},
      {"position": 2, "title": "K2", "krType": "numeric", "startValue": 0, "currentValue": 7, "targetValue": 10, "milestonesJson": null, "binaryDone": null, "progressFraction": 0.7},
      {"position": 3, "title": "K3", "krType": "numeric", "startValue": 0, "currentValue": 7, "targetValue": 10, "milestonesJson": null, "binaryDone": null, "progressFraction": 0.7},
      {"position": 4, "title": "K4", "krType": "numeric", "startValue": 0, "currentValue": 7, "targetValue": 10, "milestonesJson": null, "binaryDone": null, "progressFraction": 0.7},
      {"position": 5, "title": "K5", "krType": "numeric", "startValue": 0, "currentValue": 7, "targetValue": 10, "milestonesJson": null, "binaryDone": null, "progressFraction": 0.7},
      {"position": 6, "title": "K6", "krType": "numeric", "startValue": 0, "currentValue": 7, "targetValue": 10, "milestonesJson": null, "binaryDone": null, "progressFraction": 0.7}
    ],
    "context": {
      "level": "team", "parentObjectiveId": "p-1",
      "parentObjectiveStatus": "active", "driPresent": true,
      "cycleStartDate": "2026-04-01", "cycleEndDate": "2026-06-30",
      "checkedInAt": "2026-05-08T12:00:00Z", "previousConfidenceDecile": 7
    },
    "now": "2026-05-08T12:00:00Z"
  },
  "expected": {
    "computedCompositeRag": "green",
    "expectedFlags": [{"flagCode": "over-scoped", "priority": "low"}]
  }
}
```

- [ ] **Step 16: Commit fixtures**

```sh
git add forms/objectives-and-key-results-tracker/test-fixtures/
git commit -m "OKR tracker: shared scoring fixtures (14 scenarios, all 12 flags covered)"
```

---

### Task 20: TDD `progress-rules.ts`

**Files:**
- Create: `forms/objectives-and-key-results-tracker/front-end-form-with-svelte/src/lib/engine/progress-rules.ts`
- Create: `forms/objectives-and-key-results-tracker/front-end-form-with-svelte/src/lib/engine/progress-rules.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { gradeProgress } from './progress-rules';
import type { RawScores, StretchTier } from './types';

const base = (over: Partial<RawScores>): RawScores => ({
	progressPercent: 70, confidenceDecile: 7, stretchTier: 1,
	alignmentGrade: 4, impactTier: 4, smartQuality: 4,
	paceDeviationPercent: 0,
	...over,
});

describe('gradeProgress', () => {
	it('committed at 80% → green', () => {
		const [band, _rules] = gradeProgress(base({ progressPercent: 80, stretchTier: 1 }));
		expect(band).toBe('green');
	});
	it('committed at 50% → amber', () => {
		const [band] = gradeProgress(base({ progressPercent: 50, stretchTier: 1 }));
		expect(band).toBe('amber');
	});
	it('committed at 20% → red', () => {
		const [band] = gradeProgress(base({ progressPercent: 20, stretchTier: 1 }));
		expect(band).toBe('red');
	});
	it('aspirational at 35% → green (lower threshold)', () => {
		const [band] = gradeProgress(base({ progressPercent: 35, stretchTier: 2 }));
		expect(band).toBe('green');
	});
	it('moonshot at 15% → amber (very lenient)', () => {
		const [band] = gradeProgress(base({ progressPercent: 15, stretchTier: 3 as StretchTier }));
		expect(band).toBe('amber');
	});
	it('null progress → amber', () => {
		const [band] = gradeProgress(base({ progressPercent: null }));
		expect(band).toBe('amber');
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

```sh
cd forms/objectives-and-key-results-tracker/front-end-form-with-svelte
pnpm test
```

Expected: `Cannot find module './progress-rules'`.

- [ ] **Step 3: Write minimal implementation**

```ts
import type { FiredRule, RagBand, RawScores } from './types';

/**
 * Progress band, modulated by stretch tier.
 *  committed (1):    green ≥ 70, red < 30
 *  aspirational (2): green ≥ 30, red < 10
 *  moonshot (3):     green ≥ 25, red never (always amber if low)
 */
export function gradeProgress(s: RawScores): [RagBand, FiredRule[]] {
	const p = s.progressPercent;
	const tier = s.stretchTier ?? 1;
	if (p === null) {
		return [
			'amber',
			[{
				ruleId: 'R-PROGRESS-MISSING',
				instrument: 'progress',
				grade: 'amber',
				category: 'progress',
				description: 'Progress percent missing — defaulted to amber.',
			}],
		];
	}
	const thresholds = { 1: { green: 70, red: 30 }, 2: { green: 30, red: 10 }, 3: { green: 25, red: -1 } } as const;
	const t = thresholds[tier];
	const band: RagBand = p >= t.green ? 'green' : p < t.red ? 'red' : 'amber';
	return [
		band,
		[{
			ruleId: `R-PROGRESS-${band.toUpperCase()}-T${tier}`,
			instrument: 'progress',
			grade: band,
			category: 'progress',
			description: `Progress ${p}% on stretch tier ${tier} → ${band}.`,
		}],
	];
}
```

- [ ] **Step 4: Run test to verify it passes**

```sh
pnpm test
```

Expected: all 6 progress-rules tests pass.

- [ ] **Step 5: Commit**

```sh
cd "$(git rev-parse --show-toplevel)"
git add forms/objectives-and-key-results-tracker/front-end-form-with-svelte/src/lib/engine/progress-rules.ts \
        forms/objectives-and-key-results-tracker/front-end-form-with-svelte/src/lib/engine/progress-rules.test.ts
git commit -m "OKR tracker: TS progress-rules"
```

---

### Task 21: TDD `confidence-rules.ts`

**Files:**
- Create: `.../engine/confidence-rules.ts` and `confidence-rules.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { gradeConfidence } from './confidence-rules';

describe('gradeConfidence', () => {
	it('decile 9 → green', () => {
		const [band] = gradeConfidence(9);
		expect(band).toBe('green');
	});
	it('decile 5 → amber', () => {
		const [band] = gradeConfidence(5);
		expect(band).toBe('amber');
	});
	it('decile 2 → red', () => {
		const [band] = gradeConfidence(2);
		expect(band).toBe('red');
	});
	it('null → amber', () => {
		const [band] = gradeConfidence(null);
		expect(band).toBe('amber');
	});
});
```

- [ ] **Step 2: Run to fail**

```sh
cd forms/objectives-and-key-results-tracker/front-end-form-with-svelte && pnpm test
```

Expected: import error.

- [ ] **Step 3: Implement**

```ts
import type { FiredRule, RagBand } from './types';

export function gradeConfidence(decile: number | null): [RagBand, FiredRule[]] {
	if (decile === null) {
		return ['amber', [{ ruleId: 'R-CONFIDENCE-MISSING', instrument: 'confidence', grade: 'amber', category: 'confidence', description: 'Confidence missing — amber.' }]];
	}
	const band: RagBand = decile >= 7 ? 'green' : decile <= 3 ? 'red' : 'amber';
	return [band, [{ ruleId: `R-CONFIDENCE-${band.toUpperCase()}`, instrument: 'confidence', grade: band, category: 'confidence', description: `Confidence ${decile}/10 → ${band}.` }]];
}
```

- [ ] **Step 4: Run to pass**

```sh
pnpm test
```

- [ ] **Step 5: Commit**

```sh
cd "$(git rev-parse --show-toplevel)"
git add forms/objectives-and-key-results-tracker/front-end-form-with-svelte/src/lib/engine/confidence-rules.{ts,test.ts}
git commit -m "OKR tracker: TS confidence-rules"
```

---

### Task 22: TDD `alignment-rules.ts`

**Files:**
- Create: `.../engine/alignment-rules.ts` and `alignment-rules.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { gradeAlignment } from './alignment-rules';

describe('gradeAlignment', () => {
	it('grade 5 → green', () => {
		expect(gradeAlignment(5)[0]).toBe('green');
	});
	it('grade 3 → amber', () => {
		expect(gradeAlignment(3)[0]).toBe('amber');
	});
	it('grade 1 → red', () => {
		expect(gradeAlignment(1)[0]).toBe('red');
	});
	it('null → amber', () => {
		expect(gradeAlignment(null)[0]).toBe('amber');
	});
});
```

- [ ] **Step 2: Run to fail**

- [ ] **Step 3: Implement**

```ts
import type { FiredRule, RagBand } from './types';

export function gradeAlignment(grade: number | null): [RagBand, FiredRule[]] {
	if (grade === null) {
		return ['amber', [{ ruleId: 'R-ALIGNMENT-MISSING', instrument: 'alignment', grade: 'amber', category: 'alignment', description: 'Alignment missing — amber.' }]];
	}
	const band: RagBand = grade >= 4 ? 'green' : grade <= 2 ? 'red' : 'amber';
	return [band, [{ ruleId: `R-ALIGNMENT-${band.toUpperCase()}`, instrument: 'alignment', grade: band, category: 'alignment', description: `Alignment ${grade}/5 → ${band}.` }]];
}
```

- [ ] **Step 4: Run to pass**

- [ ] **Step 5: Commit**

```sh
cd "$(git rev-parse --show-toplevel)"
git add forms/objectives-and-key-results-tracker/front-end-form-with-svelte/src/lib/engine/alignment-rules.{ts,test.ts}
git commit -m "OKR tracker: TS alignment-rules"
```

---

### Task 23: TDD `smart-rules.ts`

**Files:**
- Create: `.../engine/smart-rules.ts` and `smart-rules.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { gradeSmart } from './smart-rules';

describe('gradeSmart', () => {
	it('5/5 SMART → green', () => {
		expect(gradeSmart(5)[0]).toBe('green');
	});
	it('3/5 → amber', () => {
		expect(gradeSmart(3)[0]).toBe('amber');
	});
	it('1/5 → red', () => {
		expect(gradeSmart(1)[0]).toBe('red');
	});
	it('null → amber', () => {
		expect(gradeSmart(null)[0]).toBe('amber');
	});
});
```

- [ ] **Step 2: Run to fail**

- [ ] **Step 3: Implement**

```ts
import type { FiredRule, RagBand } from './types';

export function gradeSmart(quality: number | null): [RagBand, FiredRule[]] {
	if (quality === null) {
		return ['amber', [{ ruleId: 'R-SMART-MISSING', instrument: 'smart', grade: 'amber', category: 'smart', description: 'SMART quality missing — amber.' }]];
	}
	const band: RagBand = quality >= 4 ? 'green' : quality <= 1 ? 'red' : 'amber';
	return [band, [{ ruleId: `R-SMART-${band.toUpperCase()}`, instrument: 'smart', grade: band, category: 'smart', description: `SMART ${quality}/5 → ${band}.` }]];
}
```

- [ ] **Step 4: Run to pass**

- [ ] **Step 5: Commit**

```sh
cd "$(git rev-parse --show-toplevel)"
git add forms/objectives-and-key-results-tracker/front-end-form-with-svelte/src/lib/engine/smart-rules.{ts,test.ts}
git commit -m "OKR tracker: TS smart-rules"
```

---

### Task 24: TDD `pace-rules.ts`

**Files:**
- Create: `.../engine/pace-rules.ts` and `pace-rules.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { gradePace } from './pace-rules';

describe('gradePace', () => {
	it('on track (0%) → green', () => {
		expect(gradePace(0)[0]).toBe('green');
	});
	it('-9% → green (within tolerance)', () => {
		expect(gradePace(-9)[0]).toBe('green');
	});
	it('-25% → amber', () => {
		expect(gradePace(-25)[0]).toBe('amber');
	});
	it('-60% → red', () => {
		expect(gradePace(-60)[0]).toBe('red');
	});
	it('+30% (ahead) → green', () => {
		expect(gradePace(30)[0]).toBe('green');
	});
	it('null → amber', () => {
		expect(gradePace(null)[0]).toBe('amber');
	});
});
```

- [ ] **Step 2: Run to fail**

- [ ] **Step 3: Implement**

```ts
import type { FiredRule, RagBand } from './types';

export function gradePace(deviation: number | null): [RagBand, FiredRule[]] {
	if (deviation === null) {
		return ['amber', [{ ruleId: 'R-PACE-MISSING', instrument: 'pace', grade: 'amber', category: 'pace', description: 'Pace deviation missing — amber.' }]];
	}
	const band: RagBand = deviation >= -10 ? 'green' : deviation <= -50 ? 'red' : 'amber';
	return [band, [{ ruleId: `R-PACE-${band.toUpperCase()}`, instrument: 'pace', grade: band, category: 'pace', description: `Pace deviation ${deviation}% → ${band}.` }]];
}
```

- [ ] **Step 4: Run to pass**

- [ ] **Step 5: Commit**

```sh
cd "$(git rev-parse --show-toplevel)"
git add forms/objectives-and-key-results-tracker/front-end-form-with-svelte/src/lib/engine/pace-rules.{ts,test.ts}
git commit -m "OKR tracker: TS pace-rules"
```

---

### Task 25: Stub `stretch-rules.ts` and `impact-rules.ts` (informational only)

`stretch_tier` and `impact_tier` do not produce their own RAG band per the
spec (stretch modulates progress; impact is informational on the dashboard).
We provide pass-through grade functions that always return 'green' and a
single rule documenting the value, so the composite-grader can include them
uniformly.

**Files:**
- Create: `.../engine/stretch-rules.ts` and `stretch-rules.test.ts`
- Create: `.../engine/impact-rules.ts` and `impact-rules.test.ts`

- [ ] **Step 1: Write `stretch-rules.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { gradeStretch } from './stretch-rules';

describe('gradeStretch', () => {
	it('committed (1) → green with documented rule', () => {
		const [band, rules] = gradeStretch(1);
		expect(band).toBe('green');
		expect(rules[0].ruleId).toBe('R-STRETCH-COMMITTED');
	});
	it('moonshot (3) → green with documented rule', () => {
		const [band, rules] = gradeStretch(3);
		expect(band).toBe('green');
		expect(rules[0].ruleId).toBe('R-STRETCH-MOONSHOT');
	});
});
```

- [ ] **Step 2: Implement `stretch-rules.ts`**

```ts
import type { FiredRule, RagBand, StretchTier } from './types';

const NAMES: Record<StretchTier, string> = { 1: 'COMMITTED', 2: 'ASPIRATIONAL', 3: 'MOONSHOT' };

export function gradeStretch(tier: StretchTier | null): [RagBand, FiredRule[]] {
	const t = tier ?? 1;
	return [
		'green',
		[{ ruleId: `R-STRETCH-${NAMES[t]}`, instrument: 'stretch', grade: 'green', category: 'stretch', description: `Stretch tier: ${NAMES[t].toLowerCase()} (informational, modulates progress).` }],
	];
}
```

- [ ] **Step 3: Write `impact-rules.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { gradeImpact } from './impact-rules';

describe('gradeImpact', () => {
	it('tier 5 → green', () => { expect(gradeImpact(5)[0]).toBe('green'); });
	it('tier 1 → green (informational only)', () => { expect(gradeImpact(1)[0]).toBe('green'); });
	it('null → green', () => { expect(gradeImpact(null)[0]).toBe('green'); });
});
```

- [ ] **Step 4: Implement `impact-rules.ts`**

```ts
import type { FiredRule, RagBand } from './types';

export function gradeImpact(tier: number | null): [RagBand, FiredRule[]] {
	const value = tier ?? 0;
	return [
		'green',
		[{ ruleId: `R-IMPACT-T${value}`, instrument: 'impact', grade: 'green', category: 'impact', description: `Impact tier ${value}/5 (informational).` }],
	];
}
```

- [ ] **Step 5: Run all tests to pass**

```sh
cd forms/objectives-and-key-results-tracker/front-end-form-with-svelte
pnpm test
```

- [ ] **Step 6: Commit**

```sh
cd "$(git rev-parse --show-toplevel)"
git add forms/objectives-and-key-results-tracker/front-end-form-with-svelte/src/lib/engine/stretch-rules.{ts,test.ts} \
        forms/objectives-and-key-results-tracker/front-end-form-with-svelte/src/lib/engine/impact-rules.{ts,test.ts}
git commit -m "OKR tracker: TS stretch-rules and impact-rules"
```

---

### Task 26: TDD `composite-grader.ts`

**Files:**
- Create: `.../engine/utils.ts`
- Create: `.../engine/composite-grader.ts` and `composite-grader.test.ts`

- [ ] **Step 1: Write `utils.ts`** (worst-band-finding helper)

```ts
import type { RagBand } from './types';

const ORDER: Record<RagBand, number> = { green: 0, amber: 1, red: 2 };

export function worstBand(bands: RagBand[]): RagBand {
	return bands.reduce<RagBand>((acc, b) => (ORDER[b] > ORDER[acc] ? b : acc), 'green');
}
```

- [ ] **Step 2: Write the failing test for the composite grader**

```ts
import { describe, expect, it } from 'vitest';
import { gradeObjective } from './composite-grader';
import fixtures from '../../../../test-fixtures/scoring/01-green-on-track.json' with { type: 'json' };

describe('gradeObjective — fixture 01-green-on-track', () => {
	it('produces green', () => {
		const result = gradeObjective(fixtures.input as any);
		expect(result.computedCompositeRag).toBe(fixtures.expected.computedCompositeRag);
	});
});
```

- [ ] **Step 3: Run to fail**

```sh
cd forms/objectives-and-key-results-tracker/front-end-form-with-svelte && pnpm test
```

Expected: import error for `./composite-grader`.

- [ ] **Step 4: Implement `composite-grader.ts`**

```ts
import { gradeAlignment } from './alignment-rules';
import { gradeConfidence } from './confidence-rules';
import { gradeImpact } from './impact-rules';
import { gradePace } from './pace-rules';
import { gradeProgress } from './progress-rules';
import { gradeSmart } from './smart-rules';
import { gradeStretch } from './stretch-rules';
import { computeFlags } from './flagged-issues';
import type { GradeResult, ObjectiveAssessment, RagBand } from './types';
import { worstBand } from './utils';

export function gradeObjective(a: ObjectiveAssessment): GradeResult {
	const [pBand, pRules] = gradeProgress(a.scores);
	const [cBand, cRules] = gradeConfidence(a.scores.confidenceDecile);
	const [stBand, stRules] = gradeStretch(a.scores.stretchTier);
	const [aBand, aRules] = gradeAlignment(a.scores.alignmentGrade);
	const [iBand, iRules] = gradeImpact(a.scores.impactTier);
	const [smBand, smRules] = gradeSmart(a.scores.smartQuality);
	const [paBand, paRules] = gradePace(a.scores.paceDeviationPercent);

	const composite: RagBand = worstBand([pBand, cBand, stBand, aBand, iBand, smBand, paBand]);

	const rulesFired = [
		...pRules, ...cRules, ...stRules, ...aRules, ...iRules, ...smRules, ...paRules,
		{ ruleId: `R-COMPOSITE-${composite.toUpperCase()}`, instrument: 'composite' as const, grade: composite, category: 'composite', description: `Composite RAG ${composite} via worst-band.` },
	];

	const flags = computeFlags(a);

	return { computedCompositeRag: composite, rulesFired, flags };
}
```

- [ ] **Step 5: Stub `flagged-issues.ts` so the import resolves** (minimal — Task 27 fills it in)

```ts
import type { FiredFlag, ObjectiveAssessment } from './types';

export function computeFlags(_a: ObjectiveAssessment): FiredFlag[] {
	return [];
}
```

- [ ] **Step 6: Run to pass**

```sh
pnpm test
```

Expected: all tests including the fixture-based composite test pass.

- [ ] **Step 7: Commit**

```sh
cd "$(git rev-parse --show-toplevel)"
git add forms/objectives-and-key-results-tracker/front-end-form-with-svelte/src/lib/engine/{utils.ts,composite-grader.ts,composite-grader.test.ts,flagged-issues.ts}
git commit -m "OKR tracker: TS composite-grader and flag stub"
```

---

### Task 27: TDD `flagged-issues.ts` (12 flags)

**Files:**
- Modify: `.../engine/flagged-issues.ts`
- Create: `.../engine/flagged-issues.test.ts`

- [ ] **Step 1: Write the failing test driven by all ten fixtures**

```ts
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { gradeObjective } from './composite-grader';

const FIXTURES_DIR = path.resolve(__dirname, '../../../../test-fixtures/scoring');

interface Fixture {
	name: string;
	input: any;
	expected: { computedCompositeRag: 'green' | 'amber' | 'red'; expectedFlags: { flagCode: string; priority: string }[] };
}

describe('gradeObjective — every fixture', () => {
	const files = fs.readdirSync(FIXTURES_DIR).filter((f) => f.endsWith('.json'));
	for (const file of files) {
		const fx: Fixture = JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, file), 'utf8'));
		it(`${file}: ${fx.name}`, () => {
			const r = gradeObjective(fx.input);
			expect(r.computedCompositeRag).toBe(fx.expected.computedCompositeRag);
			const got = r.flags.map((f) => f.flagCode).sort();
			const want = fx.expected.expectedFlags.map((f) => f.flagCode).sort();
			expect(got).toEqual(want);
		});
	}
});
```

- [ ] **Step 2: Run to fail**

Expected: fixtures expecting flags fail because the stub returns `[]`.

- [ ] **Step 3: Implement `flagged-issues.ts`**

```ts
import type { FiredFlag, FlagCode, FlagPriority, ObjectiveAssessment } from './types';

function add(flags: FiredFlag[], code: FlagCode, priority: FlagPriority, description: string) {
	flags.push({ flagCode: code, priority, description });
}

function daysBetween(a: string, b: string): number {
	return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);
}

export function computeFlags(a: ObjectiveAssessment): FiredFlag[] {
	const flags: FiredFlag[] = [];
	const s = a.scores;
	const c = a.context;

	if (s.alignmentGrade !== null && s.alignmentGrade <= 2) {
		add(flags, 'mis-aligned', 'high', `Alignment grade ${s.alignmentGrade}/5 — mis-aligned with parent / theme.`);
	}
	if (['individual', 'team', 'department'].includes(c.level) && c.parentObjectiveId === null) {
		add(flags, 'orphaned', 'high', `Level ${c.level} but no parent_objective_id set.`);
	}
	if (s.smartQuality !== null && s.smartQuality <= 1) {
		add(flags, 'non-smart', 'high', `SMART quality ${s.smartQuality}/5 — objective is poorly formed.`);
	}
	const krTypes = a.keyResults.map((k) => k.krType);
	if (krTypes.length > 0 && !krTypes.some((t) => t === 'numeric' || t === 'milestone')) {
		add(flags, 'unmeasurable', 'high', 'No KR is numeric or milestone — objective is unmeasurable.');
	}
	if (!c.driPresent) {
		add(flags, 'no-dri', 'high', 'No DRI assigned.');
	}
	if (s.stretchTier === 1 && s.progressPercent !== null && s.progressPercent < 50 && c.cycleStartDate && c.cycleEndDate) {
		const total = daysBetween(c.cycleStartDate, c.cycleEndDate);
		const elapsed = daysBetween(c.cycleStartDate, a.now);
		if (total > 0 && elapsed / total >= 0.5) {
			add(flags, 'committed-at-risk', 'high', 'Committed objective behind ≥50% of cycle elapsed and progress <50%.');
		}
	}
	if (s.paceDeviationPercent !== null && s.paceDeviationPercent <= -50) {
		add(flags, 'pace-collapse', 'high', `Pace deviation ${s.paceDeviationPercent}% — collapsing.`);
	}
	if (c.previousConfidenceDecile !== null && s.confidenceDecile !== null && c.previousConfidenceDecile - s.confidenceDecile >= 3) {
		add(flags, 'confidence-collapse', 'medium', `Confidence dropped ${c.previousConfidenceDecile - s.confidenceDecile} deciles since last check-in.`);
	}
	if (c.checkedInAt && c.cycleStartDate && c.cycleEndDate) {
		const totalDays = daysBetween(c.cycleStartDate, c.cycleEndDate);
		const since = daysBetween(c.checkedInAt, a.now);
		const threshold = Math.max(14, Math.round(totalDays * 0.25));
		if (since > threshold) {
			add(flags, 'stale-check-in', 'medium', `${since} days since last check-in (threshold ${threshold}).`);
		}
	}
	const closed = ['retired', 'cancelled', 'missed'];
	if (c.parentObjectiveStatus !== null && closed.includes(c.parentObjectiveStatus)) {
		add(flags, 'cascading-broken', 'medium', `Parent objective is ${c.parentObjectiveStatus} — cascade is broken.`);
	}
	if (a.keyResults.length > 5) {
		add(flags, 'over-scoped', 'low', `${a.keyResults.length} KRs — exceeds the 5-KR cap.`);
	}
	if (s.stretchTier === 3 && s.progressPercent !== null && s.progressPercent >= 70) {
		add(flags, 'moonshot-progress', 'low', `Moonshot at ${s.progressPercent}% — worth recognising.`);
	}
	return flags;
}
```

- [ ] **Step 4: Run to pass — every fixture**

```sh
cd forms/objectives-and-key-results-tracker/front-end-form-with-svelte && pnpm test
```

Expected: all 14 fixture tests + per-axis tests pass.

- [ ] **Step 5: Commit**

```sh
cd "$(git rev-parse --show-toplevel)"
git add forms/objectives-and-key-results-tracker/front-end-form-with-svelte/src/lib/engine/flagged-issues.{ts,test.ts}
git commit -m "OKR tracker: TS flag computation (12 flags)"
```

---

## Phase G — Rust scoring engine

### Task 28: Bootstrap the Rust crate (engine only)

**Files:**
- Create: `forms/objectives-and-key-results-tracker/full-stack-with-loco-tera-htmx-alpine/Cargo.toml`
- Create: `forms/objectives-and-key-results-tracker/full-stack-with-loco-tera-htmx-alpine/.gitignore`
- Create: `forms/objectives-and-key-results-tracker/full-stack-with-loco-tera-htmx-alpine/src/lib.rs`
- Create: `forms/objectives-and-key-results-tracker/full-stack-with-loco-tera-htmx-alpine/src/scoring/mod.rs`

- [ ] **Step 1: Write `Cargo.toml`**

```toml
[package]
name = "objectives-and-key-results-tracker"
version = "0.1.0"
edition = "2024"
publish = false

[dependencies]
serde = { version = "1", features = ["derive"] }
serde_json = "1"

[dev-dependencies]
# Plan 6 will add tera/loco/sea-orm; engine-only crate stays lean.

[lib]
name = "objectives_and_key_results_tracker"
path = "src/lib.rs"
```

- [ ] **Step 2: Write `.gitignore`**

```gitignore
target/
Cargo.lock
```

- [ ] **Step 3: Write `src/lib.rs`**

```rust
pub mod scoring;
```

- [ ] **Step 4: Write `src/scoring/mod.rs`**

```rust
pub mod alignment;
pub mod composite;
pub mod confidence;
pub mod flags;
pub mod impact;
pub mod pace;
pub mod progress;
pub mod smart;
pub mod stretch;
pub mod types;
pub mod utils;
```

- [ ] **Step 5: Verify `cargo check` runs (will fail because module files don't exist yet — that is expected; we will add them in next tasks)**

For now write a stub for each module file so `cargo check` succeeds:

```sh
cd forms/objectives-and-key-results-tracker/full-stack-with-loco-tera-htmx-alpine
mkdir -p src/scoring
for m in alignment composite confidence flags impact pace progress smart stretch types utils; do
    echo "// stub" > "src/scoring/$m.rs"
done
cargo check
```

Expected: success.

- [ ] **Step 6: Commit**

```sh
cd "$(git rev-parse --show-toplevel)"
git add forms/objectives-and-key-results-tracker/full-stack-with-loco-tera-htmx-alpine/{Cargo.toml,.gitignore,Cargo.lock,src/lib.rs,src/scoring/}
git commit -m "OKR tracker: bootstrap Rust crate (engine-only)"
```

---

### Task 29: Write `types.rs`

**Files:**
- Replace: `.../src/scoring/types.rs`

- [ ] **Step 1: Replace the stub with the full types**

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum RagBand { Green, Amber, Red }

impl RagBand {
    pub fn as_str(&self) -> &'static str {
        match self { RagBand::Green => "green", RagBand::Amber => "amber", RagBand::Red => "red" }
    }
    pub fn rank(&self) -> u8 {
        match self { RagBand::Green => 0, RagBand::Amber => 1, RagBand::Red => 2 }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Instrument { Progress, Confidence, Stretch, Alignment, Impact, Smart, Pace, Composite }

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FiredRule {
    #[serde(rename = "ruleId")]
    pub rule_id: String,
    pub instrument: Instrument,
    pub grade: String,
    pub category: String,
    pub description: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum FlagCode {
    MisAligned, Orphaned, NonSmart, Unmeasurable, NoDri,
    CommittedAtRisk, PaceCollapse, ConfidenceCollapse,
    StaleCheckIn, CascadingBroken, OverScoped, MoonshotProgress,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum FlagPriority { High, Medium, Low }

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FiredFlag {
    #[serde(rename = "flagCode")]
    pub flag_code: FlagCode,
    pub priority: FlagPriority,
    pub description: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RawScores {
    pub progress_percent: Option<f64>,
    pub confidence_decile: Option<i32>,
    pub stretch_tier: Option<i32>,
    pub alignment_grade: Option<i32>,
    pub impact_tier: Option<i32>,
    pub smart_quality: Option<i32>,
    pub pace_deviation_percent: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Milestone { pub name: String, pub done: bool }

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct KeyResult {
    pub position: i32,
    pub title: String,
    pub kr_type: String,
    pub start_value: Option<f64>,
    pub current_value: Option<f64>,
    pub target_value: Option<f64>,
    pub milestones_json: Option<Vec<Milestone>>,
    pub binary_done: Option<bool>,
    pub progress_fraction: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ObjectiveContext {
    pub level: String,
    pub parent_objective_id: Option<String>,
    pub parent_objective_status: Option<String>,
    pub dri_present: bool,
    pub cycle_start_date: Option<String>,
    pub cycle_end_date: Option<String>,
    pub checked_in_at: Option<String>,
    pub previous_confidence_decile: Option<i32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ObjectiveAssessment {
    pub scores: RawScores,
    pub key_results: Vec<KeyResult>,
    pub context: ObjectiveContext,
    pub now: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradeResult {
    pub computed_composite_rag: RagBand,
    pub rules_fired: Vec<FiredRule>,
    pub flags: Vec<FiredFlag>,
}
```

- [ ] **Step 2: Verify**

```sh
cd forms/objectives-and-key-results-tracker/full-stack-with-loco-tera-htmx-alpine && cargo check
```

- [ ] **Step 3: Commit**

```sh
cd "$(git rev-parse --show-toplevel)"
git add forms/objectives-and-key-results-tracker/full-stack-with-loco-tera-htmx-alpine/src/scoring/types.rs
git commit -m "OKR tracker: Rust scoring types"
```

---

### Task 30: Write `utils.rs` with TDD

**Files:**
- Replace: `.../src/scoring/utils.rs`

- [ ] **Step 1: Write the test (in-file `#[cfg(test)]`)**

```rust
use crate::scoring::types::RagBand;

pub fn worst_band(bands: &[RagBand]) -> RagBand {
    bands.iter().copied().max_by_key(|b| b.rank()).unwrap_or(RagBand::Green)
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn worst_of_green_amber_is_amber() {
        assert_eq!(worst_band(&[RagBand::Green, RagBand::Amber]), RagBand::Amber);
    }
    #[test]
    fn worst_of_amber_red_is_red() {
        assert_eq!(worst_band(&[RagBand::Amber, RagBand::Red]), RagBand::Red);
    }
    #[test]
    fn worst_of_empty_is_green() {
        assert_eq!(worst_band(&[]), RagBand::Green);
    }
}
```

- [ ] **Step 2: Run cargo test**

```sh
cd forms/objectives-and-key-results-tracker/full-stack-with-loco-tera-htmx-alpine && cargo test scoring::utils
```

Expected: 3 tests pass.

- [ ] **Step 3: Commit**

```sh
cd "$(git rev-parse --show-toplevel)"
git add forms/objectives-and-key-results-tracker/full-stack-with-loco-tera-htmx-alpine/src/scoring/utils.rs
git commit -m "OKR tracker: Rust utils (worst_band)"
```

---

### Task 31: TDD `progress.rs` (mirrors TS Task 20)

**Files:**
- Replace: `.../src/scoring/progress.rs`

- [ ] **Step 1: Write tests inline**

```rust
use crate::scoring::types::{FiredRule, Instrument, RagBand, RawScores};

pub fn grade(s: &RawScores) -> (RagBand, Vec<FiredRule>) {
    let tier = s.stretch_tier.unwrap_or(1);
    let p = match s.progress_percent {
        None => return (RagBand::Amber, vec![rule("R-PROGRESS-MISSING", RagBand::Amber, "Progress percent missing — defaulted to amber.")]),
        Some(v) => v,
    };
    let (green, red) = match tier {
        1 => (70.0, 30.0),
        2 => (30.0, 10.0),
        3 => (25.0, -1.0),
        _ => (70.0, 30.0),
    };
    let band = if p >= green { RagBand::Green } else if p < red { RagBand::Red } else { RagBand::Amber };
    let rid = format!("R-PROGRESS-{}-T{}", band.as_str().to_uppercase(), tier);
    let desc = format!("Progress {p}% on stretch tier {tier} → {}.", band.as_str());
    (band, vec![rule(&rid, band, &desc)])
}

fn rule(id: &str, band: RagBand, desc: &str) -> FiredRule {
    FiredRule {
        rule_id: id.into(), instrument: Instrument::Progress, grade: band.as_str().into(),
        category: "progress".into(), description: desc.into(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    fn base(p: Option<f64>, t: Option<i32>) -> RawScores {
        RawScores { progress_percent: p, confidence_decile: Some(7), stretch_tier: t,
            alignment_grade: Some(4), impact_tier: Some(4), smart_quality: Some(4),
            pace_deviation_percent: Some(0.0) }
    }
    #[test] fn committed_80_green() { assert_eq!(grade(&base(Some(80.0), Some(1))).0, RagBand::Green); }
    #[test] fn committed_50_amber() { assert_eq!(grade(&base(Some(50.0), Some(1))).0, RagBand::Amber); }
    #[test] fn committed_20_red() { assert_eq!(grade(&base(Some(20.0), Some(1))).0, RagBand::Red); }
    #[test] fn aspirational_35_green() { assert_eq!(grade(&base(Some(35.0), Some(2))).0, RagBand::Green); }
    #[test] fn moonshot_15_amber() { assert_eq!(grade(&base(Some(15.0), Some(3))).0, RagBand::Amber); }
    #[test] fn null_amber() { assert_eq!(grade(&base(None, Some(1))).0, RagBand::Amber); }
}
```

- [ ] **Step 2: Run cargo test**

```sh
cd forms/objectives-and-key-results-tracker/full-stack-with-loco-tera-htmx-alpine && cargo test scoring::progress
```

- [ ] **Step 3: Commit**

```sh
cd "$(git rev-parse --show-toplevel)"
git add forms/objectives-and-key-results-tracker/full-stack-with-loco-tera-htmx-alpine/src/scoring/progress.rs
git commit -m "OKR tracker: Rust progress rules"
```

---

### Task 32: TDD `confidence.rs`, `alignment.rs`, `smart.rs`, `pace.rs`, `stretch.rs`, `impact.rs`

These mirror their TS counterparts (Tasks 21–25). To keep this plan manageable, treat each file as one sub-step rather than one task.

**Files:**
- Replace: `.../src/scoring/{confidence,alignment,smart,pace,stretch,impact}.rs`

- [ ] **Step 1: Write `confidence.rs`**

```rust
use crate::scoring::types::{FiredRule, Instrument, RagBand};

pub fn grade(decile: Option<i32>) -> (RagBand, Vec<FiredRule>) {
    let band = match decile {
        None => RagBand::Amber,
        Some(d) if d >= 7 => RagBand::Green,
        Some(d) if d <= 3 => RagBand::Red,
        Some(_) => RagBand::Amber,
    };
    let rid = format!("R-CONFIDENCE-{}", band.as_str().to_uppercase());
    let desc = match decile { None => "Confidence missing — amber.".to_string(), Some(d) => format!("Confidence {d}/10 → {}.", band.as_str()) };
    (band, vec![FiredRule { rule_id: rid, instrument: Instrument::Confidence, grade: band.as_str().into(), category: "confidence".into(), description: desc }])
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test] fn d9_green() { assert_eq!(grade(Some(9)).0, RagBand::Green); }
    #[test] fn d5_amber() { assert_eq!(grade(Some(5)).0, RagBand::Amber); }
    #[test] fn d2_red() { assert_eq!(grade(Some(2)).0, RagBand::Red); }
    #[test] fn none_amber() { assert_eq!(grade(None).0, RagBand::Amber); }
}
```

- [ ] **Step 2: Write `alignment.rs`**

```rust
use crate::scoring::types::{FiredRule, Instrument, RagBand};

pub fn grade(g: Option<i32>) -> (RagBand, Vec<FiredRule>) {
    let band = match g {
        None => RagBand::Amber,
        Some(v) if v >= 4 => RagBand::Green,
        Some(v) if v <= 2 => RagBand::Red,
        Some(_) => RagBand::Amber,
    };
    let rid = format!("R-ALIGNMENT-{}", band.as_str().to_uppercase());
    let desc = match g { None => "Alignment missing — amber.".to_string(), Some(v) => format!("Alignment {v}/5 → {}.", band.as_str()) };
    (band, vec![FiredRule { rule_id: rid, instrument: Instrument::Alignment, grade: band.as_str().into(), category: "alignment".into(), description: desc }])
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test] fn g5_green() { assert_eq!(grade(Some(5)).0, RagBand::Green); }
    #[test] fn g3_amber() { assert_eq!(grade(Some(3)).0, RagBand::Amber); }
    #[test] fn g1_red() { assert_eq!(grade(Some(1)).0, RagBand::Red); }
    #[test] fn none_amber() { assert_eq!(grade(None).0, RagBand::Amber); }
}
```

- [ ] **Step 3: Write `smart.rs`**

```rust
use crate::scoring::types::{FiredRule, Instrument, RagBand};

pub fn grade(q: Option<i32>) -> (RagBand, Vec<FiredRule>) {
    let band = match q {
        None => RagBand::Amber,
        Some(v) if v >= 4 => RagBand::Green,
        Some(v) if v <= 1 => RagBand::Red,
        Some(_) => RagBand::Amber,
    };
    let rid = format!("R-SMART-{}", band.as_str().to_uppercase());
    let desc = match q { None => "SMART missing — amber.".to_string(), Some(v) => format!("SMART {v}/5 → {}.", band.as_str()) };
    (band, vec![FiredRule { rule_id: rid, instrument: Instrument::Smart, grade: band.as_str().into(), category: "smart".into(), description: desc }])
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test] fn s5_green() { assert_eq!(grade(Some(5)).0, RagBand::Green); }
    #[test] fn s3_amber() { assert_eq!(grade(Some(3)).0, RagBand::Amber); }
    #[test] fn s1_red() { assert_eq!(grade(Some(1)).0, RagBand::Red); }
    #[test] fn none_amber() { assert_eq!(grade(None).0, RagBand::Amber); }
}
```

- [ ] **Step 4: Write `pace.rs`**

```rust
use crate::scoring::types::{FiredRule, Instrument, RagBand};

pub fn grade(d: Option<f64>) -> (RagBand, Vec<FiredRule>) {
    let band = match d {
        None => RagBand::Amber,
        Some(v) if v >= -10.0 => RagBand::Green,
        Some(v) if v <= -50.0 => RagBand::Red,
        Some(_) => RagBand::Amber,
    };
    let rid = format!("R-PACE-{}", band.as_str().to_uppercase());
    let desc = match d { None => "Pace missing — amber.".to_string(), Some(v) => format!("Pace deviation {v}% → {}.", band.as_str()) };
    (band, vec![FiredRule { rule_id: rid, instrument: Instrument::Pace, grade: band.as_str().into(), category: "pace".into(), description: desc }])
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test] fn zero_green() { assert_eq!(grade(Some(0.0)).0, RagBand::Green); }
    #[test] fn neg9_green() { assert_eq!(grade(Some(-9.0)).0, RagBand::Green); }
    #[test] fn neg25_amber() { assert_eq!(grade(Some(-25.0)).0, RagBand::Amber); }
    #[test] fn neg60_red() { assert_eq!(grade(Some(-60.0)).0, RagBand::Red); }
    #[test] fn none_amber() { assert_eq!(grade(None).0, RagBand::Amber); }
}
```

- [ ] **Step 5: Write `stretch.rs` and `impact.rs`** (informational — always green)

```rust
// stretch.rs
use crate::scoring::types::{FiredRule, Instrument, RagBand};

pub fn grade(t: Option<i32>) -> (RagBand, Vec<FiredRule>) {
    let name = match t.unwrap_or(1) { 1 => "COMMITTED", 2 => "ASPIRATIONAL", 3 => "MOONSHOT", _ => "COMMITTED" };
    (RagBand::Green, vec![FiredRule {
        rule_id: format!("R-STRETCH-{name}"),
        instrument: Instrument::Stretch,
        grade: "green".into(),
        category: "stretch".into(),
        description: format!("Stretch tier: {} (informational, modulates progress).", name.to_lowercase()),
    }])
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test] fn committed() { assert!(grade(Some(1)).1[0].rule_id.contains("COMMITTED")); }
    #[test] fn moonshot() { assert!(grade(Some(3)).1[0].rule_id.contains("MOONSHOT")); }
}
```

```rust
// impact.rs
use crate::scoring::types::{FiredRule, Instrument, RagBand};

pub fn grade(t: Option<i32>) -> (RagBand, Vec<FiredRule>) {
    let v = t.unwrap_or(0);
    (RagBand::Green, vec![FiredRule {
        rule_id: format!("R-IMPACT-T{v}"),
        instrument: Instrument::Impact,
        grade: "green".into(),
        category: "impact".into(),
        description: format!("Impact tier {v}/5 (informational)."),
    }])
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test] fn t5_green() { assert_eq!(grade(Some(5)).0, RagBand::Green); }
    #[test] fn t1_green() { assert_eq!(grade(Some(1)).0, RagBand::Green); }
}
```

- [ ] **Step 6: Run all tests**

```sh
cd forms/objectives-and-key-results-tracker/full-stack-with-loco-tera-htmx-alpine && cargo test
```

- [ ] **Step 7: Commit**

```sh
cd "$(git rev-parse --show-toplevel)"
git add forms/objectives-and-key-results-tracker/full-stack-with-loco-tera-htmx-alpine/src/scoring/{confidence,alignment,smart,pace,stretch,impact}.rs
git commit -m "OKR tracker: Rust per-axis rules"
```

---

### Task 33: TDD `flags.rs` and `composite.rs`

**Files:**
- Replace: `.../src/scoring/flags.rs`
- Replace: `.../src/scoring/composite.rs`

- [ ] **Step 1: Write `flags.rs`**

```rust
use crate::scoring::types::{
    FiredFlag, FlagCode, FlagPriority, ObjectiveAssessment,
};

pub fn compute(a: &ObjectiveAssessment) -> Vec<FiredFlag> {
    let mut flags: Vec<FiredFlag> = Vec::new();
    let s = &a.scores;
    let c = &a.context;

    if let Some(g) = s.alignment_grade { if g <= 2 {
        flags.push(FiredFlag { flag_code: FlagCode::MisAligned, priority: FlagPriority::High, description: format!("Alignment grade {g}/5 — mis-aligned.") });
    }}
    if matches!(c.level.as_str(), "individual" | "team" | "department") && c.parent_objective_id.is_none() {
        flags.push(FiredFlag { flag_code: FlagCode::Orphaned, priority: FlagPriority::High, description: format!("Level {} but no parent.", c.level) });
    }
    if let Some(q) = s.smart_quality { if q <= 1 {
        flags.push(FiredFlag { flag_code: FlagCode::NonSmart, priority: FlagPriority::High, description: format!("SMART quality {q}/5.") });
    }}
    if !a.key_results.is_empty() && !a.key_results.iter().any(|k| k.kr_type == "numeric" || k.kr_type == "milestone") {
        flags.push(FiredFlag { flag_code: FlagCode::Unmeasurable, priority: FlagPriority::High, description: "No KR is numeric or milestone.".into() });
    }
    if !c.dri_present {
        flags.push(FiredFlag { flag_code: FlagCode::NoDri, priority: FlagPriority::High, description: "No DRI assigned.".into() });
    }
    if let (Some(1), Some(p), Some(start), Some(end)) = (s.stretch_tier, s.progress_percent, c.cycle_start_date.as_ref(), c.cycle_end_date.as_ref()) {
        if p < 50.0 {
            if let (Ok(elapsed), Ok(total)) = (days_between(start, &a.now), days_between(start, end)) {
                if total > 0 && elapsed as f64 / total as f64 >= 0.5 {
                    flags.push(FiredFlag { flag_code: FlagCode::CommittedAtRisk, priority: FlagPriority::High, description: "Committed objective behind ≥50% of cycle.".into() });
                }
            }
        }
    }
    if let Some(d) = s.pace_deviation_percent { if d <= -50.0 {
        flags.push(FiredFlag { flag_code: FlagCode::PaceCollapse, priority: FlagPriority::High, description: format!("Pace deviation {d}%.") });
    }}
    if let (Some(prev), Some(cur)) = (c.previous_confidence_decile, s.confidence_decile) { if prev - cur >= 3 {
        flags.push(FiredFlag { flag_code: FlagCode::ConfidenceCollapse, priority: FlagPriority::Medium, description: format!("Confidence dropped {} deciles.", prev - cur) });
    }}
    if let (Some(checked), Some(start), Some(end)) = (c.checked_in_at.as_ref(), c.cycle_start_date.as_ref(), c.cycle_end_date.as_ref()) {
        if let (Ok(since), Ok(total)) = (days_between(checked, &a.now), days_between(start, end)) {
            let threshold = std::cmp::max(14, (total as f64 * 0.25).round() as i64);
            if since > threshold {
                flags.push(FiredFlag { flag_code: FlagCode::StaleCheckIn, priority: FlagPriority::Medium, description: format!("{since} days since last check-in (threshold {threshold}).") });
            }
        }
    }
    if let Some(status) = c.parent_objective_status.as_deref() {
        if matches!(status, "retired" | "cancelled" | "missed") {
            flags.push(FiredFlag { flag_code: FlagCode::CascadingBroken, priority: FlagPriority::Medium, description: format!("Parent is {status}.") });
        }
    }
    if a.key_results.len() > 5 {
        flags.push(FiredFlag { flag_code: FlagCode::OverScoped, priority: FlagPriority::Low, description: format!("{} KRs — exceeds cap.", a.key_results.len()) });
    }
    if let (Some(3), Some(p)) = (s.stretch_tier, s.progress_percent) { if p >= 70.0 {
        flags.push(FiredFlag { flag_code: FlagCode::MoonshotProgress, priority: FlagPriority::Low, description: format!("Moonshot at {p}% — recognise.") });
    }}
    flags
}

fn days_between(a: &str, b: &str) -> Result<i64, ()> {
    fn parse(s: &str) -> Result<i64, ()> {
        // Accept ISO date 'YYYY-MM-DD' or full 'YYYY-MM-DDThh:mm:ssZ'.
        let date_part = &s[..10];
        let mut it = date_part.split('-');
        let y: i64 = it.next().ok_or(())?.parse().map_err(|_| ())?;
        let m: i64 = it.next().ok_or(())?.parse().map_err(|_| ())?;
        let d: i64 = it.next().ok_or(())?.parse().map_err(|_| ())?;
        Ok(julian_day(y, m, d))
    }
    Ok(parse(b)? - parse(a)?)
}

// Fliegel-Van Flandern Julian Day Number (no chrono dep needed).
fn julian_day(y: i64, m: i64, d: i64) -> i64 {
    let a = (14 - m) / 12;
    let yy = y + 4800 - a;
    let mm = m + 12 * a - 3;
    d + (153 * mm + 2) / 5 + 365 * yy + yy / 4 - yy / 100 + yy / 400 - 32045
}
```

- [ ] **Step 2: Write `composite.rs`**

```rust
use crate::scoring::types::{FiredRule, GradeResult, Instrument, ObjectiveAssessment, RagBand};
use crate::scoring::utils::worst_band;
use crate::scoring::{alignment, confidence, flags, impact, pace, progress, smart, stretch};

pub fn grade_objective(a: &ObjectiveAssessment) -> GradeResult {
    let (p, p_rules) = progress::grade(&a.scores);
    let (c, c_rules) = confidence::grade(a.scores.confidence_decile);
    let (st, st_rules) = stretch::grade(a.scores.stretch_tier);
    let (al, al_rules) = alignment::grade(a.scores.alignment_grade);
    let (im, im_rules) = impact::grade(a.scores.impact_tier);
    let (sm, sm_rules) = smart::grade(a.scores.smart_quality);
    let (pa, pa_rules) = pace::grade(a.scores.pace_deviation_percent);

    let composite = worst_band(&[p, c, st, al, im, sm, pa]);

    let mut rules_fired: Vec<FiredRule> = Vec::new();
    for r in [p_rules, c_rules, st_rules, al_rules, im_rules, sm_rules, pa_rules] {
        rules_fired.extend(r);
    }
    rules_fired.push(FiredRule {
        rule_id: format!("R-COMPOSITE-{}", composite.as_str().to_uppercase()),
        instrument: Instrument::Composite,
        grade: composite.as_str().into(),
        category: "composite".into(),
        description: format!("Composite RAG {} via worst-band.", composite.as_str()),
    });

    GradeResult {
        computed_composite_rag: composite,
        rules_fired,
        flags: flags::compute(a),
    }
}
```

- [ ] **Step 3: Run cargo test**

```sh
cd forms/objectives-and-key-results-tracker/full-stack-with-loco-tera-htmx-alpine && cargo test
```

Expected: all per-axis tests pass; nothing broken.

- [ ] **Step 4: Commit**

```sh
cd "$(git rev-parse --show-toplevel)"
git add forms/objectives-and-key-results-tracker/full-stack-with-loco-tera-htmx-alpine/src/scoring/{flags.rs,composite.rs}
git commit -m "OKR tracker: Rust composite-grader and flags"
```

---

### Task 34: Fixture-driven integration test in Rust

**Files:**
- Create: `forms/objectives-and-key-results-tracker/full-stack-with-loco-tera-htmx-alpine/tests/scoring_fixtures.rs`

- [ ] **Step 1: Write the integration test**

```rust
use objectives_and_key_results_tracker::scoring::{composite::grade_objective, types::ObjectiveAssessment};
use serde::Deserialize;
use std::fs;
use std::path::Path;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct Expected {
    computed_composite_rag: String,
    expected_flags: Vec<ExpectedFlag>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct ExpectedFlag { flag_code: String }

#[derive(Deserialize)]
struct Fixture {
    name: String,
    input: ObjectiveAssessment,
    expected: Expected,
}

#[test]
fn every_fixture_grades_as_expected() {
    let dir = Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("../test-fixtures/scoring");
    let mut entries: Vec<_> = fs::read_dir(&dir).unwrap()
        .filter_map(|e| e.ok())
        .filter(|e| e.path().extension().map(|x| x == "json").unwrap_or(false))
        .collect();
    entries.sort_by_key(|e| e.file_name());

    for entry in entries {
        let raw = fs::read_to_string(entry.path()).unwrap();
        let fx: Fixture = serde_json::from_str(&raw).expect(&format!("parse {:?}", entry.file_name()));
        let result = grade_objective(&fx.input);

        assert_eq!(
            result.computed_composite_rag.as_str(),
            fx.expected.computed_composite_rag,
            "{}: rag mismatch", fx.name
        );

        let mut got: Vec<String> = result.flags.iter()
            .map(|f| serde_json::to_value(&f.flag_code).unwrap().as_str().unwrap().to_string())
            .collect();
        got.sort();
        let mut want: Vec<String> = fx.expected.expected_flags.iter().map(|f| f.flag_code.clone()).collect();
        want.sort();
        assert_eq!(got, want, "{}: flag mismatch", fx.name);
    }
}
```

- [ ] **Step 2: Run**

```sh
cd forms/objectives-and-key-results-tracker/full-stack-with-loco-tera-htmx-alpine && cargo test --test scoring_fixtures
```

Expected: all 14 fixtures pass.

- [ ] **Step 3: Commit**

```sh
cd "$(git rev-parse --show-toplevel)"
git add forms/objectives-and-key-results-tracker/full-stack-with-loco-tera-htmx-alpine/tests/scoring_fixtures.rs
git commit -m "OKR tracker: Rust fixture-driven integration test"
```

---

## Phase H — Acceptance gate

### Task 35: Verify all five Plan-1 acceptance gates

- [ ] **Step 1: SQL roundtrip**

```sh
forms/objectives-and-key-results-tracker/sql-migrations/_roundtrip-test.sh
```

Expected: ends with `OK: roundtrip succeeded` and the `1|1|1|1|1|1` row.

- [ ] **Step 2: XML representations**

```sh
ls forms/objectives-and-key-results-tracker/xml-representations/*.xml \
   forms/objectives-and-key-results-tracker/xml-representations/*.dtd
```

Expected: 8 XML + 8 DTD files (one per table).

- [ ] **Step 3: FHIR R5 representations**

```sh
ls forms/objectives-and-key-results-tracker/fhir-r5/*.json
```

Expected: 8 JSON files.

- [ ] **Step 4: TypeScript scoring engine**

```sh
cd forms/objectives-and-key-results-tracker/front-end-form-with-svelte && pnpm test
```

Expected: all per-axis + 14 fixture tests pass.

- [ ] **Step 5: Rust scoring engine**

```sh
cd forms/objectives-and-key-results-tracker/full-stack-with-loco-tera-htmx-alpine && cargo test
```

Expected: all per-axis unit tests + 14-fixture integration test pass.

- [ ] **Step 6: Tag the commit so Plan 2 can branch from it cleanly**

```sh
cd "$(git rev-parse --show-toplevel)"
git tag okr-tracker-plan-1-foundation
```

---

## Self-review checklist (run after the engineer completes the plan, by you)

- [ ] All ten SQL migrations created and `_roundtrip-test.sh` passes.
- [ ] XML, DTD, and FHIR R5 files exist for every table.
- [ ] `pnpm test` and `cargo test` both pass with the same 14 fixture scenarios.
- [ ] No file under `forms/objectives-and-key-results-tracker/` contains `Not yet implemented.` (otherwise `bin/test-form` will fail later plans).
- [ ] All commits follow the message format `OKR tracker: <terse subject>` for traceability.
