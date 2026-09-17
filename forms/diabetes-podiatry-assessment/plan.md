# Diabetes Podiatry Assessment — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

All four layers are built (2026-09-10): foundation docs (`index.md`,
`spec/index.md`, `AGENTS.md`, `plan.md`, `tasks.md`); SQL migrations plus
generated representations (XML, FHIR R5, protobuf, OpenAPI, Loco setup);
both consolidated front-ends (`front-end-with-html` and
`front-end-with-svelte`, Lily-clean); and the `back-end-with-loco` Rust
JSON-API crate. `CHANGELOG.md` and `examples/` are in place.
`bin/test-form diabetes-podiatry-assessment` passes.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — patient, clinician, main assessment table (assessment
   context, patient-wide risk factors, right/left foot examination blocks),
   and the grade / grade_rule / grade_flag trio in `sql/`. UUIDv4 PK. Source
   of truth. ✅
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI,
   and Loco setup generators.
4. **Classification engine** — `types.ts`, `utils.ts`, `podiatry-rules.ts`,
   `podiatry-grader.ts`, `flagged-issues.ts` with Vitest tests covering every
   risk category boundary, every override (active ulcer, suspected Charcot,
   previous ulcer/amputation, renal replacement therapy), and mismatched feet.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard +
   dashboard) and `front-end-with-svelte` (Lily; RESTful
   `/diabetes-podiatry-assessments/` list +
   `/diabetes-podiatry-assessments/[id]` form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form diabetes-podiatry-assessment`, Lily drift
   checks, spec / changelog drift checks.

## Design notes

- Two examined feet; each foot is neuropathy status + pulses status +
  deformity + callus + skin breakdown + active ulcer (with severity) +
  ulcer/amputation history + suspected-Charcot marker. The wizard has a
  right-foot step and a left-foot step so the two are examined independently
  before the overall risk is computed.
- Per-foot risk is a count of risk factors (insensate neuropathy,
  diminished/absent pulses, deformity, callus/skin breakdown): 0 = low,
  1 = moderate, 2+ = high. An active ulcer or suspected Charcot on that foot
  forces `active-urgent`; a previous ulcer or amputation on that foot forces
  at least `high`.
- Overall risk is the worse of the two feet, raised to `high` by renal
  replacement therapy regardless of the foot exam (NICE NG19).
- Ulcer severity (superficial / deep / infected / critical-ischaemia) is
  recorded for clinical context and downstream triage; it does not itself
  change the `active-urgent` override, since any active ulcer already forces
  it — critical-ischaemia additionally raises the dedicated
  critical-limb-ischaemia flag.
- Suspected Charcot foot is captured as a direct assessor judgement (not
  derived), matching NICE NG19's emphasis on recognizing it clinically and
  referring urgently without waiting for imaging confirmation.
