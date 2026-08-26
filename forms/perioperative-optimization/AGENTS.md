# Perioperative Optimization — Agent Instructions

Perioperative optimization and prehabilitation intake. Collects modifiable
pre-operative risk across eight domains via a 16-step single-page wizard; grades
each domain as **optimized / in-progress / action-required / insufficient-time /
not-applicable** against the time remaining before surgery; computes a composite
**surgical readiness** band and a set of safety flags; and emits a
domain-by-domain prehabilitation plan.

See [`index.md`](./index.md) for the full design, the domain table, and the
16-step wizard table.

## Spelling

This form is written in **Oxford spelling** (`-ize`), per
[`/spec/oxford-spelling.md`](../../spec/oxford-spelling.md). One stem is used
everywhere — prose, the directory slug, SQL table and column names
(`perioperative_optimization`, `domains_optimized`), enum values
(`optimization-required`, `defer-and-optimize`, `accept-unoptimized-risk`), and
every generated artefact — so they stay keyed to one another. Do not "fix" the
stem to `-ise`: it would break every generated file and the `bin/` drift
detectors.

British spelling is otherwise retained, as Oxford requires: anaemia,
haemoglobin, oedema, glycaemic, paediatric, anaesthetic, centre, programme.

Three classes of `-ise`/`-isation` are deliberate and must **not** be converted:

- **URLs**, byte for byte.
- **Publication titles cited as published** — CPOC's *Preoperative Assessment
  and Optimization for Adult Surgery*, the ACI *Perioperative Toolkit —
  Optimization*, and the NHS England long-read title.
- **Standards bodies' own names and terminology** — the *International Dysphagia
  Diet Standardisation Initiative* and its level-3 label *Liquidised*.

## What this form is not

It is **not** another ASA-grading pre-operative assessment. The monorepo already
has three of those ([`pre-operative-assessment-by-clinician`](../pre-operative-assessment-by-clinician),
[`pre-operative-assessment-by-patient`](../pre-operative-assessment-by-patient),
[`pre-anaesthesia-assessment`](../pre-anaesthesia-assessment)). This form does
not compute an ASA grade and must not grow one. Its question is *what is
modifiable, and is there time to modify it?* If a change would make this form
answer "how risky is this patient?" instead, it belongs in one of the siblings.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/index.md` — living domain spec (update before changing code)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./CHANGELOG.md` — Keep a Changelog 1.1.0 + SemVer, scoped to this form
- `./doc/` — clinical reference documentation (domain thresholds and lead times,
  time-to-surgery gating, medication hold rules, safety-case notes)
- `./examples/` — filled-form JSON fixture + FHIR R5 Bundle sample
- `./sql/` — PostgreSQL migrations, the source of truth for the data shape
- `./xml/`, `./fhir/r5/`, `./protobuf/`, `./openapi/` — generated
- `./front-end-with-html/` — single-page wizard (`index.html`) + review
  dashboard (`dashboard.html`); Lily Design System, ES modules, no build
- `./front-end-with-svelte/` — SvelteKit wizard + dashboard; routes nested under
  `src/routes/perioperative-optimization/`
- `./back-end-with-loco/` — Rust axum + Loco JSON API; crate source under
  `src/perioperative_optimization/`

## Scoring engine

- **Input shape:** `PerioperativeOptimization`, one section per wizard step.
- **Output shape:**

  ```ts
  calculateOptimization(data: PerioperativeOptimization): {
    weeksToSurgery: number | null;
    domains: DomainResult[];          // one per domain, in DOMAIN_ORDER
    computedReadiness: 'ready' | 'optimization-in-progress'
                     | 'optimization-required' | 'defer-surgery';
    finalReadiness: 'ready' | 'optimization-in-progress'
                  | 'optimization-required' | 'defer-surgery';
    overrideReason: string;
    gateDecision: GateDecision;
    mustScore: number | null;         // 0..6
    auditCScore: number | null;       // 0..12
    stopBangScore: number | null;     // 0..8
    dasiScore: number | null;
    friedPhenotypeScore: number | null;  // 0..5
    friedFrailtyCategory: 'robust' | 'pre-frail' | 'frail' | '';
    firedRules: FiredRule[];
    flags: AdditionalFlag[];
  }

  interface DomainResult {
    domain: DomainKey;
    status: 'optimized' | 'in-progress' | 'action-required'
          | 'insufficient-time' | 'not-applicable';
    triggered: boolean;
    leadTimeWeeks: number;
    weeksShortfall: number | null;    // positive when time is short
    finding: string;
    intervention: string;
  }
  ```

- **Algorithm:** per-domain trigger → gate on time → max-grade composite. The
  worst domain sets the readiness band. Safety flags fire independently.
- **Engine files (HTML):** `js/types.js`, `js/domain-rules.js` (also exports
  `computeFriedPhenotypeScore()`), `js/gating.js`, `js/composite-grader.js`,
  `js/flagged-issues.js`.
- **Engine files (Svelte):** the same modules in TypeScript under
  `src/lib/engine/` (`types.ts`, `defaults.ts`, `utils.ts`, `domain-rules.ts`,
  `gating.ts`, `flagged-issues.ts`, `grader.ts`), with `grader.test.ts`.
- **Purity:** the engine is a pure function — no I/O, no `Date.now()`. Both the
  assessment date and the planned surgery date come from the data, so
  `weeksToSurgery` is derived from recorded values and the function is
  deterministic.

## The eight domains and their lead times

Defined once in `DOMAIN_DEFINITIONS`; every front-end and the back-end read the
same table. Do not duplicate the thresholds inline.

| Key | Lead time (weeks) | Trigger summary |
| --- | --- | --- |
| `anaemia` | 4 (IV iron) / 8 (oral) | Hb below the sex threshold, or iron deficiency on ferritin / TSAT |
| `glycaemic-control` | 12 | HbA1c ≥ 48 mmol/mol; ≥ 69 also forces `defer-surgery` |
| `smoking` | 4 | any current smoker |
| `alcohol` | 4 | > 14 units/week, or AUDIT-C ≥ 5 (men) / ≥ 4 (women) |
| `nutrition` | 3 | MUST ≥ 2, or unintentional weight loss > 10 % |
| `physical-fitness` | 6 | METs < 4, DASI < 34, 6-minute walk < 400 m, or CPET AT < 11 |
| `medication` | 1 | a hold-requiring medicine in use without an agreed plan |
| `cardiorespiratory` | 4 | uncontrolled hypertension, asthma or COPD, EF < 40 %, or STOP-BANG ≥ 5 unassessed |

## Time-to-surgery gating

```
weeksToSurgery = (plannedSurgeryDate - assessmentDate) / 7   // null if either is absent

not triggered                                  -> 'optimized' | 'not-applicable'
triggered, started, weeks >= leadTime          -> 'in-progress'
triggered, weeks >= leadTime                   -> 'action-required'
triggered, weeks <  leadTime                   -> 'insufficient-time'
triggered, weeksToSurgery === null             -> 'action-required'   (ungated)
```

`insufficient-time` on any domain forces `defer-surgery` and raises the
`insufficient-time-to-optimize` flag. This is the whole point of the form: the
team must then either re-date the surgery or record an explicit accept-risk
decision. Never soften this to a warning.

## Clinician override

The engine produces a computed readiness band. The responsible clinician may
override it on step 16 with a mandatory reason — usually to record *accept
unoptimized risk*. Both bands are stored in
`perioperative_optimization_grade` and printed. **Safety flags are computed
independently and are never filtered by the override.**

## Conventions

- Empty string `''` for unanswered text and enum fields.
- `null` for unanswered numeric, date, and time fields.
- Yes/no fields are the string union `'yes' | 'no' | ''` so they round-trip to
  the SQL `CHECK` constraints without a boolean-to-enum translation layer.
- camelCase property names in TypeScript and front-end Rust serde;
  snake_case in SQL and Rust internals.
- Step components named `StepNName.svelte` (1-indexed; no spaces, ampersands,
  or parentheses in the filename).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys via `gen_random_uuid()`; `created_at`, `updated_at`,
  `deleted_at` on every table.
- Import and export via JSON, XML, CSV, and TSV.
- Generated artefacts are never hand-edited.

## Front-end HTML stack

- Static HTML + Lily Design System headless classes; no build step.
- Native ES modules per [`/spec/es-modules.md`](../../spec/es-modules.md).
- Header controls: locale select, theme select, text-size picker, share picker.
- LocalStorage draft key: `perioperative-optimization.front-end-with-html.v1`.

## Front-end SvelteKit stack

- SvelteKit 2.x + TypeScript, Svelte 5 runes.
- Tailwind CSS 4; `pdfmake` for the PDF report endpoint; Vitest for the engine.
- Routes nested under `src/routes/perioperative-optimization/`, RESTful
  dashboard at `/perioperative-optimizations/` and
  `/perioperative-optimizations/[id]/`.
- LocalStorage draft key:
  `perioperative-optimization.front-end-with-svelte.<id>.v1`.

## Back-end stack

- Rust, Loco 1.0.1 on axum 0.8, SeaORM with PostgreSQL.
- JSON API only — no Tera, HTMX, Alpine, or CSS.
- Relational per-table schema: one migration and one entity per SQL table.
- `i64` ids (loco-rs 1.0 `ColType::PkAuto` renders `BIGINT`).

## Clinical grounding

- NHS England perioperative-pathway optimization guidance.
- CPOC *Preoperative Assessment and Optimization for Adult Surgery* (2021),
  and the CPOC perioperative anaemia and diabetes guidelines.
- NICE NG45 (routine preoperative tests) and NG180 (perioperative care).
- BAPEN MUST; Duke Activity Status Index; AUDIT-C; STOP-BANG; Clinical Frailty
  Scale; Fried Frailty Phenotype; Risk Analysis Index.
- ASA consensus-based guidance on preoperative GLP-1 receptor agonist
  management; UK MHRA drug safety update on GLP-1 aspiration risk; British
  Geriatrics Society frailty-screening guidance. See
  [`doc/glp1-frailty-perioperative-management.md`](doc/glp1-frailty-perioperative-management.md).

## Compliance

MDCG 2019-11 Rev.1, UK Medical Devices Regulations 2002, ISO/IEC/IEEE
26514:2022, UK MHRA Software and AI as a Medical Device. Decision support only:
the form does not decide whether surgery proceeds.

## Verify

```sh
bin/test-form perioperative-optimization
bin/test-sql-apply perioperative-optimization
bin/test-examples-conformance perioperative-optimization
bin/lily-html-refactor --check perioperative-optimization
```
