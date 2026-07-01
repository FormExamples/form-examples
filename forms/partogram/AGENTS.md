# Partogram (Partograph) — Agent Instructions

A graphical record of the progress of labour. Collects a **timed series of
intrapartum observations** via a single continuous single-page wizard — cervical
dilatation, descent of head, uterine contractions, fetal heart rate, liquor and
moulding, maternal vitals, urine, and drugs / oxytocin — and computes a
**labour-progress classification** (Normal / Alert-line crossed / Action-line
crossed) plus threshold flags. It is not a validated numeric score.

See [`index.md`](./index.md) for the full design and the observation-group and
flag tables, and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (WHO Labour Care Guide, NICE NG235)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Progress / flag engine

- **Input shape:** `PartogramRecord` TypeScript type — the labour header
  (context, identification, admission) plus an ordered array
  `observations: PartogramObservation[]`, each a timed row of the observation
  groups in `index.md`.
- **Output shape:**
  ```ts
  gradePartogram(data: PartogramRecord): {
    activePhaseStartAt: string | null;      // reference time for the lines
    latestDilatationCm: number | null;
    elapsedHours: number | null;            // since active phase began at 4 cm
    alertLineExpectedCm: number | null;     // 4 + elapsedHours
    actionLineExpectedCm: number | null;    // elapsedHours (= 4 + (t - 4))
    progressClassification: 'normal' | 'alertLineCrossed' | 'actionLineCrossed';
    firedLines: FiredLine[];                // which reference lines are crossed
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm (see spec §4):** find the latest observation carrying a cervical
  dilatation; compute `elapsedHours` (t) from `activePhaseStartAt`; then

  ```
  alertLineExpectedCm  = 4 + t
  actionLineExpectedCm = t                 // 4 + (t - 4)

  progressClassification =
      dilatation >= alertLineExpectedCm  ? 'normal'
    : dilatation >  actionLineExpectedCm ? 'alertLineCrossed'
    :                                      'actionLineCrossed'
  ```

  A point is "right of" a line when its dilatation is **less** than the line's
  expected dilatation for the elapsed time. With no dilatation observation the
  classification is `normal` and an incomplete-observation flag is raised.
- **Engine files:** `types.ts`, `utils.ts`, `partogram-rules.ts`,
  `partogram-grader.ts`, `flagged-issues.ts`.
- **Tests:** `partogram-grader.test.ts`, `partogram-rules.test.ts` — cover the
  line boundaries (on / just-left / just-right of alert and action lines), FHR
  110/160 and maternal-vital thresholds, and the no-observation case.

## Flagged issues

Computed independently of the progress classification (see spec §5), each scanned
across the whole observation series, each with a priority:

- **Action line crossed** (high) — latest dilatation on / right of the action
  line (`dilatation <= t`).
- **Fetal heart rate abnormal** (high) — any FHR `< 110` or `> 160` bpm.
- **Meconium-stained liquor** (high) — any liquor state = meconium-stained.
- **Maternal fever** (high) — any temperature `>= 37.5 °C`.
- **Maternal hypertension** (high) — any systolic `>= 140` or diastolic `>= 90`.
- **Alert line crossed** (medium) — latest dilatation between alert and action
  lines (`t < dilatation < 4 + t`).
- **Poor progress / prolonged labour** (medium) — no increase in dilatation
  across `>= 4 h` of active labour.
- **Maternal tachycardia** (medium) — any pulse `>= 120` bpm.
- **Maternal hypotension** (medium) — any systolic `< 90` mmHg.
- **Ketonuria** (low) — urine ketones present.
- **Proteinuria** (low) — urine protein present.
- **Incomplete observation** (low) — a plotted row missing dilatation or time.

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde.
- snake_case in SQL and Rust internals.
- The observation series is a child table (one row per timed observation) keyed
  to the parent labour record; SQL uses UUIDv4 foreign keys.
- Step components named `StepNName.svelte` (1-indexed).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys via `gen_random_uuid()`.
- `created_at`, `updated_at`, `deleted_at` timestamps on every table.
- Import and export via JSON, XML, CSV, and TSV.
- Generated artefacts (XML, FHIR, protobuf, OpenAPI, Loco setup) are never
  hand-edited.

## Clinical grounding

- World Health Organization. *WHO Labour Care Guide: user's manual.* 2020.
- World Health Organization. *WHO recommendations: intrapartum care for a
  positive childbirth experience.* 2018.
- Philpott R.H., Castle W.M. Cervicographs in the management of labour. 1972.
- NICE NG235. *Intrapartum care* (2023).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form partogram
```
