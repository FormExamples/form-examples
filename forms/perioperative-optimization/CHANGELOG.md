# Changelog — Perioperative Optimization

All notable changes to this form (schema, scoring engine, front-ends, and
back-end) are recorded here.

The format follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/)
and the project uses [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

Cross-cut changes that affect every form (Lily refactor passes, generator
upgrades, repo-wide convention shifts) live in the root `CHANGELOG.md`; this
file only records changes scoped to the **Perioperative Optimization** form.

## [Unreleased]

### Added
- Initial form: a perioperative optimization and prehabilitation intake across a 16-step
  single-page wizard, answering *what is still fixable before surgery, and is there time to
  fix it?* rather than the ASA-grading question its three sibling pre-operative forms answer.
- **Time-to-surgery gating**, the engine's distinguishing computation: each of the eight
  optimization domains carries a lead time — the minimum weeks its intervention needs to work —
  and every finding is gated against the weeks remaining. A domain that cannot be optimized in
  time is graded `insufficient-time`, which forces a `defer-surgery` readiness band and raises
  a non-suppressible flag.
- Eight optimization domains with thresholds from NHS England, CPOC, and NICE: anaemia and
  iron deficiency (4-week intravenous / 8-week oral lead time), glycaemic control (12 weeks),
  smoking (4), alcohol (4), nutrition (3), physical fitness (6), medication (1), and
  cardiorespiratory (4).
- Surgical readiness by max-grade across the domains: `ready`,
  `optimization-in-progress`, `optimization-required`, `defer-surgery`.
- Thirty safety-flag categories, including the three high-consequence medication classes:
  SGLT2 inhibitors (euglycaemic ketoacidosis), GLP-1 agonists (delayed gastric emptying and
  aspiration), and unplanned anticoagulant gaps.
- GLP-1 receptor agonist perioperative management fields (step 4): formulation, held per
  guideline, extended clear-fluid fast confirmed, active GI symptoms, gastric ultrasound.
- Expanded frailty assessment (step 12): Fried Frailty Phenotype (5 criteria, computed 0-5
  score + robust/pre-frail/frail category), Risk Analysis Index, and Mini-Cog cognitive screen
  (indicated at CFS >= 5); protein-supplementation field added to the physical-fitness domain
  (step 11).
- Four new safety flags: `cognitive-assessment-indicated`, `sarcopenia-risk`,
  `dehydration-aki-risk`, `rebound-glycaemic-risk` -- see
  [`doc/glp1-frailty-perioperative-management.md`](doc/glp1-frailty-perioperative-management.md).
- A mandatory human gate decision at sign-off (`proceed`, `proceed-with-prehabilitation`,
  `defer-and-optimize`, `accept-unoptimized-risk`, `mdt-review`, `cancel`), with a submit guard
  that blocks `proceed` against a computed `defer-surgery` band.
- `recommendedEarliestSurgeryDate`: the date at which every triggered domain would have had its
  full lead time, derived from the largest shortfall, so re-dating is arithmetic.
- SQL schema (`sql/02`–`sql/11`), including a `_grade_domain` child table because the per-domain
  statuses are this form's primary output rather than an audit trail beneath a single score.
- Generated XML + DTD, FHIR R5, Protocol Buffers, and OpenAPI 3.1 representations, plus the
  Loco scaffold script, `examples/`, and `llms.txt`.
- `front-end-with-html/`: the wizard with a live readiness strip, and a waiting-list dashboard
  keyed on weeks-to-surgery and domains short on time. Passes the Playwright smoke and axe-core
  accessibility sweep.
- `front-end-with-svelte/`: the same surfaces in SvelteKit 2 / Svelte 5 runes with a welcome
  page, a `pdfmake` report endpoint, and 100 Vitest cases covering every domain threshold and
  both sides of every gating boundary. The HTML engine runs the identical case list.
- Clinical reference documentation in `doc/`: per-domain thresholds and lead-time
  justifications, the gating model with four worked examples, perioperative medication hold
  rules, and clinical-safety case notes with a twelve-entry hazard list.

### Changed
- `glp1-agonist-aspiration-risk` now fires only when active GI symptoms are reported, or the
  drug was neither held per guideline nor an extended clear-fluid fast confirmed -- previously
  it fired unconditionally whenever a GLP-1 receptor agonist was in use.
- _Pending — record further schema migrations, scoring-engine behaviour changes,
  re-banding of composite risk, front-end UX changes, breaking renames._

### Deprecated
- _Pending._

### Removed
- _Pending._

### Fixed
- _Pending — record corrections to scoring rules, schema fixes, front-end
  regressions, FHIR mapping fixes._

### Security
- _Pending — record fixes affecting PHI handling, audit logging, or access
  control._

## Versioning policy

- **MAJOR** — incompatible schema or scoring change (renamed columns,
  re-banded grades, reshaped FHIR Bundle).
- **MINOR** — backwards-compatible additions (new optional fields, new fired
  rules that only add flags, new examples).
- **PATCH** — fixes that do not change the public contract (UI bugs, doc
  corrections, regenerated derived artefacts).

## See also

- [`spec.md`](spec.md) — living domain spec.
- [`plan.md`](plan.md) — development roadmap.
- [`tasks.md`](tasks.md) — open and completed tasks.
- [`examples/`](examples/) — filled-form JSON fixtures and FHIR Bundle samples
  used as referenced material for changelog entries.
