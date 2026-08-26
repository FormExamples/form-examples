# arc42 Documentation Form — Design

**Date:** 2026-05-08
**Subproject:** `forms/arc42/`
**Status:** Approved design — ready for implementation plan
**Build scope this session:** foundation + Svelte form (option B)

## Purpose

A structured documentation wizard for [arc42](https://arc42.org/overview), the
pragmatic template for software architecture communication. One form instance
captures one architecture's documentation across arc42's twelve canonical
sections; the form computes a per-section completeness grade, a composite
**maturity band** (Draft / Reviewable / Ready / Mature), and a set of
fired flags for architecturally critical omissions. Output is a signed
arc42 document in HTML, PDF, AsciiDoc, FHIR R5 Bundle, and XML.

The form is non-clinical. It demonstrates that the `forms/` monorepo
pattern — single-page wizard + structured schema + scoring engine + multi-
format report — generalizes beyond medical assessments.

## Scope

- **In scope (this session):** scaffold; top-level docs (`index.md`,
  `AGENTS.md`, `plan.md`, `tasks.md`, `doc/*.md`); SQL Liquibase migrations;
  generated XML + DTD; generated FHIR R5 JSON; SvelteKit 12-step wizard with
  pure scoring engine, Vitest tests, `pdfmake` PDF, AsciiDoc export.
- **Scaffolded but not built (follow-up sessions):**
  `front-end-form-with-html/`, `front-end-dashboard-with-html/`,
  `front-end-dashboard-with-svelte/`,
  `full-stack-with-loco-tera-htmx-alpine/`. Tracked in `plan.md`.
- **Out of scope:** backend persistence, authentication, multi-architecture
  collaboration, real-time co-authoring, ADR diffing/rollups across
  architectures, importing existing arc42 AsciiDoc.

## Conceptual model

One **architecture** is documented by one **arc42_documentation** instance
(versioned). The documentation collects free-text prose for the prose-heavy
sections and bounded-cardinality lists for the enumerable elements
(stakeholders, ADRs, risks, etc.).

### Twelve-step wizard

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Introduction & Goals | `introduction` (text), `business_goals` (≤5), `quality_goals` (≤5; name + priority H/M/L + scenario), `stakeholders` (≤8; name + role + concerns) |
| 2 | Constraints | three kinds in one table: technical (≤8), organizational (≤5), conventions (≤8) |
| 3 | Context & Scope | `business_context_description` (text) + `business_partners` (≤8; name + interface), `technical_context_description` (text) + `technical_interfaces` (≤8; name + protocol + direction) |
| 4 | Solution Strategy | `solution_strategy_summary` (text), `technology_decisions` (≤6), `top_level_decomposition_summary` (text), `quality_strategies` (≤5) |
| 5 | Building Block View | `top_level_overview` (text), `building_blocks` (≤12; name + responsibility + interfaces; one nesting level via `parent_id`) |
| 6 | Runtime View | `runtime_overview` (text), `runtime_scenarios` (≤8; name + trigger + steps_summary) |
| 7 | Deployment View | `deployment_overview` (text), `deployment_nodes` (≤10; environment + node + responsibility) |
| 8 | Crosscutting Concepts | `crosscutting_overview` (text), `crosscutting_concepts` (≤10; name + description) |
| 9 | Architectural Decisions | `architectural_decisions` (≤15; ADR-style: title + status + context + decision + consequences) |
| 10 | Quality Requirements | `quality_tree_summary` (text), `quality_scenarios` (≤10; source + stimulus + artifact + response + measure) |
| 11 | Risks & Technical Debt | `risk_items` (≤10; kind risk/debt + name + probability L/M/H + impact L/M/H + mitigation) |
| 12 | Summary, Maturity & Sign-off | `glossary_terms` (≤25), computed maturity, fired rules, flags, override + reason, recommendation, signature |

## Data model

UUIDv4 PKs throughout. `created_at` + `updated_at` on every table with the
shared `set_updated_at()` trigger. snake_case in SQL/Rust; camelCase in
TypeScript via `serde(rename_all = "camelCase")`.

### Liquibase migrations

```
00_create_extensions.sql
01_create_function_set_updated_at.sql
02_create_table_architecture.sql
03_create_table_arc42_documentation.sql
04_create_table_business_goal.sql
05_create_table_quality_goal.sql
06_create_table_stakeholder.sql
07_create_table_constraint_item.sql
08_create_table_context_partner.sql
09_create_table_technology_decision.sql
10_create_table_building_block.sql
11_create_table_runtime_scenario.sql
12_create_table_deployment_node.sql
13_create_table_crosscutting_concept.sql
14_create_table_architectural_decision.sql
15_create_table_quality_scenario.sql
16_create_table_risk_item.sql
17_create_table_glossary_term.sql
18_create_table_arc42_documentation_grade.sql
19_create_table_arc42_documentation_grade_rule.sql
20_create_table_arc42_documentation_grade_flag.sql
```

### Conventions

- Empty string `''` for unanswered text/enum fields; `null` for unanswered
  numerics.
- `architecture` carries `name`, `version`, `owner`, `status`,
  `description`.
- `arc42_documentation` carries the prose fields directly (one row per
  documentation snapshot) and FKs to the child list tables.
- Enumerated kinds (`constraint_item.kind`, `context_partner.kind`,
  `risk_item.kind`) are CHECK-constrained `text`.

## Scoring engine

Pure functions in `src/lib/grading/`. No side-effects. Fully Vitest-tested.

### Per-section completeness

`empty` / `partial` / `complete` per section. Minimum thresholds for
`complete`:

| § | Minimums |
| --- | --- |
| 1 | introduction present, ≥1 business goal, ≥3 quality goals (priority + scenario), ≥2 stakeholders |
| 2 | ≥1 item across the three kinds |
| 3 | business description + ≥1 partner; technical description + ≥1 interface |
| 4 | strategy summary + ≥1 technology decision |
| 5 | overview + ≥3 building blocks |
| 6 | ≥1 runtime scenario with steps |
| 7 | ≥1 deployment node |
| 8 | ≥1 crosscutting concept |
| 9 | ≥3 ADRs with status ≠ `draft` |
| 10 | ≥3 quality scenarios fully populated |
| 11 | ≥1 risk item with mitigation |
| 12 | ≥5 glossary terms |

### Composite maturity (max-grade)

| Band | Driver |
| --- | --- |
| Draft | any section `empty` |
| Reviewable | all sections ≥ `partial`, but ≥1 still `partial` |
| Ready | all sections `complete`, no high-priority flags |
| Mature | Ready + zero medium-priority flags + ≥5 ADRs with status ≠ `draft` + ≥3 quality scenarios fully populated + ≥3 risk items with mitigation |

### Fired flags (independent of maturity)

- **High:** no stakeholders, no quality goals, no ADRs, no risks, no business
  context, no deployment view.
- **Medium:** <3 quality goals, <3 ADRs, no glossary terms, no runtime
  scenarios, no quality scenarios, no crosscutting concepts.
- **Low:** introduction missing, conventions missing, technical-debt absent,
  ≥6 building blocks but none nested (i.e. flat decomposition where nesting
  is plausible).

### Override

The author may override the computed maturity at step 12 with a documented
reason. Both `computed_maturity` and `final_maturity` are stored and
rendered in the report.

### Engine files

```
src/lib/grading/
  types.ts               # Arc42Documentation + sub-types
  utils.ts               # cardinality + completeness helpers
  completeness-rules.ts  # per-section completeness rules
  maturity-grader.ts     # calculateMaturity() — pure function
  flagged-issues.ts      # detectFlags()
  completeness-rules.test.ts
  maturity-grader.test.ts
```

## Front-end (SvelteKit)

Mirrors `pre-operative-assessment-by-clinician/front-end-form-with-svelte/`
file layout:

```
src/
├── app.css                                # Tailwind 4 entry
├── app.html                               # HTML shell
├── params/
│   └── step.ts                            # Route param matcher (1–12)
├── lib/
│   ├── grading/                           # (see above)
│   ├── config/
│   │   └── steps.ts                       # 12-step wizard definitions
│   ├── stores/
│   │   └── documentation.svelte.ts        # $state reactive store
│   ├── components/
│   │   ├── ui/                            # reusable form components
│   │   └── steps/                         # Step1Introduction.svelte …
│   │                                      # Step12Summary.svelte
│   └── report/
│       ├── pdf-builder.ts                 # pdfmake document builder
│       └── asciidoc-builder.ts            # arc42-native AsciiDoc bundle
└── routes/
    ├── +layout.svelte
    ├── +page.svelte                       # landing
    ├── documentation/
    │   ├── +layout.svelte                 # progress bar + maturity preview
    │   └── [step=step]/+page.svelte       # dynamic step renderer
    └── report/
        ├── +page.svelte                   # HTML preview
        ├── pdf/+server.ts                 # PDF endpoint
        └── asciidoc/+server.ts            # AsciiDoc endpoint
```

### Stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`)
- Tailwind CSS 4 (`@import 'tailwindcss'` + `@theme`)
- `pdfmake` for server-side PDF
- Vitest for engine unit tests

## Outputs

A submitted form produces:

- **HTML preview** of the arc42 document with maturity report.
- **PDF** via `pdfmake`.
- **AsciiDoc bundle** in arc42's native format (one file per section + index)
  emitted from `asciidoc-builder.ts`.
- **FHIR R5 Bundle** (`Questionnaire` + `QuestionnaireResponse` +
  `Composition`) generated by `bin/fhir-r5/generate-fhir-r5-representations.py`.
- **XML + DTD** per SQL entity generated by
  `bin/xml-representations/generate-xml-representations.py`.

## Build order

1. `bin/create-form arc42` — scaffold.
2. Author top-level docs.
3. SQL migrations.
4. `bin/xml-representations/generate-xml-representations.py`.
5. `bin/fhir-r5/generate-fhir-r5-representations.py`.
6. SvelteKit 12-step wizard with engine + tests + PDF + AsciiDoc.
7. `bin/test-form arc42`.

## Compliance

arc42 is open-source (Creative Commons). The form itself is not a medical
device and does not invoke MDR/IVDR. The standard ISO/IEC/IEEE 26514:2022
guidance on user information design applies for the rendered document.

## References

- arc42 overview: <https://arc42.org/overview>
- arc42 template: <https://arc42.org/template>
- ADR pattern: <https://adr.github.io/>
- Sibling form precedent:
  `forms/pre-operative-assessment-by-clinician/`
