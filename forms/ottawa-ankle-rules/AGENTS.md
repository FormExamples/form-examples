# Ottawa Ankle Rules (and Ottawa Foot Rules) — Agent Instructions

A validated clinical decision rule that decides whether an **ankle X-ray** and/or
a **foot X-ray** is needed after an acute ankle or midfoot injury. Collects
objective bedside findings via a single continuous single-page wizard — pain
zone, bone tenderness at four landmarks, and ability to bear weight — and applies
a boolean decision algorithm to output two independent imaging decisions
(ankle indicated yes/no, foot indicated yes/no). This is a **classification /
decision-rule** form, not a numeric score: there is no total and no risk band.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (Stiell et al.; BMJ review)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Decision engine

- **Input shape:** `OttawaAnkleRulesAssessment` TypeScript type — context and
  identification fields, the applicability flag, and the eight criterion inputs.
- **Output shape:**
  ```ts
  gradeOttawaAnkleRules(data: OttawaAnkleRulesAssessment): {
    unableToBearWeight: boolean;
    ankleXrayIndicated: boolean;
    footXrayIndicated: boolean;
    firedCriteria: FiredCriterion[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** boolean decision rule (no summation). Each enum finding is true
  when its value is `'yes'`. See spec §4.
  - `unableToBearWeight = ableToBearWeightImmediately == 'no' && ableToBearWeightNow == 'no'`
  - `ankleXrayIndicated = malleolarZonePain == 'yes' && (lateralMalleolusTenderness == 'yes' || medialMalleolusTenderness == 'yes' || unableToBearWeight)`
  - `footXrayIndicated = midfootZonePain == 'yes' && (fifthMetatarsalBaseTenderness == 'yes' || navicularTenderness == 'yes' || unableToBearWeight)`
  - The two decisions are independent; `unableToBearWeight` feeds both.
  - `''` (unanswered) is treated as a negative finding for the decision but
    raises a data-completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `ottawa-ankle-rules.ts`,
  `ottawa-ankle-grader.ts`, `flagged-issues.ts`.
- **Tests:** `ottawa-ankle-grader.test.ts`, `ottawa-ankle-rules.test.ts` — cover
  each ankle criterion (A1/A2/A3) and foot criterion (F1/F2/F3) in isolation,
  the zone-pain precondition gating, the `unableToBearWeight` truth table, and
  the four decision combinations (ankle only / foot only / both / neither).

## Flagged issues

Computed independently of the decision (see spec §5): ankle X-ray indicated
(`ankleXrayIndicated`, high), foot X-ray indicated (`footXrayIndicated`, high),
unable to bear weight (`unableToBearWeight`, high), applicability age
(`ageYears < 18`, medium), applicability unreliable assessment
(`assessmentReliable == 'no'`, medium), incomplete assessment (criterion input
missing for a region with zone pain, low).

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric, date, and time fields.
- Bedside findings captured as `yes` / `no` enums so unanswered (`''`) is
  distinct from a negative (`no`) finding.
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

- Stiell I.G. *et al.* Clinical decision rules for radiography in acute ankle
  injuries. *Ann Emerg Med* 1992; 21(4):384–390.
- Stiell I.G. *et al.* Decision rules for radiography in acute ankle injuries:
  refinement and prospective validation. *JAMA* 1993; 269(9):1127–1132.
- Stiell I.G. *et al.* Implementation of the Ottawa Ankle Rules. *JAMA* 1994;
  271(11):827–832.
- Bachmann L.M. *et al.* Accuracy of Ottawa ankle rules. *BMJ* 2003;
  326(7386):417.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form ottawa-ankle-rules
```
