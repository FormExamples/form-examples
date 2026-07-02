# Chronic Obstructive Pulmonary Disease Review (COPD Annual Review) — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

All four layers are built (2026-07-02): foundation docs (`index.md`,
`spec/index.md`, `AGENTS.md`, `plan.md`, `tasks.md`); SQL migrations plus
generated representations (XML, FHIR R5, protobuf, OpenAPI, Loco setup);
both consolidated front-ends (`front-end-with-html` and
`front-end-with-svelte`, Lily-clean); and the `back-end-with-loco` Rust
JSON-API crate. `CHANGELOG.md` and `examples/` are in place.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single review table in `sql/`: context and
   identification fields, spirometry, symptom, exacerbation, smoking, inhaler,
   vaccination, pulmonary-rehab, and self-management fields, timestamps;
   UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Grading engine** — `types.ts`, `utils.ts`, `review-rules.ts`,
   `review-grader.ts`, `flagged-issues.ts` with Vitest tests covering GOLD
   boundaries, symptom / exacerbation thresholds, every ABE group, and every
   completeness grade.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form chronic-obstructive-pulmonary-disease-review`,
   Lily drift checks, spec / changelog drift checks.

## Design notes

- The review is documentation- and classification-driven: it grades completeness
  and classifies severity/risk, but never diagnoses COPD or prescribes therapy.
- Four independent outputs — GOLD grade (airflow), symptom axis, exacerbation
  axis (combining into ABE group), and review-completeness grade — so a review
  can be complete yet high-risk, or incomplete yet low symptom burden.
- The symptom axis accepts either mMRC (≥ 2) or CAT (≥ 10); the pulmonary-rehab
  flag uses the MRC 1–5 grade (≥ 3) per NICE NG115, distinct from the mMRC 0–4
  symptom axis.
- A missing spirometry or symptom measure forces `reviewStatus = 'incomplete'`
  and can leave `goldGrade` / `abeGroup` as `null`; the score must never invent a
  normal value for a missing input.
