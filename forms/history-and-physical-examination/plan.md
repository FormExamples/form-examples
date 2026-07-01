# History and Physical Examination (H&P) — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Foundation docs authored (`index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
`tasks.md`). SQL, generated representations, front-ends, and back-end not yet
built.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single clerking table in `sql/`: encounter and
   identification fields, history sections, allergy status, vital signs,
   examination by system, investigations, impression, and management plan;
   timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Completeness engine** — `types.ts`, `utils.ts`, `validation-rules.ts`,
   `hp-validator.ts`, `flagged-issues.ts` with Vitest tests covering each status
   class, both blocking flags, and every vital-sign boundary.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form history-and-physical-examination`, Lily drift
   checks, spec / changelog drift checks.

## Design notes

- This is a **completeness** form, not a scored instrument: the engine grades how
  thoroughly the clerking is documented (Complete / Partial / Incomplete) and
  reports a completeness percentage — it never computes a diagnostic or risk
  score.
- Allergy status is a first-class enum (`none-known` / `has-allergies` /
  `not-documented`) so that "no known drug allergies" counts as documented while
  a blank counts as a blocking omission.
- Two blocking flags force `incomplete` regardless of the completeness
  percentage: allergies undocumented, and no impression and no plan.
- Core examination systems (cardiovascular, respiratory, abdominal,
  neurological) may be explicitly **deferred** with a reason and still count as
  addressed, so partial examinations are documented honestly.
- The wizard is long (15 steps) but must remain one continuous single-page
  wizard.
