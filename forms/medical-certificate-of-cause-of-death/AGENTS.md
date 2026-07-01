# Medical Certificate of Cause of Death (MCCD) — Agent Instructions

A UK statutory documentation instrument for recording the cause of death of a
person for death registration. Collects the deceased's details, the date and
place of death, the Part I direct causal sequence (I(a) → I(b) → I(c)), the
Part II contributory conditions with onset-to-death intervals, and the coroner /
medical-examiner referral status via a single continuous single-page wizard.
The engine is a **completeness and validity-classification** engine — not a
numeric score: it classifies the certificate as **Valid**, **Incomplete**, or
**Refer to coroner**, and raises flagged issues.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical / statutory reference documentation (ONS MCCD guidance,
  Coroners and Justice Act 2009, medical-examiner system)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Validation engine

- **Input shape:** `DeathCertificate` TypeScript type — the certification
  context, deceased identification, death details, Part I causal sequence,
  Part II contributory conditions, and referral / scrutiny fields.
- **Output shape:**
  ```ts
  validateCertificate(data: DeathCertificate): {
    validityClass: 'valid' | 'incomplete' | 'refer-to-coroner';
    underlyingCause: string;            // '' when Part I empty
    coronerReferralIndicated: boolean;
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** classification, not additive. Precedence: a met coroner-referral
  criterion → `refer-to-coroner`; else a missing I(a) or an unacceptable sole
  "mode of death" → `incomplete`; else `valid`. The underlying cause is the
  lowest completed Part I line (I(c) else I(b) else I(a)). See spec §4.
- **Engine files:** `types.ts`, `utils.ts`, `validation-rules.ts`,
  `certificate-validator.ts`, `flagged-issues.ts`.
  - `validation-rules.ts` — the coroner-referral criteria set, the
    unacceptable-mode-of-death list, and the sequence-ordering predicate.
  - `certificate-validator.ts` — assigns the single `validityClass` and derives
    `underlyingCause` and `coronerReferralIndicated`.
  - `flagged-issues.ts` — computes the flag list independently of the class.
- **Tests:** `certificate-validator.test.ts`, `validation-rules.test.ts` —
  cover each validity class, coroner-referral precedence over completeness, the
  unacceptable-sole-cause set (e.g. "cardiac arrest", "old age"), the
  illogical-sequence cases, and the always-on medical-examiner scrutiny flag for
  non-referred certificates.

## Validity classes

- **Valid** — complete, Part I present and logically ordered, acceptable cause,
  no unmet coroner-referral criterion. Ready for medical-examiner scrutiny and
  registration.
- **Incomplete** — completable by the same doctor but missing required content
  (no I(a), missing interval, missing certifier details) or carrying an
  unacceptable sole cause.
- **Refer to coroner** — a coroner-referral criterion is met; the MCCD should
  not be issued until the coroner has considered the case.

## Flagged issues

Computed independently of the class (see spec §5): coroner referral required
(high), unacceptable sole cause (high), missing Part I(a) (high), illogical
sequence (medium), medical-examiner scrutiny required (medium; always raised for
a non-referred certificate), missing interval (low), incomplete certifier
details (low).

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde.
- snake_case in SQL and Rust internals.
- Step components named `StepNName.svelte` (1-indexed).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys via `gen_random_uuid()`.
- `created_at`, `updated_at`, `deleted_at` timestamps on every table.
- Import and export via JSON, XML, CSV, and TSV.
- Generated artefacts (XML, FHIR, protobuf, OpenAPI, Loco setup) are never
  hand-edited.

## Clinical and statutory grounding

- Office for National Statistics. *Guidance for doctors completing Medical
  Certificates of Cause of Death in England and Wales.*
- Births and Deaths Registration Act 1953.
- Coroners and Justice Act 2009; Coroners (Investigations) Regulations 2013.
- The statutory NHS medical-examiner system (mandatory scrutiny of
  non-coroner deaths before registration).
- World Health Organization. *ICD*, rules for selecting the underlying cause of
  death.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification) — documentation /
  completeness-checking instrument; supports certification and registration
  workflow rather than diagnosis or treatment.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

This form is a documentation aid only. It does not discharge any statutory duty
of the certifying doctor, coroner, or medical examiner.

## Verify

```sh
bin/test-form medical-certificate-of-cause-of-death
```
