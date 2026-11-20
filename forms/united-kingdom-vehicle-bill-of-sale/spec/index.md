# United Kingdom Vehicle Bill of Sale — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `united-kingdom-vehicle-bill-of-sale`

**Disclaimer.** This form is documentation support, not legal advice. It helps
a private seller and buyer record a used-vehicle sale and spot gaps or risks. It
does not create, replace, or validate any statutory document, and it does not
decide anyone's legal rights.

## 1. Purpose

A bill of sale / sales receipt for a private vehicle sale in the United Kingdom,
following the GOV.UK "Buy a vehicle" and "Sell, scrap or transfer a vehicle"
journeys. It records the seller and buyer, the vehicle (registration, make,
model, VIN, mileage), the price and payment, the condition terms ("sold as
seen"), the outstanding-finance and MOT checks, the V5C registration certificate
and V5C/2 new keeper supplement, whether DVLA has been told, and both
signatures. Its engine is a **completeness and validity** engine, not a clinical
score: it classifies the record as **Complete**, **Incomplete**, or
**Risk flagged**, and raises flagged issues.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, the completeness engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Axum JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: dealer sales, auctions, Northern Ireland-specific DVLA/DVA differences,
export, scrapping, hosted deployment, authentication, and any live DVLA, MOT, or
finance lookups.

Cross-references (do not duplicate): the DVLA forms
[`united-kingdom-driver-and-vehicle-licensing-agency-v1-form`](../../united-kingdom-driver-and-vehicle-licensing-agency-v1-form/),
[`…-m1-form`](../../united-kingdom-driver-and-vehicle-licensing-agency-m1-form/)
and [`…-b1-form`](../../united-kingdom-driver-and-vehicle-licensing-agency-b1-form/),
and the sibling `united-kingdom-vehicle-registration-application` form for the
buyer's registration step.

## 3. Data model

A single logical bill-of-sale record. Fields default to `''` (text/enum) or
`null` (numeric/date) when unanswered. Seller and buyer are separate SQL tables
(`seller`, `buyer`); the front-ends hold them as the `seller` and `buyer`
sections.

**Sale.**

| Field | Type | Notes |
| --- | --- | --- |
| `saleDate` | date | date of sale and handover |
| `salePlace` | text | where the sale took place |
| `sellerCapacity` | enum | private / trader — a trader selling as "private" misleads the buyer |

**Seller and buyer.** Each has `name`, `address`, `postcode`, `phone`, `email`;
the seller also has `isRegisteredKeeper` (yes / no): the seller should be the
registered keeper named on the V5C.

**Vehicle.**

| Field | Type | Notes |
| --- | --- | --- |
| `registration` | text | number plate |
| `make`, `model`, `colour` | text | |
| `vin` | text | vehicle identification number (chassis number), 17 characters on modern vehicles |
| `firstRegisteredYear` | integer | |
| `fuelType` | enum | petrol / diesel / hybrid / electric / other |
| `mileage` | integer | odometer reading in miles at sale |
| `mileageAccuracy` | enum | recorded / not-known |

**Checks.**

| Field | Type | Notes |
| --- | --- | --- |
| `v5cPresent` | enum | yes / no — seller has the V5C log book |
| `v5cDetailsMatch` | enum | yes / no — V5C details match the vehicle and the seller |
| `motStatus` | enum | valid / expired / exempt / none |
| `motExpiryDate` | date | |
| `financeStatus` | enum | none / outstanding / unchecked — outstanding finance (hire purchase, PCP, logbook loan) |
| `financeCheckDate` | date | date a vehicle history / finance check was run |

**Price and payment.**

| Field | Type | Notes |
| --- | --- | --- |
| `priceAsGbp` | number | agreed price in pounds |
| `depositAsGbp` | number | deposit paid, if any |
| `paymentMethod` | enum | bank-transfer / cash / cheque / card / other |
| `paymentReceived` | enum | yes / no — seller has cleared funds |

**Condition.**

| Field | Type | Notes |
| --- | --- | --- |
| `saleTerms` | enum | sold-as-seen / warranty-given |
| `knownFaults` | text | faults disclosed by the seller |
| `descriptionMatchesAdvert` | enum | yes / no — vehicle matches the advert and verbal description |

**DVLA.**

| Field | Type | Notes |
| --- | --- | --- |
| `newKeeperSlipGiven` | enum | yes / no — seller gave the buyer the V5C/2 "new keeper" section |
| `dvlaNotification` | enum | online / post / not-yet — seller told DVLA of the sale |

**Signatures.** `sellerSigned`, `buyerSigned` (yes / no), `signatureDate`
(date), `note` (text).

**Derived (never stored as input).** `classification`, `missingItemCount`,
`riskFlagCount`, `missingItems[]`, `flaggedIssues[]`.

## 4. Classification algorithm

Pure function, no I/O. The first matching class wins; flagged issues are always
computed in full.

```
riskFlagged =
     financeStatus == 'outstanding'
  || seller.isRegisteredKeeper == 'no'
  || v5cPresent == 'no'
  || v5cDetailsMatch == 'no'
  || descriptionMatchesAdvert == 'no'

missingItems = the required items still empty:
  saleDate, seller name, seller address, buyer name, buyer address,
  registration, make, model, vin (empty or under 11 characters), mileage,
  priceAsGbp (null or not above 0), paymentMethod, saleTerms,
  seller.isRegisteredKeeper, v5cPresent, financeStatus,
  sellerSigned == 'yes', buyerSigned == 'yes'

classification =
    riskFlagged            -> 'risk-flagged'
    missingItems non-empty -> 'incomplete'
    otherwise              -> 'complete'
```

- `riskFlagCount` is the number of risk conditions above that hold.
- `risk-flagged` takes precedence: a risk is shown even when items are missing.
- A `complete` record is internally complete. It does **not** prove the seller
  owns the vehicle, that finance is settled, or that the vehicle matches its
  description.

## 5. Flagged issues

Emitted independently of the class, each with a priority, a category, a
description, and a suggested action. Sorted high, then medium, then low.

- **No VIN** (high) — `vin` empty or under 11 characters: check the chassis
  number against the V5C and the vehicle.
- **No mileage** (high) — `mileage` null; record the odometer reading.
- **Finance outstanding** (high) — a lender may own the vehicle; settle the
  finance before sale.
- **V5C missing** (high) — `v5cPresent == 'no'`: without a V5C the seller may
  not be the keeper; the buyer must apply for a V62 and should consider walking
  away.
- **V5C details mismatch** (high) — `v5cDetailsMatch == 'no'`.
- **Seller not registered keeper** (high) — the person selling is not named on
  the V5C.
- **Description mismatch** (high) — the vehicle does not match the advert;
  misdescription can give the buyer a remedy under the Sale of Goods Act 1979
  s.13 even in a private sale.
- **Payment risk** (medium) — cash at £1,000 or more, a cheque not yet cleared,
  or payment not yet received; prefer a bank transfer and keep a record.
- **Finance unchecked** (medium) — `financeStatus` is `unchecked` or empty.
- **MOT issue** (medium) — MOT `expired` or `none` on a vehicle first registered
  more than three years ago; a vehicle needs a current MOT to be driven on the
  road (apart from driving to a pre-booked test).
- **Trader sale** (medium) — `sellerCapacity == 'trader'`: the Consumer Rights
  Act 2015 applies and "sold as seen" cannot remove statutory rights.
- **Unsigned** (medium) — either signature missing.
- **V5C/2 slip not given** (medium) — `newKeeperSlipGiven == 'no'`.
- **DVLA not yet told** (low) — `dvlaNotification == 'not-yet'`: the seller
  should tell DVLA at once (online or by post) so tax is cancelled and refunded.
- **Sold as seen, faults not recorded** (low) — `saleTerms == 'sold-as-seen'`
  but `knownFaults` empty.

## 6. Inputs and outputs

**Input.** A typed bill-of-sale object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric and
date fields default to `null`.

**Output.**

```ts
{
  classification: 'complete' | 'incomplete' | 'risk-flagged';
  missingItemCount: number;
  riskFlagCount: number;
  missingItems: string[];
  flaggedIssues: FlaggedIssue[];
}
```

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

- `bin/test-form united-kingdom-vehicle-bill-of-sale` exits cleanly.
- The engine is pure and unit-tested, covering each classification, the
  risk-over-incomplete precedence, and each flag.
- The HTML front-end conforms to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-end conforms to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)) and
  passes `pnpm check` and `pnpm test`.
- The Rust crate builds and `cargo test` passes.

## 9. Compliance

This is a non-clinical administrative form: it is not a medical device and
makes no clinical judgement. It documents a private sale to help the parties;
the disclaimer above applies. The monorepo baseline (ISO/IEC/IEEE 26514:2022
for user information) still applies. Legal grounding: Sale of Goods Act 1979
(ss.12 to 14), Consumer Rights Act 2015 (trader sales only), Road Vehicles
(Registration and Licensing) Regulations 2002 (keeper changes).

## 10. References

See [`../doc/index.md`](../doc/index.md) for the annotated list. Primary
sources:

- [GOV.UK — Buy a vehicle](https://www.gov.uk/buy-a-vehicle)
- [GOV.UK — Sell, scrap or transfer a vehicle](https://www.gov.uk/sold-bought-vehicle)
- [GOV.UK — Tell DVLA you have sold, transferred or bought a vehicle](https://www.gov.uk/sold-bought-vehicle)
- [GOV.UK — Vehicle log book (V5C)](https://www.gov.uk/log-book)
- [GOV.UK — Check the MOT history of a vehicle](https://www.gov.uk/check-mot-history)
- [Citizens Advice — Buying a used car](https://www.citizensadvice.org.uk/consumer/buying-or-selling-goods-and-services/)
- [Sale of Goods Act 1979](https://www.legislation.gov.uk/ukpga/1979/54)
- [Consumer Rights Act 2015](https://www.legislation.gov.uk/ukpga/2015/15)

- [`index.md`](../index.md) — form description and classification model
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form united-kingdom-vehicle-bill-of-sale
```
