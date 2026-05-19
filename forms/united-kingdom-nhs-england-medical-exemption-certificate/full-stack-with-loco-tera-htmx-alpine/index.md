# Full-Stack with Loco / Tera / HTMX / Alpine — UK NHS FP92A

Rust full-stack implementation of the **FP92A Medical Exemption Certificate**
application, presented as a 10-step single-page wizard. The current crate is
a minimal **axum + Tera + HTMX + Alpine.js** server with an in-memory store.

## Stack

- **axum 0.8** — HTTP router and handlers
- **tokio 1.45** — async runtime (multi-thread + macros)
- **tera 1.20** — server-rendered HTML templates
- **HTMX 2.0.8** — progressive enhancement, boosted navigation
- **Alpine.js 3.14.8** — wizard step state and conditional `x-show` panels
- **serde + serde_json** — camelCase-compatible JSON
- **uuid 1.6** + **chrono 0.4** — IDs and date handling
- **tracing 0.1** + **tracing-subscriber 0.3** — structured logs

## Pages

- `/` — landing page describing the FP92A and its 10 qualifying conditions.
- `/application/{id}` — single-page wizard (10 steps via Alpine `x-show`).
- `/application/{id}/report` — eligibility outcome, fired rules, advisory flags, printable summary.

## 10-step wizard

1. Practitioner identification
2. Patient identification
3. Existing exemption check
4. Age-based exclusion check
5. Pregnancy / maternity check
6. Qualifying condition selection (10 NHSBSA codes)
7. Qualifying condition detail (diagnosis, treatment, ICD-10 / SNOMED)
8. Disability / appliance attestation
9. Practitioner declaration
10. Summary, eligibility result and sign-off

## Engine

Pure-function eligibility engine
(`src/engine/fp92a_validator.rs`) — no database, no network — returning a
`GradeResult` with outcome, redirect target, fired rules, advisory flags,
eligible condition codes, and a 5-year validity window.

## Compliance

- NHSBSA prescription charges and exemptions
- The National Health Service (Charges for Drugs and Appliances) Regulations 2015
- MDCG 2019-11 Rev.1 — Class I
- UK Medical Devices Regulations 2002
- ISO/IEC/IEEE 26514:2022
- UK MHRA *Software and AI as a Medical Device*

## Run

```sh
cargo run
```

## Verify

```sh
bin/test-form united-kingdom-nhs-england-medical-exemption-certificate
```
