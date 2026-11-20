# United Kingdom death registration (England and Wales)

Registering a death in England and Wales after a doctor has completed the medical
certificate of cause of death (MCCD): the 5-day deadline, the qualified informant,
medical examiner confirmation, coroner involvement, the certificate for burial or
cremation, Tell Us Once, and ordering certified copies of the death certificate. A
single continuous single-page wizard checks whether the death is **ready to
register** and raises flagged issues.

This is the family-side and registrar-side process. The doctor-completed certificate
is a separate form,
[`medical-certificate-of-cause-of-death`](../medical-certificate-of-cause-of-death/index.md),
and its content is not repeated here.

See [`spec/index.md`](./spec/index.md) for the living domain spec and
[`doc/index.md`](./doc/index.md) for the sources.

## Scope and intended users

Intended for the bereaved family member (the informant), funeral directors, and
register-office or bereavement-office staff planning a registration. It is a
readiness check: it does not register a death, it is not legal advice, and the
registrar decides whether a death can be registered. It covers deaths in England and
Wales only.

## Sections and classification model

The engine is a **completeness and validity** engine, not a numeric score. It assigns
exactly one registration class:

| Class | Meaning |
| --- | --- |
| **Ready to register** | confirmed (or released by the coroner), qualified informant, not yet registered |
| **Incomplete** | a blocking rule fires (missing MCCD, no medical examiner confirmation, unqualified informant, outside England and Wales, ...) |
| **Referred to coroner - pending** | reported to a coroner and the coroner's certificate has not arrived; the 5-day clock is paused |
| **Registered** | a registration date is recorded and nothing blocks it |

It also derives the 5-day deadline status (`not-started`, `paused-coroner`,
`on-track`, `due-soon`, `overdue`, `registered`, `registered-late`) and raises 18
flags (deadline, jurisdiction, MCCD, medical examiner, coroner, informant, green form,
Tell Us Once, appointment, documents, copies). The tables are in
[`spec/index.md`](./spec/index.md).

## Registration steps

| Step | Section | What is captured |
| --- | --- | --- |
| 1 | Deceased | name, sex, dates, place and jurisdiction of death, whether particulars are known |
| 2 | Medical examiner | MCCD received, medical examiner status, confirmation date (starts the 5-day clock) |
| 3 | Coroner | reported or not, stage, coroner's certificate received |
| 4 | Informant | name, basis on which they qualify, address |
| 5 | Appointment | register office, appointment, documents, registration date, assessment date |
| 6 | After registration | burial or cremation, green form, Tell Us Once, copies and how to order them |
| 7 | Summary | the live class and deadline status; submit for the report |

## Real-world rules in brief (GOV.UK)

- Register within **5 days** of the medical examiner's confirmation (8 days in
  Scotland); weekends and bank holidays count. Tell the register office immediately if
  more time is needed.
- Wait for the medical examiner's office to confirm the death can be registered.
- Only a **qualified informant** can register (section 16, Births and Deaths
  Registration Act 1953).
- If the death is reported to a coroner, registration waits for the coroner's
  certificate (form CN2 when there is no inquest, or the certificate after an
  inquest); an interim certificate can be requested for proof of death.
- After registering, the registrar issues the certificate for burial or cremation
  (the green form) for the funeral director, and the Tell Us Once reference.
- Copies of the death certificate: GBP 12.50 each online from the General Register
  Office (about 4 days; priority service GBP 38.50, next working day when ordered
  by 4pm); without a GRO index reference add GBP 3.50 per search and expect about
  15 working days.

## Conventions

- Empty string `''` for unanswered text / enum fields; `null` for unanswered numeric
  and date fields.
- camelCase in JavaScript and TypeScript, snake_case in SQL and Rust internals.
- UUIDv4 primary keys; `created_at`, `updated_at`, `deleted_at` on every table.
- One continuous single-page wizard; no multi-page forms.
- Generated artefacts are never hand-edited.

## Compliance

- MDCG 2019-11 Rev.1; UK Medical Devices Regulations 2002; ISO/IEC/IEEE 26514:2022;
  UK MHRA Software and AI as a Medical Device. Administrative readiness checker; no
  clinical function.

## References

- [GOV.UK: Register a death](https://www.gov.uk/register-a-death)
- [GOV.UK: Register the death](https://www.gov.uk/after-a-death/register-the-death)
- [GOV.UK: When a death is reported to a coroner](https://www.gov.uk/after-a-death/when-a-death-is-reported-to-a-coroner)
- [GOV.UK: Order a copy of a certificate](https://www.gov.uk/order-copy-birth-death-marriage-certificate)
- [GOV.UK: Tell Us Once](https://www.gov.uk/tell-us-once)

## Verify

```sh
bin/test-form united-kingdom-death-registration
bin/test-personas united-kingdom-death-registration
```
