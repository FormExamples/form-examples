# Cardiology Response — plan

## Current status

Full gold-standard build. SQL schema (source of truth) and per-form
documentation are in place; generated derivatives, the front-end, and the Loco
back-end crate follow.

## Why this form exists

Cardiology replies to referrals vary in structure and completeness, and critical
findings (critical arrhythmia, severe symptomatic aortic stenosis, acute
coronary syndrome) must be communicated promptly and unambiguously. This form
makes the reply structured and gradeable so the diagnosis, severity, and
follow-up urgency are explicit, auditable, and safely actioned. It is the
**response** half of the pair with [`cardiology-request`](../cardiology-request).

## Design principles

- **Four orthogonal axes.** Response classification, severity, completeness, and
  follow-up urgency are independent.
- **Critical results escalate.** A critical finding auto-escalates follow-up
  urgency to critical-alert and raises the `critical-finding` flag.
- **Pure scoring engine.** Deterministic function with stable rule IDs shared
  across the front-end and the back-end.
- **Schema is the source of truth.** Everything downstream is generated.
- **Single-page wizard.** One continuous form, no multi-page navigation.
- **Consolidated front-end.** A single `front-end-with-svelte/` SvelteKit app
  (mirrors the `*-test-result` gold template).

## Build order

1. [x] SQL migrations (patient, clinician, response, grade, grade_rule, grade_flag)
2. [x] index.md / AGENTS.md / plan.md / tasks.md / doc
3. [x] Generated representations (XML, FHIR R5, protobuf, OpenAPI)
4. [x] Loco setup script, examples, spec, CHANGELOG.md
5. [x] front-end-with-svelte (consolidated SvelteKit wizard + TS engine)
6. [x] back-end-with-loco (Rust JSON API crate; cargo check + engine tests pass)

## Future enhancements

- FHIR Communication / DiagnosticReport mapping for counter-referral exchange.
- Curated normal / cardiac-condition / critical example fixtures.
