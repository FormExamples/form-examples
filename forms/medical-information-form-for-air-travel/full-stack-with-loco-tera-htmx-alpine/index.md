# Full-stack with Loco / Tera / HTMX / Alpine — Medical Information Form for Air Travel

Rust backend and server-rendered front-end for the airline **MEDIF**
single-page wizard. The application targets Loco 0.16 (axum 0.8) with
PostgreSQL via SeaORM, Tera templates, HTMX for partial reloads, and
Alpine.js for client-side state.

## Overview

A passenger, accessible-travel agent, family member, or the attending
physician completes a 14-step single-page wizard. The backend persists the
submission, runs the fitness-to-fly grading engine, and renders a server-side
report for the airline medical desk.

The 14 wizard steps map to the form's `sql-migrations/`:

| # | Step | Backing table or column group |
| - | ---- | ----------------------------- |
| 1 | Submitting agent | `submitter_*` columns |
| 2 | Passenger identity | `patient` |
| 3 | Trip details | `airline_*`, `outbound_*`, `return_*` |
| 4 | Reason for MEDIF | `reason_*` flags |
| 5 | Attending physician | `clinician` |
| 6 | Diagnosis | `primary_diagnosis`, `icd10_codes`, dates |
| 7 | Cardiovascular | `resting_*`, `nyha_class`, ... |
| 8 | Respiratory | `resting_spo2_percent`, `asthma_severity`, ... |
| 9 | Recent events and surgery | `last_surgery_*`, `cabin_gas_risk`, ... |
| 10 | Pregnancy | `is_pregnant`, `gestation_weeks`, ... |
| 11 | Communicable disease | `communicable_disease_status`, ... |
| 12 | In-flight requirements | `requires_*`, `oxygen_*`, `wheelchair_type` |
| 13 | Cabin medications and equipment | `regular_medications`, `controlled_drugs`, ... |
| 14 | Sign-off | `physician_*`, `valid_until_date` |

## Architecture

```
   Browser  <--- HTMX hx-boost --->   axum HTTP server
                                     |
                                     |  Tera render
                                     v
                              templates/*.html.tera
                                     |
                                     v
                              SeaORM (PostgreSQL)
```

## Grading engine

The engine mirrors the TypeScript engine in
`front-end-form-with-svelte/src/lib/engine/`:

- Cardiorespiratory rules (NYHA, SpO2, unstable angina)
- Recent-event rules (MI, pneumothorax, surgery, gas in body cavities)
- Pregnancy rules (singleton > 36 w → unfit; 28–36 w → review)
- Communicable disease rules (infectious-period → unfit)
- Equipment rules (high-flow oxygen, stretcher, incubator, battery devices)
- Composite max-grade aggregator

The fitness-to-fly bands are: `fit`, `fit-with-conditions`,
`requires-review`, `unfit-to-fly`.

## Build

```sh
cd medical_information_form_for_air_travel
cargo build
```

## Run

```sh
cd medical_information_form_for_air_travel
cargo run --bin medical_information_form_for_air_travel
```

## Test

```sh
bin/test-form medical-information-form-for-air-travel
```

## Compliance

- IATA *Medical Manual* (13th ed.)
- IATA *Dangerous Goods Regulations*
- Aerospace Medical Association *Medical Guidelines for Airline Travel*
- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — Class I
- UK Medical Devices Regulations 2002
- ISO/IEC/IEEE 26514:2022
