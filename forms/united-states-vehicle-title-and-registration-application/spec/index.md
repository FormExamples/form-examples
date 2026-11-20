# United States Vehicle Title and Registration Application — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `united-states-vehicle-title-and-registration-application`

## 1. Purpose

A documentation instrument that prepares an application for a **certificate of
title and registration** with a United States state motor vehicle agency. It
captures the application (state, transaction, acquisition), the owner
identification, the vehicle and its VIN, the federal odometer disclosure, the
title history and brands, any lien, insurance and inspections, and the fees and
tax. Its engine is a **completeness, validity, and eligibility** engine, not a
numeric score: it classifies the application as **Ready to submit**,
**Incomplete**, or **Title brand or lien issue**, and raises prioritized flagged
issues. It is documentation support, not legal advice; the issuing state agency
decides whether to issue a title.

Full design description: [`index.md`](../index.md). Sources: [`doc/index.md`](../doc/index.md).

## 2. Scope

In scope: the schema, the classification engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Axum JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, commercial carrier
credentials (IRP, IFTA, USDOT), boats and off-highway vehicles, fee arithmetic
(fees change every legislative session), and any legal determination of
ownership.

## 3. Data model

The input is a `TitleApplication` object with eight sections. Unanswered text and
enum fields are `''`; unanswered numeric, date, and time fields are `null`.
Property names are camelCase; SQL columns are snake_case. SQL tables (see
[`sql/`](../sql/index.md)): `applicant` (the owner party), `lienholder`,
`vehicle_title_application` (the application, with the flat fields below),
`vehicle_title_application_grade` (1:1 result), `..._grade_rule` (audit trail),
`..._grade_flag` (flagged issues).

| Section | Fields |
| --- | --- |
| `application` | `state` (2-letter), `transactionType` (`title-and-registration` / `title-only` / `registration-only`), `vehicleCondition` (`new` / `used`), `acquisitionMethod` (`dealer-purchase` / `private-purchase` / `gift` / `inheritance` / `other`), `outOfStateTransfer` (yes/no), `previousState`, `acquisitionDate`, `applicationDate` |
| `owner` | `ownerType` (`individual` / `business`), `ownerName`, `coOwnerName`, `coOwnerConjunction` (`and` / `or`), `identificationType` (`drivers-license` / `state-id` / `passport` / `fein` / `other`), `identificationNumber`, `mailingAddress`, `ownerSigned`, `coOwnerSigned` |
| `vehicle` | `vin`, `modelYear`, `make`, `model`, `bodyType`, `vehicleClass` (`passenger` / `light-truck` / `heavy-truck` / `motorcycle` / `trailer` / `motorhome`), `fuelType` (`gasoline` / `diesel` / `electric` / `hybrid` / `other`), `gvwrLbs`, `color` |
| `odometer` | `odometerReading`, `odometerStatus` (`actual` / `exceeds-mechanical-limits` / `not-actual`), `sellerOdometerStatement`, `buyerOdometerAcknowledged` |
| `titleHistory` | `titleDocument` (`state-title` / `out-of-state-title` / `manufacturer-statement-of-origin` / `none`), `priorTitleSurrendered`, `titleBrand` (`none` / `salvage` / `junk` / `rebuilt` / `flood` / `odometer-not-actual` / `lemon-law-buyback` / `hail` / `other`), `brandDisclosed`, `nmvtisCheck` (`clear` / `brand-or-theft-found` / `not-checked`), `brandInspection` (`passed` / `not-done` / `not-applicable`) |
| `lien` | `lienStatus` (`none` / `new-lien` / `existing-lien-released` / `existing-lien-unreleased`), `lienholderName`, `lienElectronic` |
| `compliance` | `insuranceProof` (`provided` / `not-provided`), `insuranceExpiryDate`, `emissionsInspection`, `safetyInspection` (`passed` / `not-done` / `exempt` / `not-required`), `vinVerification` (`done` / `not-done` / `not-required`) |
| `feesTax` | `purchasePriceUsd`, `salesTaxStatus` (`paid-to-dealer` / `due-at-title` / `exempt` / `not-calculated`), `salesTaxRatePercent`, `salesTaxAmountUsd`, `taxExemptionReason`, `titleFeeUsd`, `registrationFeeUsd`, `feesTendered`, `applicantNote` |

`yes/no` fields are `'yes'`, `'no'`, or `''`.

## 4. Classification algorithm

Pure functions in `rules.js` / `grader.js` (HTML) and `engine/` (SvelteKit), with
identical behaviour.

```text
titleBrandOrLienIssue = brandPresent || nmvtisAlert || lienUnreleased || odometerNotActual
applicationClass =
  titleBrandOrLienIssue          -> 'title-brand-or-lien-issue'
  outstandingItems(a).length > 0 -> 'incomplete'
  otherwise                      -> 'ready-to-submit'
```

Definitions:

- **brandPresent:** `titleBrand` is one of `salvage`, `junk`, `rebuilt`, `flood`,
  `odometer-not-actual`, `lemon-law-buyback`, `hail`, `other`.
- **nmvtisAlert:** `nmvtisCheck = brand-or-theft-found`.
- **lienUnreleased:** `lienStatus = existing-lien-unreleased`.
- **odometerNotActual:** a disclosure is required and `odometerStatus = not-actual`.

### 4.1 VIN (49 CFR 565.15)

`vinStatus` is `''` (empty), `not-standardized` (model year 1980 or earlier),
`invalid-length` (not 17), `invalid-characters` (I, O, Q, or a non-alphanumeric
character), `check-digit-mismatch`, or `valid`. The check digit is the
transliterated, weighted sum of positions modulo 11 (`X` for 10); weights
`8 7 6 5 4 3 2 10 0 9 8 7 6 5 4 3 2`. A VIN is **acceptable** when `valid` or
`not-standardized`. Position 10 must equal the model-year code for the stated
year when the VIN is valid (1980-2039); a mismatch raises F-VIN-003.

### 4.2 Odometer (49 CFR 580.17)

A disclosure is **required** unless exempt: GVWR over 16,000 pounds; model year
2010 or earlier and `transferYear - modelYear >= 10`; or model year 2011 or later
and `transferYear - modelYear >= 20`, where `transferYear` is the year of the
acquisition date, else of the application date. A new vehicle is not exempt at
retail sale.

### 4.3 State rules

`STATE_RULES` holds, per state: `titleDeadlineDays` (null when none is
published), `salesTaxBasePercent` (state level, no local add-ons), `inspection`
regime, `insuranceAtRegistration`, `outOfStateVinVerification`. Encoded states:
CA, NY, TX, FL, IL, PA, OH, WA, AZ (values and sources in
[`doc/index.md`](../doc/index.md)). Any other state uses the default rule (no
deadline, no tax rate, inspection `unknown`, insurance and VIN verification
required) and raises F-STATE-002. Fees are never encoded.

Preconditions of a transfer that become outstanding items:

- **Insurance:** required unless the transaction is title-only or the state does
  not ask for proof at registration (Washington). Insurance that expires before
  the application date is outstanding.
- **Emissions certificate:** California only: a used, non-electric vehicle more
  than four model years old.
- **Out-of-state VIN verification:** every encoded state and the default.

### 4.4 Outstanding items

`outstandingItems(a)` returns `{ id, label }` for each of: state, transaction
type, new or used, acquisition method, acquisition date, application date,
out-of-state answer (and previous state when yes); owner type, name,
identification, mailing address, co-owner AND/OR, owner signature (and co-owner
signature when AND); an acceptable VIN, model year, make, model, vehicle class,
GVWR for a heavy truck, trailer, or motorhome; when a disclosure is required, the
reading, status, seller statement, and buyer acknowledgment; the title document,
prior-title surrender (for a state or out-of-state title), brand status, NMVTIS
answer; lien status and, for a new lien, the lienholder name; insurance proof
(current), the California emissions certificate, the out-of-state VIN
verification; and, for fees, the purchase price (for a purchase), the sales or
use tax status and amount (due), the exemption reason (exempt), and fees
tendered.

## 5. Flagged issues

Flags are independent of the class. Each has a stable id, a category, a
priority, a description, and a suggested action. Sorted high, medium, low.

| Id | Category | Priority | Raised when |
| --- | --- | --- | --- |
| F-STATE-001 | state | high | no state selected |
| F-STATE-002 | state | low | state not in `STATE_RULES` (verify the state rule) |
| F-VIN-001 | vin | high | VIN empty, wrong length, or contains I, O, Q or a symbol |
| F-VIN-002 | vin | high | check digit mismatch |
| F-VIN-003 | vin | medium | position-10 code disagrees with model year |
| F-VIN-004 | vin | low | pre-1981 vehicle, no standard format |
| F-ODOMETER-001 | odometer | high | disclosure required, reading or seller statement missing |
| F-ODOMETER-002 | odometer | high | status `not-actual` |
| F-ODOMETER-003 | odometer | medium | status `exceeds-mechanical-limits` |
| F-ODOMETER-004 | odometer | medium | seller signed, buyer has not acknowledged |
| F-ODOMETER-005 | odometer | low | exempt under 580.17 |
| F-ODOMETER-006 | odometer | medium | reading over one million |
| F-ODOMETER-007 | odometer | medium | used vehicle with a zero reading |
| F-BRAND-001 | brand | high | a brand is present |
| F-BRAND-002 | brand | high | a brand is present and not disclosed |
| F-BRAND-003 | brand | high | rebuilt brand without a passed inspection |
| F-BRAND-004 | brand | medium | NMVTIS not checked |
| F-BRAND-005 | brand | high | NMVTIS found a brand, total-loss, or theft record |
| F-BRAND-006 | brand | medium | salvage, junk, or flood brand on a registration |
| F-LIEN-001 | lien | high | existing lien not released |
| F-LIEN-002 | lien | high | new lien without a lienholder name |
| F-TITLE-001 | title | high | no title or MSO |
| F-TITLE-002 | title | high | prior title not surrendered |
| F-TITLE-003 | title | medium | new vehicle with a prior title |
| F-TITLE-004 | title | medium | used vehicle with an MSO |
| F-OWNER-001 | owner | high | owner not identified |
| F-OWNER-002 | owner | medium | co-owner without AND or OR |
| F-OWNER-003 | owner | high | required signature missing |
| F-OWNER-004 | owner | low | business not identified by FEIN |
| F-INSURANCE-001 | insurance | high | state requires proof; none |
| F-INSURANCE-002 | insurance | high | policy expired before application |
| F-INSURANCE-003 | insurance | low | state does not ask for proof at registration |
| F-INSPECTION-001 | inspection | high | California smog certificate missing |
| F-INSPECTION-002 | inspection | high | out-of-state VIN verification missing |
| F-INSPECTION-003 | inspection | low | county-dependent or post-registration inspection regime |
| F-TAX-001 | tax | medium | tax not calculated |
| F-TAX-002 | tax | medium | rate below the state base rate |
| F-TAX-003 | tax | medium | exempt without a reason |
| F-TAX-004 | tax | low | gift or inheritance taxed |
| F-TAX-005 | tax | low | tax amount below the state-level estimate |
| F-FEES-001 | fees | medium | fees not tendered |
| F-DEADLINE-001 | deadline | medium | application later than the state deadline |
| F-DATE-001 | date | medium | application date before acquisition date |
| F-DATE-002 | date | low | previous state equals the state of application |
| F-WEIGHT-001 | weight | medium | GVWR missing for a heavy truck, trailer, or motorhome |
| F-WEIGHT-002 | weight | low | GVWR over 10,000 pounds |
| F-VEHICLE-001 | vehicle | low | fuel type missing |

## 6. Inputs and outputs

**Input.** A typed `TitleApplication` whose shape mirrors the SQL schema.

**Output.**

```ts
{
  applicationClass: 'ready-to-submit' | 'incomplete' | 'title-brand-or-lien-issue';
  vinStatus: '' | 'valid' | 'not-standardized' | 'invalid-length' | 'invalid-characters' | 'check-digit-mismatch';
  odometerDisclosureRequired: boolean;
  brandOrLienIssue: boolean;
  outstandingItemCount: number;
  stateRuleKnown: boolean;
  estimatedStateTaxUsd: number | null;   // state level only
  flaggedIssues: FlaggedIssue[];
}
```

Rendered as HTML in the browser and convertible to FHIR R5, XML, JSON, CSV, or
TSV. The persisted grade stores `applicationClass`, `vinStatus`,
`odometerDisclosureRequired`, `brandOrLienIssue`, `outstandingItemCount`,
`stateRuleKnown`, plus rule and flag rows.

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

- `bin/test-form united-states-vehicle-title-and-registration-application` exits cleanly.
- The engine is pure (no side effects, no I/O, no clock) and unit-tested,
  covering each class, the brand-or-lien precedence over completeness, the VIN
  check digit, the odometer exemptions, and the state-rule fallback.
- `examples/personas.json` has at least six personas covering every class and
  the flag families, and `bin/test-personas` passes.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)) and
  pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).

## 9. Compliance

Inherits the monorepo compliance baseline. The form is a **non-medical,
administrative** documentation tool for United States motor vehicle titling; the
medical-device baselines in the root `AGENTS.md` do not apply to its function.
It is written to the federal overlays (49 CFR 565.15; 49 U.S.C. 32705 and
49 CFR Part 580; 49 U.S.C. chapter 305 and 28 CFR part 25) and to the encoded
state rules. Not legal advice; the issuing state agency decides.

## 10. References

- [49 CFR 565.15 — VIN requirements](https://www.ecfr.gov/current/title-49/part-565/section-565.15)
- [49 CFR 580.5 — odometer disclosure statement](https://www.ecfr.gov/current/title-49/part-580/section-580.5)
- [49 CFR 580.17 — exemptions](https://www.ecfr.gov/current/title-49/part-580/section-580.17)
- [NMVTIS (Bureau of Justice Assistance)](https://vehiclehistory.bja.ojp.gov/)
- [28 CFR part 25 subpart B — NMVTIS](https://www.ecfr.gov/current/title-28/chapter-I/part-25/subpart-B)
- [Uniform Certificate of Title Act (2005)](https://www.uniformlaws.org/)
- State agency pages: see [`doc/index.md`](../doc/index.md).

- [`index.md`](../index.md) — form description and classification model
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form united-states-vehicle-title-and-registration-application
bin/test-personas united-states-vehicle-title-and-registration-application
```
