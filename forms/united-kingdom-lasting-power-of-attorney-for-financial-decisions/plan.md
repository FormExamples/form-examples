# Plan: UK Lasting Power of Attorney for Financial Decisions

## Current status

Scaffolded 2026-05-18 from the OPG LP1F (10/25) and LP12 guide (08/25)
source pack. Design follows the canonical pattern of
`forms/pre-operative-assessment-by-clinician/` adapted from a clinical
scoring engine to a statutory-deed validator.

## Why this form exists

The LP1F is the only statutory route by which an individual can give
another person legal authority to make property and financial decisions
on their behalf and have that authority survive the donor's loss of
mental capacity. About 1.4 million LPAs are registered with the Office of
the Public Guardian each year (2024) and the OPG returns approximately
1 in 5 as defective on first submission. The defects are systematic:
witness is also an attorney, certificate provider is related, signing
order is wrong, "jointly" appointment with no replacement attorney,
continuation-sheet trigger missed. A digital form with up-front
validation eliminates the rework loop, reduces the registration delay
from 20+ weeks to under 8 weeks, and avoids the catastrophic case in
which the donor loses capacity before the LPA is corrected and re-signed
(at which point the LPA can never be made and the family must apply for
Deputyship through the Court of Protection at significantly greater
cost and time).

## Design principles

- **One continuous single-page wizard** — 15 steps on a single scrolling
  page (monorepo rule). No multi-page paginated form.
- **Statutory blocker rules are first-class** — every rule cites its
  statutory source so the user is shown why the deed cannot be
  registered as drafted, with a one-click jump back to the step that
  must be changed.
- **Max-grade composite risk** — any blocker promotes the LPA to
  `critical`; warnings are surfaced but do not block.
- **Pure validator** — `validateLpa()` is a pure function with no
  side-effects, fully unit-tested with Vitest.
- **PDF replica is canonical for filing** — the OPG accepts the paper
  LP1F so the printed PDF must be a faithful replica of the official
  form, including the LPC continuation sheets if they are triggered.
- **Donor-first language** — every step is written in plain second-person
  English ("you", "your attorneys") to match the official LP1F voice; a
  Welsh language toggle is in the roadmap.
- **Symmetric with the health-and-care LPA** — when the LP1H sibling form
  is built it will share the `person`, `signature`, and `validation_*`
  tables with this form so a single donor can hold both LPAs side by side.
- **OPG round-trip** — every field captured here maps 1:1 to a field on the
  official LP1F + LPC paper form, so the printed PDF is registrable
  without further data entry.

## Validation engine

The validator runs three rule sets in parallel and combines their outputs
into a single registration-readiness band.

- **Blocker rules** — statutory deal-breakers that prevent registration
  (e.g. attorney under 18, witness is the donor, certificate provider is
  related to an attorney). Each blocker cites a section of the Mental
  Capacity Act 2005 or a regulation in SI 2007/1253.
- **Flag rules** — non-blocking warnings that should be reviewed before
  signing (e.g. only one attorney with no replacement, reduced fee
  requested without supporting evidence, instructions text very long and
  legally ambiguous).
- **Band rules** — workflow rules that derive the `validityBand` from the
  presence and ordering of signatures (`ready_for_signing` once all data
  is captured; `partially_signed` once the donor has signed; etc.).

## Build order

1. [x] Read OPG LP1F (10/25) source PDF and capture all 15 sections.
2. [x] Read LPC continuation sheets and capture all 4 sheets.
3. [x] Scaffold directory via `bin/create-form`.
4. [x] Write top-level documentation: `index.md`, `AGENTS.md`, `plan.md`,
       `tasks.md`.
5. [ ] Write `doc/*.md` reference files.
6. [ ] Author SQL Liquibase migrations for person, lasting_power_of_attorney,
       lpa_attorney, lpa_replacement_attorney, lpa_certificate_provider,
       lpa_person_to_notify, lpa_signature, lpa_witness,
       lpa_preferences_and_instructions, lpa_registration_application,
       lpa_validation_result, lpa_validation_rule, lpa_validation_flag.
7. [ ] Generate XML + DTD representations with
       `bin/xml-representations/generate-xml-representations.py`.
8. [ ] Generate FHIR HL7 R5 JSON with
       `bin/fhir-r5/generate-fhir-r5-representations.py`.
9. [ ] Generate Protocol Buffers with
       `bin/protobuf/generate-protobuf-representations.py`.
10. [ ] Write TypeSpec schemas.
11. [ ] Build SvelteKit front-end-form (single-page wizard with validator).
12. [ ] Build HTML front-end-form (static single-page, Alpine.js).
13. [ ] Build SvelteKit dashboard (SVAR DataGrid).
14. [ ] Build HTML dashboard (static review table).
15. [ ] Write `back-end-with-loco-setup` shell script.
16. [ ] Build Rust full-stack with axum/Loco JSON API.
17. [ ] Unit-test validator (Vitest).
18. [ ] Run `bin/test-form united-kingdom-lasting-power-of-attorney-for-financial-decisions`.

## Future enhancements

- Bilingual (English / Cymraeg) UI to match the printed LP1F's Welsh
  option (helpline + section 13 contact-in-Welsh).
- Capacity assessment subform aligned with the MCA 2005 two-stage test
  (diagnostic + functional), triggered automatically when the donor is
  over 80 or has a recorded cognitive-impairment diagnosis.
- OPG online API integration when the Powers of Attorney Act 2023
  digital-registration route is fully live (currently partial).
- HMRC verification of donor's National Insurance number where the donor
  consents (helpful for evidencing identity to banks).
- Bank-share API — generate a verifiable credential the donor can hand
  to their bank to enrol attorneys in advance of the deed being needed.
- Identity verification to GOV.UK Verify L2 against the donor and each
  attorney during onboarding.
- Audit log of every change to the LPA after first signing (no edits
  permitted post-signature; only revocation or a new LPA).
- Solicitor-mode that shows the LP12 Guide cross-references inline next
  to every step.
- Reduced-fee LPA120A subform integrated into step 14.
- Notification form LP3 generated automatically for each person-to-notify
  named in step 6, ready for posting on the day of registration.
