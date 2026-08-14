# Plan: UK Lasting Power of Attorney for Health and Care Decisions

## Current status

Scaffolded 2026-05-18. Statutory design grounded in the Mental Capacity
Act 2005 (E&W), the LPA Regulations 2007 (as amended), and the Office of
the Public Guardian's published LP1H form and notes.

## Why this form exists

A Lasting Power of Attorney for Health and Welfare must satisfy a
substantial set of statutory formalities before it has legal effect. The
paper LP1H form is long, the rules around who may act as a certificate
provider are intricate, and the signing-order requirement (donor →
certificate provider → attorneys) is unforgiving — a single misordered
signature invalidates the entire instrument and the donor must restart.
Citizens, solicitors, and advocates need a tool that captures every
statutory field, validates it in real time, and produces an OPG-ready
submission packet.

The form is the legal-administrative counterpart to the *Advance Decision
to Refuse Treatment* and *Advance Statement about Care* forms already in
the monorepo: those record the donor's autonomous wishes; this records
the donor's delegated authority.

## Design principles

- **Statutory faithfulness** — every field maps 1-to-1 to a section of
  the paper LP1H form. No field is invented; no statutory field is
  omitted.
- **Validity is binary at fatal level** — a single fatal-severity rule
  invalidates the whole LPA. High-severity rules are correctable.
  Medium / informational flags inform without blocking submission.
- **Sign-order is enforced** — donor first, certificate provider second,
  attorneys third. Cross-validated against captured signing dates.
- **No silent overrides** — the validity engine surfaces every fired
  rule and every flag; the solicitor or donor is responsible for the
  final go / no-go decision.
- **Single-page wizard** — 14 steps on one continuous page (monorepo rule;
  no multi-page forms).
- **Symmetric with the ADRT form** — when both records exist for the
  same donor, the validator cross-checks for instruction-vs-ADRT
  conflicts.
- **Pure validator** — `calculateLpaValidity()` is a pure function,
  Vitest-tested for every rule.
- **FHIR-first exchange** — canonical interchange is a FHIR R5 Bundle
  centred on a `Consent` resource representing the LPA.

## Validity engine

Six rule families run in parallel:

- **Donor rules** — age, capacity declaration, residence, signature
  presence and date.
- **Attorney rules** — count (1 – 4), age, capacity, bankruptcy flag
  (informational), decision-making style consistency.
- **Certificate-provider rules** — family-exclusion, employment-exclusion,
  skill-based or knowledge-based route, two-year rule, attorney-conflict.
- **Signature-order rules** — donor signed before certificate provider;
  certificate provider signed before all attorneys; witness identity
  excludes attorneys.
- **Instruction rules** — lawfulness, possibility, no contradiction with
  a known ADRT, no authorization of prohibited acts (assisted dying,
  unlawful restraint).
- **Registration rules** — applicant identity, fee or remission, people-
  to-notify count ≤ 5, jurisdiction (E&W).

Severity cascade: any **fatal** rule → `invalid`; otherwise any **high**
rule → `needs-correction`; otherwise `ready-to-register`.

## Build order

1. [x] Scaffold directory via `bin/create-form`.
2. [x] Write top-level documentation: `index.md`, `AGENTS.md`, `plan.md`,
       `tasks.md`.
3. [ ] Write `doc/` reference material: statutory rule catalogue,
       OPG-LP12 / LP13 alignment, certificate-provider decision tree,
       MCA 2005 mapping, ADRT cross-form note.
4. [ ] Author SQL Liquibase migrations: lpa, donor, attorney,
       replacement_attorney, decision_rule, lst_choice, preference,
       instruction, person_to_notify, certificate_provider, signature,
       registration_application, validity_result,
       validity_fired_rule, validity_additional_flag.
5. [ ] Generate XML + DTD representations with
       `bin/xml-representations/generate-xml-representations.py`.
6. [ ] Generate FHIR R5 JSON with
       `bin/fhir-r5/generate-fhir-r5-representations.py` (Consent resource
       backbone).
7. [ ] Generate Protocol Buffer schemas with
       `bin/protobuf/generate-protobuf-representations.py`.
8. [ ] Build SvelteKit single-page wizard (front-end-with-svelte).
9. [ ] Build static HTML wizard (front-end-with-html) with
       Alpine.js.
10. [ ] Build SvelteKit + SVAR Grid review dashboard
        (front-end-with-svelte).
11. [ ] Build HTML review table (front-end-with-html).
12. [ ] Run `cargo loco generate scaffold` via
        `back-end-with-loco-new/00-new.sh`.
13. [ ] Build Rust full-stack with axum/Loco JSON API.
14. [ ] Unit-test validity engine (Vitest).
15. [ ] Run `bin/test-form united-kingdom-lasting-power-of-attorney-for-health-and-care-decisions`.

## Future enhancements

- Zod runtime validation on the SvelteKit client.
- Axe-core WCAG 2.2 AA accessibility audit.
- End-to-end tests with Playwright.
- LocalStorage autosave with draft recovery.
- Welsh-language UI (Cymraeg) — Welsh Language (Wales) Measure 2011.
- Easy Read / large-print mode for donors with cognitive or visual
  impairment.
- Integration with the OPG digital-LPA API once the Powers of Attorney
  Act 2023 commencement order is in force.
- ADRT cross-form validator — surface conflicts between donor's LPA
  instructions and their existing Advance Decision to Refuse Treatment.
- Capacity assessment helper aligned with MCA s.2 — separate but linked
  workflow.
- Audit log of every saved revision with timestamped author identity.
- BSL video upload for donors who communicate in British Sign Language
  (form notes accompanied by a recorded video appendix).
