# United Kingdom Vehicle Registration Application — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `united-kingdom-vehicle-registration-application`

## 1. Purpose

Registering a vehicle with the Driver and Vehicle Licensing Agency (DVLA) in
Great Britain. The form prepares one of six applications and checks it before it
is posted:

| `applicationType` | DVLA form | Used when |
| --- | --- | --- |
| `v62-replacement-v5c` | V62 | The V5C registration certificate (log book) is lost, stolen, destroyed, damaged, or not received |
| `v62-acquired-without-v5c` | V62 | A vehicle was acquired without a V5C |
| `v55-4-new-vehicle` | V55/4 | First registration of a new vehicle, including a new import and a newly built kit car |
| `v55-5-used-vehicle` | V55/5 | First registration of a used vehicle, including a used import or one brought back after export |
| `imported-vehicle` | V55/4 or V55/5 | An import (adds HMRC NOVA, approval and customs evidence) |
| `v627-1-rebuilt-or-kit` | V627/1 | A rebuilt or kit vehicle (adds build evidence) |

Its engine is a **completeness and validity** engine, not a clinical score: it
classifies the application as **Ready to submit**, **Incomplete**, or **Needs
supporting documents**, works out the fee the DVLA requires, and raises flagged
issues. It does **not** decide the application: only the DVLA decides whether a
vehicle is registered, and the DVLA may inspect the vehicle.

Related forms already in this repository concern driver medical declarations
([B1](../united-kingdom-driver-and-vehicle-licensing-agency-b1-form/),
[M1](../united-kingdom-driver-and-vehicle-licensing-agency-m1-form/),
[V1](../united-kingdom-driver-and-vehicle-licensing-agency-v1-form/)). This form
is about the *vehicle* and shares nothing with them beyond the agency.

Full design description: [`index.md`](../index.md). Source research and the
assumptions the engine makes: [`doc/index.md`](../doc/index.md).

## 2. Scope

In scope: the schema, validation engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Axum JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: submitting to the DVLA (the application is posted on paper; the V62 is
print-only), payment processing, vehicle look-ups (DVLA Vehicle Enquiry Service,
MOT history, Motor Insurance Database), Northern Ireland registration (DVA, a
separate agency), commercial secure-registration schemes, personalized
registration transfers, and hosted deployment.

## 3. Data model

camelCase in TypeScript / JSON, snake_case in SQL. `''` for unanswered text and
enum fields; `null` for unanswered numeric, date, and time fields. The SQL
source of truth is [`sql/`](../sql/); the main table is
`united_kingdom_vehicle_registration_application`, with `applicant` and `keeper`
parents and the `_grade`, `_grade_rule`, `_grade_flag` children.

### 3.1 Application (step 1)

| Field | Type | Notes |
| --- | --- | --- |
| `applicationType` | enum | the six values above |
| `applicationDate` | date | the reference date for every age rule, so the engine never reads the wall clock |
| `v5cStatus` | enum | `lost`, `stolen`, `destroyed`, `not-received`, `damaged`, `never-had`, `has-v5c` |
| `weeksSinceChangeOfKeeper` | integer | for `not-received`; 6-week window |
| `newKeeperSlipProvided` | yes/no | the green new-keeper slip from the most recent V5C |

### 3.2 Applicant (step 2, table `applicant`)

`name`, `birthDate`, `email`, `phone`, `postalAddressAsFullText`, `postcode`,
`drivingLicenceNumber`, `identityDocumentType` (`photocard-driving-licence`,
`passport`, `other-name-document`, `none`), `addressDocumentType`
(`photocard-driving-licence`, `utility-bill`, `bank-statement`,
`council-tax-bill`, `none`).

### 3.3 Keeper and owner (step 3, table `keeper`)

`keeperName`, `keeperType` (`individual`, `company`, `organization`, `trade`,
`other`), `companyRegistrationNumber`, `ownerDiffersFromKeeper`, `ownerName`,
`keeperAddressInNorthernIreland`. The registered keeper is the person responsible
for taxing, insuring, and using the vehicle; the V5C is not proof of ownership,
so the owner may be recorded separately.

### 3.4 Vehicle (step 4)

`registrationNumber`, `vehicleIdentificationNumber`, `engineNumber`, `make`,
`model`, `colour`, `vehicleCategory`, `fuelType`, `engineCapacityAsCc`,
`dateOfManufacture`, `dateFirstUsed`, `seriouslyDamaged`.

### 3.5 Evidence (step 5)

`certificateOfNewnessProvided`, `typeApproval` (`ecwvta`, `gb-type-approval`,
`ni-type-approval`, `iva`, `msva`, `exempt-over-10-years`, `none`), `motStatus`
(`valid`, `not-required`, `missing`), `insuranceStatus` (`in-force`, `none`),
`buildEvidenceProvided`, `donorVehicleCount`.

### 3.6 Import details (step 6)

`countryOfExport`, `importDate`, `novaStatus` (`notified`, `not-notified`,
`not-applicable`), `novaReference`.

### 3.7 Fee and declaration (step 7)

`feePaymentMethod` (`cheque`, `postal-order`, `post-office-card`,
`online-card`, `none`), `feePaidAsPence`, `declarationSigned`,
`declarationDate`, `applicantNote`.

Step 8 is a read-only summary: the live validity class, fee due, and missing
count.

## 4. Validity algorithm

Pure functions, no I/O. The reference date is `applicationDate`; vehicle age is
whole years from `dateOfManufacture` (else `dateFirstUsed`) to it.

```text
# Fee due, in pence (null until applicationType is chosen)
v62-replacement-v5c        -> 2500, except v5cStatus = not-received AND weeks <= 6 -> 0
v62-acquired-without-v5c   -> 0 when newKeeperSlipProvided = yes, else 2500
every first registration   -> 5500

# Data items (any one makes the application `incomplete`)
type, date, applicant name / date of birth / address + postcode, keeper name and
type, company number for a company keeper, owner name when the owner differs,
make, model; for a V62 the registration number; for a first registration the VIN,
engine number, and a manufacture or first-use date; for an import the country of
export and arrival date; v5cStatus for a V62 replacement; a signed declaration;
vehicle not seriously damaged; registration number and VIN well-formed.

# Documents and payment (any one, with no data item missing, makes the application
# `needs-supporting-documents`)
identity       required for a first registration and a V62 for a vehicle acquired
               without a V5C: a photocard licence, or a passport or other name
               document plus a proof of address
newness        V55/4: certificate of newness
type approval  first registration, vehicle under 10 years old: not `none`
MOT            first registration except V55/4, vehicle over 3 years old
               (over 4 in Northern Ireland): `valid` or `not-required`
insurance      first registration to a Northern Ireland address: `in-force`
build evidence V627/1: buildEvidenceProvided = yes
NOVA           imported vehicle: novaStatus = notified, with a reference
fee            feeDue > 0: a payment method and an amount equal to feeDue
```

Classification, first match wins:

```text
any data item missing       -> incomplete
any document or fee missing -> needs-supporting-documents
otherwise                   -> ready-to-submit
```

`incomplete` takes precedence: finish the form before gathering the evidence.

Format checks:

```text
VIN        17 characters of [A-HJ-NPR-Z0-9] (ISO 3779: no I, O, Q); a vehicle made
           before 1981-01-01 may have 5 to 17 letters and digits
registration (spaces ignored, upper case)
           [A-Z]{2}[0-9]{2}[A-Z]{3}  current      AB12 CDE
           [A-Z][0-9]{1,3}[A-Z]{3}   prefix       A123 BCD
           [A-Z]{3}[0-9]{1,3}[A-Z]   suffix       ABC 123D
           [A-Z]{1,3}[0-9]{1,4} or [0-9]{1,4}[A-Z]{1,3}   dateless
```

The engine returns `{ validityClass, feeDueAsPence, missingItemCount, rules[] }`
and the flag detector returns `flaggedIssues[]`. The HTML engine keeps them
separate (a split engine, pinned by `examples/personas.json`); the Svelte engine
returns them together.

## 5. Flagged issues

Raised independently of the validity class. Each flag has an id, a category, a
priority, a description, and a suggested action, and is stored in the
`_grade_flag` table.

| Category | Priority | Fires when |
| --- | --- | --- |
| `seriously-damaged` | high | the vehicle cannot be repaired; it cannot be registered |
| `identity-evidence-missing` | high | identity is required and not satisfied |
| `type-approval-missing` | high | approval is required and `none` / blank |
| `mot-missing` | high | MOT is required and not `valid` / `not-required` |
| `insurance-missing` | high | Northern Ireland address without `in-force` insurance |
| `insurance-missing` | low | `insuranceStatus = none` elsewhere (insure before driving) |
| `nova-missing` | high | an import whose `novaStatus` is not `notified` |
| `fee-incorrect` | high | a fee is due and no payment, or a different amount, is recorded |
| `fee-incorrect` | low | no fee is due but a payment is recorded |
| `declaration-unsigned` | high | the declaration is not signed |
| `entitlement-missing` | medium | V627/1 without build evidence; V62 without a new-keeper slip |
| `keeper-owner-mismatch` | medium | `ownerDiffersFromKeeper = yes` |
| `vin-invalid` | medium | the VIN fails the format check |
| `registration-number-invalid` | medium | the registration number fails the format check |
| `v5c-lost-stolen-destroyed` | low | a V62 replacement for a lost, stolen, or destroyed V5C |

## 6. Inputs and outputs

Input: one `VehicleApplication` object (seven sections). Output of the HTML
`validateApplication`: `{ validityClass, feeDueAsPence, missingItemCount, rules }`;
of `detectFlaggedIssues`: `FlaggedIssue[]`. The Svelte `validateApplication`
adds `flaggedIssues` and `timestamp`. Import and export via JSON, XML, CSV, and
TSV. The report shows the validity class, the fee, the findings table, and the
flags.

## 7. Artefacts

| Subdirectory | Role |
| --- | --- |
| `sql` | source of truth |
| `xml` | generated |
| `fhir` | generated |
| `protobuf` | generated |
| `openapi` | generated |
| `front-end-with-html` | HTML + Lily (wizard + dashboard) |
| `front-end-with-svelte` | SvelteKit (wizard + dashboard) |
| `back-end-with-axum` | Rust + Axum JSON API |
| `back-end-with-axum-setup` | generated scaffold script |

Generated artefacts are never hand-edited; re-run the generators in
[`/AGENTS.md`](../../../AGENTS.md) §Tools after schema changes.

## 8. Acceptance criteria

- `bin/test-form united-kingdom-vehicle-registration-application` exits cleanly.
- The validation engine is pure (no side effects, no I/O, no wall clock) and
  unit-tested, covering each validity class, every fee rule, the VIN and
  registration-number formats, the MOT age thresholds (3 years, and 4 in
  Northern Ireland), NOVA for imports, and the `incomplete` precedence.
- `examples/personas.json` has at least one persona for each validity class and
  for each flag category, verified by `bin/test-personas`.
- The HTML front-end conforms to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-end conforms to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)) and
  passes `pnpm check`, `pnpm test`, lint, and format.
- The Rust crate builds and `cargo test` passes against a scratch Postgres, and
  every `bin/axum-*` `--check` tool reports it clean.

## 9. Compliance

This is an administrative, non-clinical form. It is not a medical device: it
supports completing a vehicle-registration application and makes no clinical
decision. The monorepo baseline (ISO/IEC/IEEE 26514:2022 information for users)
applies; the medical-device baselines (MDCG 2019-11, UK Medical Devices
Regulations 2002) are not engaged because there is no medical purpose. The
governing law is the Vehicle Excise and Registration Act 1994 and the Road
Vehicles (Registration and Licensing) Regulations 2002; the DVLA decides every
application and rules and fees can change.

## 10. References

- [GOV.UK — Register a vehicle: new registrations](https://www.gov.uk/vehicle-registration/new-registrations) (V55/4, V55/5, £55 fee, identity, approval, MOT)
- [GOV.UK — New and used vehicles](https://www.gov.uk/vehicle-registration/new-and-used-vehicles) (V62 with no V5C, new-keeper slip, £25)
- [GOV.UK — Get a vehicle log book (V5C) if you cannot apply online](https://www.gov.uk/vehicle-log-book/if-you-cannot-apply-online) (V62 by post, £25, cheque or postal order to DVLA, Swansea)
- [GOV.UK — Old vehicles](https://www.gov.uk/vehicle-registration/old-vehicles)
- [GOV.UK — Importing vehicles into the UK](https://www.gov.uk/importing-vehicles-into-the-uk) (NOVA, 14 days, vehicle approval)
- [GOV.UK — Application for a vehicle registration certificate (V62)](https://www.gov.uk/government/publications/application-for-a-vehicle-registration-certificate)
- [DVLA — V62 form](https://assets.publishing.service.gov.uk/media/663371944d8bb7378fb6c126/v62-application-for-a-registration-certificate.pdf)
- [DVLA — V355/5 guide to filling in the application for first vehicle tax and registration of a used motor vehicle](https://assets.publishing.service.gov.uk/media/657063f9809bc3000d308158/v355-5-guide-to-filling-application-for-first-vehicle-tax-and-registration-of-used-motor-vehicle.pdf)
- [Vehicle Excise and Registration Act 1994](https://www.legislation.gov.uk/ukpga/1994/22/contents)
- [Road Vehicles (Registration and Licensing) Regulations 2002](https://www.legislation.gov.uk/uksi/2002/2742/contents)

- [`index.md`](../index.md) — form description and validity model
- [`doc/index.md`](../doc/index.md) — research notes and assumptions
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form united-kingdom-vehicle-registration-application
bin/test-personas united-kingdom-vehicle-registration-application
bin/test-engines united-kingdom-vehicle-registration-application
bin/test-examples-conformance united-kingdom-vehicle-registration-application
bin/test-e2e --html united-kingdom-vehicle-registration-application
```
