# General Practitioner Referral Letter — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

All layers built as of 2026-07-02: foundation docs (`index.md`,
`spec/index.md`, `AGENTS.md`, `plan.md`, `tasks.md`); SQL migrations plus
generated representations (XML, FHIR R5, protobuf, OpenAPI, Loco setup);
both consolidated front-ends (`front-end-with-html` and
`front-end-with-svelte`); the Loco JSON-API back-end; and `CHANGELOG.md` +
`examples/`.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — referral table in `sql/`: referrer, patient,
   destination, urgency, and clinical-content fields, timestamps; UUIDv4 PK.
   Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Documentation engine** — `types.ts`, `utils.ts`, `validation-rules.ts`,
   `referral-validator.ts`, `flagged-issues.ts` with Vitest tests covering each
   urgency's mandatory set, the Complete / Incomplete boundary,
   `completenessPercent`, and every flag.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form general-practitioner-referral-letter`, Lily drift
   checks, spec / changelog drift checks.

## Design notes

- This is a **documentation / completeness** form, not a numeric-score
  instrument. The engine grades the *letter*, not the patient, and never blocks
  sending — it reports status, urgency, completeness, and flags.
- The mandatory-field set is **urgency-conditional**: `urgent` and
  `two-week-wait` require an urgency reason; `two-week-wait` additionally
  requires a named suspected-cancer criterion and pathway.
- `emergency` urgency and documented red-flag symptoms raise a high-priority flag
  advising same-day assessment / 999 rather than a routine letter.
- Consent and safety-netting are captured but do not block completeness; their
  absence raises flags only.
- The wizard is 9 steps but must remain one continuous single-page wizard.
