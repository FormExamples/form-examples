# UK Lasting Power of Attorney for Financial Decisions — Agent Instructions

UK statutory deed (LP1F) under the Mental Capacity Act 2005 by which a donor
appoints attorneys to make decisions about their property and financial
affairs. Implemented as a 15-step single-page wizard with a validation
engine that fires statutory blocker rules and additional flags so the
deed is correct before it is signed and sent to the Office of the Public
Guardian for registration.

See [`index.md`](./index.md) for the full design, the 15-step wizard table,
and every validation rule.

## Directory map

- `./index.md` — project overview and full spec
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — reference documentation (LP1F structure, MCA 2005 framework,
  registration workflow, validation rules, glossary)
- `./20260420-LPA-Finance-Complete-Pack/` — source PDFs from OPG
- `./sql/` — Liquibase-formatted Postgres schema
- `./xml-representations/` — generated XML + DTD per SQL table
- `./fhir-r5/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./typespec/` — TypeSpec schemas
- `./front-end-form-with-html/` — static single-page HTML wizard
- `./front-end-form-with-svelte/` — SvelteKit single-page wizard
- `./front-end-dashboard-with-html/` — HTML review table
- `./front-end-dashboard-with-svelte/` — SvelteKit SVAR DataGrid dashboard
- `./back-end-with-loco/` — Rust backend with
  server-rendered HTMX + Alpine.js UI

## Validation engine

- **Input shape:** `Lpa` TypeScript type covering donor, attorneys (1+),
  replacement attorneys (0+), certificate provider, people to notify
  (0–5), preferences and instructions, signatures (donor + certificate
  provider + per-attorney + per-replacement), registration application,
  applicant(s), recipient.
- **Output shape:**
  ```ts
  validateLpa(data: Lpa): {
    validityBand:
      | 'draft'
      | 'ready_for_signing'
      | 'partially_signed'
      | 'fully_signed'
      | 'ready_for_registration'
      | 'submitted'
      | 'registered'
      | 'rejected';
    compositeRisk: 'low' | 'moderate' | 'high' | 'critical';
    firedRules: FiredRule[];        // statutory blockers (MCA 2005 + Regs)
    additionalFlags: AdditionalFlag[]; // non-blocking warnings
  }
  ```
- **Algorithm:** max-grade — any statutory blocker promotes `compositeRisk`
  to `critical`; otherwise the worst flag wins (`high` > `moderate` > `low`).
- **Engine files:** `types.ts`, `utils.ts`, `blocker-rules.ts`,
  `flag-rules.ts`, `band-rules.ts`, `validator.ts`.
- **Tests:** `validator.test.ts`, `blocker-rules.test.ts`,
  `flag-rules.test.ts`.

## Statutory blocker rules

Each blocker cites its statutory source so the validator can render a
remediation hint with a legal reference.

| Rule | Source |
| --- | --- |
| `DonorUnderEighteen` | MCA 2005 s. 9(2)(a) |
| `DonorMustHaveCapacity` | MCA 2005 s. 9(2)(c) |
| `AttorneyUnderEighteen` | MCA 2005 s. 10(1)(a) |
| `AttorneyBankruptOrDRO` | MCA 2005 s. 10(2), s. 13(8) |
| `NoAttorneyAppointed` | MCA 2005 s. 9(1) |
| `CertificateProviderIsAttorney` | LPA Regs 2007 reg. 8(1) |
| `CertificateProviderRelatedToAttorney` | LPA Regs 2007 reg. 8(1) |
| `CertificateProviderIsCareHomeOwner` | LPA Regs 2007 reg. 8(2) |
| `WitnessIsDonor` | LPA Regs 2007 reg. 9(2) |
| `WitnessIsAttorney` | LPA Regs 2007 reg. 9(2) |
| `JointlyButNoReplacement` | MCA 2005 s. 10(4)(a) |
| `SigningOrderViolation` | LPA Regs 2007 reg. 9(6) |
| `TrustCorporationMissingContinuationSheet4` | LPA Regs 2007 reg. 9(5) |
| `OverFourAttorneysNoContinuation` | LPA Regs 2007 reg. 9(3) |

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric and date fields.
- camelCase property names in TypeScript.
- snake_case in SQL and Rust.
- Step components named `StepNName.svelte` (1-indexed: `Step1Donor.svelte`
  … `Step15RegistrationSignature.svelte`).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the
  front-end.
- UUIDv4 primary keys; `created_at` + `updated_at` + `deleted_at`
  timestamps on every table.
- The data-entry UI lives in `front-end-form-with-*` and is operated by
  the donor (or a friend/relative helping the donor while the donor still
  has mental capacity).

## Schema strategy

- One row per LPA in `lasting_power_of_attorney`.
- Separate `person` table for every named individual (donor, each attorney,
  each replacement, certificate provider, each person to notify, each
  witness) so that natural-key dedupe and search across LPAs is possible.
- Join tables hold the LPA-specific role: `lpa_attorney`,
  `lpa_replacement_attorney`, `lpa_person_to_notify`,
  `lpa_certificate_provider`, `lpa_signature`.
- `lpa_signature` is the audit log: who signed which section, when,
  optional witness, optional signed-on-behalf-of-donor flag.
- `lpa_validation_result`, `lpa_validation_rule`, `lpa_validation_flag` are
  the equivalent of the grading tables in the canonical reference form.

## Front-end SvelteKit stack

- SvelteKit 2.x + TypeScript.
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`).
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`.
- `pdfmake` for server-side PDF (LP1F replica with LPC continuation sheets).
- Vitest for engine unit tests.
- Dynamic step route `/lpa/[step=step]/+page.svelte` with the `step`
  param matcher validating 1–15.

## Dashboard stack

- SvelteKit + SVAR DataGrid (`@svar-ui/svelte-grid`) with the Willow theme.
- Sortable columns: donor name, attorneys, mode (jointly_and_severally /
  jointly / mixed), validity band, composite risk, application status.
- Backend API client with sample-data fallback for standalone development.

## Backend stack

- Rust edition 2024.
- Loco 0.16 framework on axum 0.8.
- SeaORM 1.1 with PostgreSQL.
- Tera templates with HTMX 2.0.8 and Alpine.js 3.14.8.
- `serde(rename_all = "camelCase")` for front-end interop.

## Legal grounding

- Mental Capacity Act 2005, Part 1.
- The Lasting Powers of Attorney, Enduring Powers of Attorney and Public
  Guardian Regulations 2007 (SI 2007/1253).
- Mental Capacity Act 2005 Code of Practice (TSO 2007).
- Powers of Attorney Act 2023.
- Office of the Public Guardian — LP1F (10/25), LP12 (08/25), LP3, LPC,
  LPA120A.

## Compliance

- UK GDPR 2018 — personal-data handling, OPG 20-year retention.
- ISO/IEC/IEEE 26514:2022 — design and development of information for
  users.
- WCAG 2.2 AA — accessibility (donors often have early cognitive decline).
- NCSC Cyber Essentials.
- Welsh Language Act 1993 — Welsh correspondence option in section 13.

## Verify

```sh
bin/test-form united-kingdom-lasting-power-of-attorney-for-financial-decisions
```
