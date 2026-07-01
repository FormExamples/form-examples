# Cardiology Request — plan

## Current status

Full gold-standard build. SQL schema (source of truth) and per-form
documentation are in place; generated derivatives, front-ends, and the Loco
back-end crate follow.

## Why this form exists

Cardiology departments triage incoming referrals by clinical acuity, safety, and
appropriateness, but referral quality varies — the reason for referral and the
specific clinical question are the most commonly omitted, highest-value fields,
and acute red flags (suspected ACS, exertional syncope, new-onset heart failure)
must never be missed. This form makes the referral structured and gradeable so
vetting is consistent, auditable, and aligned with NICE and ESC guidance. It is
the **request** half of the pair with [`cardiology-response`](../cardiology-response).

## Design principles

- **Four orthogonal axes.** Appropriateness, safety / red-flag, completeness,
  and triage are independent and each citable to a recognised body.
- **Red flags escalate.** Suspected ACS, exertional syncope, or new-onset heart
  failure drive the safety axis and auto-escalate the triage tier.
- **Pure scoring engine.** Deterministic function with stable rule IDs shared
  across every front-end and the back-end.
- **Schema is the source of truth.** Everything downstream is generated.
- **Single-page wizard.** One continuous form, no multi-page navigation.
- **Consolidated front-ends.** A single `front-end-with-html/` (index.html wizard + dashboard.html) and a single `front-end-with-svelte/`, each combining form + dashboard, harmonised with `cardiology-response`.

## Build order

1. [x] SQL migrations (patient, clinician, request, grade, grade_rule, grade_flag)
2. [x] index.md / AGENTS.md / plan.md / tasks.md / doc
3. [x] Generated representations (XML, FHIR R5, protobuf, OpenAPI)
4. [x] Loco setup script, examples, spec, CHANGELOG.md
5. [x] front-end-with-html (consolidated HTML wizard + dashboard + JS four-axis engine)
6. [x] front-end-with-svelte (consolidated SvelteKit wizard + dashboard + TS engine)
7. [x] back-end-with-loco (Rust JSON API crate; cargo check + engine tests pass)

## Future enhancements

- NICE CG95 pre-test-likelihood lookup to refine appropriateness.
- Curated routine / urgent / emergency example fixtures.
