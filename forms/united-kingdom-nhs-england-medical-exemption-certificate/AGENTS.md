# UK NHS England Medical Exemption Certificate (FP92A) — Agent Instructions

UK NHSBSA medical exemption application. Captures the FP92A data set across a
**10-step single-page wizard**, evaluates eligibility against the closed list of
**10 qualifying conditions**, and produces a signed PDF preview matching the
paper FP92A — for the practitioner to print, sign in ink, and post to NHSBSA
Bridge House (the NHSBSA does not accept scans, photocopies, or printouts).

See [`index.md`](./index.md) for the full form design and the 10-step wizard
table.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical and regulatory reference notes
- `./sql-migrations/` — Liquibase Postgres schema (canonical data model)
- `./xml-representations/` — generated XML + DTD per SQL table
- `./fhir-r5/` — generated FHIR HL7 R5 JSON resources
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./typespec/` — TypeSpec models for API-first integration
- `./front-end-form-with-html/` — static single-page HTML wizard
- `./front-end-form-with-svelte/` — SvelteKit single-page wizard
- `./front-end-dashboard-with-html/` — static HTML review table
- `./front-end-dashboard-with-svelte/` — SvelteKit + SVAR DataGrid dashboard
- `./back-end-with-loco/` — Rust axum + Tera + HTMX + Alpine.js
- `./back-end-with-loco-setup` — scaffold shell script

## Grading / eligibility engine

- **Input shape:** `Fp92aApplication` TypeScript type with practitioner,
  patient, qualifying-conditions, and declaration sub-types.
- **Output shape:**
  ```ts
  evaluateFp92a(data: Fp92aApplication): {
    outcome: 'eligible' | 'ineligible' | 'requires-clarification';
    eligibleConditions: EligibleConditionCode[];
    firedRules: FiredRule[];
    additionalFlags: AdditionalFlag[];
    validFrom: string;   // ISO date
    validUntil: string;  // ISO date (validFrom + 5 years)
    redirectTo: '' | 'FW8' | 'age-exemption' | 'low-income-scheme';
  }
  ```
- **Algorithm:** declarative rule pass — each qualifying condition either
  matches or does not; the outcome is `eligible` if any condition matches and
  no disqualifying flag fires; `ineligible` if none match or only excluded
  variants are declared; `requires-clarification` for ambiguous cases
  (e.g. cancer awaiting histology, disability without home-care attestation).

### Eligible condition codes

| Code | Label |
| --- | --- |
| `permanent-fistula` | Permanent fistula requiring continuous surgical dressing or appliance |
| `hypoadrenalism` | Hypoadrenalism (e.g. Addison's disease) on substitution therapy |
| `diabetes-insipidus-or-hypopituitarism` | Diabetes insipidus / hypopituitarism |
| `diabetes-mellitus-not-diet-only` | Diabetes mellitus (insulin / oral hypoglycaemic) |
| `hypoparathyroidism` | Hypoparathyroidism |
| `myasthenia-gravis` | Myasthenia gravis |
| `myxoedema` | Myxoedema requiring thyroid hormone replacement |
| `epilepsy-on-anticonvulsant` | Epilepsy on continuous anticonvulsant |
| `continuing-physical-disability` | Disability — cannot leave home unaided |
| `cancer-or-effects` | Undergoing cancer treatment, or effects of cancer / treatment |

### Disqualifying / redirecting rules

- **Diet-only diabetes** — `outcome = ineligible`, advise lifestyle support.
- **Temporary disability** — `outcome = ineligible`, exclude broken leg etc.
- **Pregnant or within 12 months post-partum** — `redirectTo = 'FW8'`.
- **Age >= 60** or **age < 16** or **16-18 in full-time education** —
  `redirectTo = 'age-exemption'`.
- **No practitioner signature** — `additionalFlags += 'missing-signature'`.
- **No NHS number** — `additionalFlags += 'missing-nhs-number'`.
- **Active certificate already on file** — `additionalFlags += 'active-certificate-exists'`.

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric fields.
- camelCase property names in TypeScript.
- snake_case in SQL and Rust.
- Step components named `StepNName.svelte` (1-indexed).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys; `created_at` + `updated_at` + `deleted_at` timestamps
  on every table.

## Front-end SvelteKit stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`)
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`
- `pdfmake` for client-side PDF preview matching the FP92A paper layout
- Vitest for engine unit tests
- Dynamic step route `/application/[step=step]/+page.svelte` with the `step`
  param matcher validating 1-10.

## Dashboard stack

- SvelteKit + SVAR DataGrid (`@svar-ui/svelte-grid`) with the Willow theme.
- Sortable columns, dropdown filters (eligibility outcome, condition,
  certificate status).
- Backend API client with sample-data fallback for standalone development.

## Backend stack

- Rust edition 2024
- Loco 0.16 framework conventions on axum 0.8
- SeaORM 1.1 with PostgreSQL
- Tera templates with HTMX 2.0.8 and Alpine.js 3.14.8
- `serde(rename_all = "camelCase")` for front-end interop

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — Class I.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form united-kingdom-nhs-england-medical-exemption-certificate
```
