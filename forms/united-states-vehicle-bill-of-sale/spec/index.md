# United States Vehicle Bill of Sale — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behavior: update the
spec before changing code.

Slug: `united-states-vehicle-bill-of-sale`

## 1. Purpose

A bill of sale for a private-party sale of a motor vehicle in the United States.
It records the parties, the vehicle (year, make, model, body type, VIN, title
brand), the price and date, the as-is clause, the federal odometer disclosure
statement required by 49 CFR Part 580, the lien release, the title signature,
notarization where the state requires it, the sales-tax basis, and the post-sale
release of liability and buyer title application. Its engine is a
**completeness and risk-classification** engine, not a numeric score: it
classifies the sale as **Complete**, **Incomplete**, or **Risk flagged**, and
raises flagged issues. It is documentation support, not legal advice: the issuing
state agency decides what it accepts.

Full design description: [`index.md`](../index.md). Research and citations:
[`doc/index.md`](../doc/index.md).

## 2. Scope

In scope: the schema, the classification engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Axum JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: dealer sales, hosted deployment, authentication, multi-tenancy,
electronic-title and electronic-signature workflows, and filing with a state
agency.

## 3. Data model

A single logical bill of sale. Fields default to `''` (text/enum) or `null`
(numeric/date) when unanswered. In the front-ends the record is grouped into
seven sections (`transaction`, `seller`, `buyer`, `vehicle`, `odometer`, `terms`,
`afterSale`); a section's field `seller.name` is the SQL column `seller_name`.

| Column | Type | Notes |
| --- | --- | --- |
| `state` | varchar | Two-letter USPS code of the state whose rules govern the sale (the state that will title and register the vehicle); empty when unanswered. |
| `sale_date` | date | Date the vehicle changed hands (date of sale and of odometer transfer). |
| `sale_price_as_usd` | num | Purchase price in US dollars; 0 for a gift; null when unanswered. |
| `payment_method` | enum | How the price was paid: cash, check, wire, financing, trade, or gift. |
| `tax_basis` | enum | Basis on which the buyer will pay sales or use tax: purchase price, state standard presumptive value, fair market value, or a claimed gift or family exemption. |
| `seller_name` | text | Seller printed name as it appears on the title. |
| `seller_type` | enum | Whether the seller is an individual or a business. |
| `seller_street_address` | text | Seller current street address (required by 49 CFR 580.5 for the odometer disclosure). |
| `seller_city` | text | Seller city. |
| `seller_state` | varchar | Seller two-letter state code. |
| `seller_postal_code` | varchar | Seller ZIP or ZIP+4 code. |
| `seller_phone` | varchar | Seller telephone number. |
| `seller_signed` | enum | Whether the seller signed the bill of sale. |
| `buyer_name` | text | Buyer printed name. |
| `buyer_type` | enum | Whether the buyer is an individual or a business. |
| `buyer_street_address` | text | Buyer current street address (required by 49 CFR 580.5 for the odometer disclosure). |
| `buyer_city` | text | Buyer city. |
| `buyer_state` | varchar | Buyer two-letter state code. |
| `buyer_postal_code` | varchar | Buyer ZIP or ZIP+4 code. |
| `buyer_phone` | varchar | Buyer telephone number. |
| `buyer_signed` | enum | Whether the buyer signed the bill of sale. |
| `vehicle_year` | int | Model year of the vehicle. |
| `vehicle_make` | varchar | Vehicle make. |
| `vehicle_model` | varchar | Vehicle model. |
| `body_type` | varchar | Vehicle body type (required by 49 CFR 580.5). |
| `vin` | varchar | Vehicle Identification Number; 17 characters for a 1981 or newer vehicle. |
| `vehicle_color` | varchar | Vehicle color. |
| `title_number` | varchar | Certificate of title number. |
| `title_brand` | enum | Brand on the title: clean, salvage, rebuilt, flood, lemon-law buyback, junk, or unknown. |
| `gvwr_over_16000` | enum | Whether the gross vehicle weight rating exceeds 16,000 pounds (exempt from the federal odometer rule). |
| `self_propelled` | enum | Whether the vehicle is self-propelled (a trailer is not, and is exempt from the federal odometer rule). |
| `odometer_reading_miles` | int | Odometer reading in whole miles at transfer, without tenths; null when unanswered. |
| `odometer_status` | enum | Seller certification under 49 CFR 580.5: actual mileage, mileage exceeds the odometer mechanical limits, or the reading is not the actual mileage (warning odometer discrepancy). |
| `odometer_seller_certified` | enum | Whether the seller signed the odometer disclosure statement. |
| `odometer_buyer_acknowledged` | enum | Whether the buyer signed the odometer disclosure acknowledgement. |
| `seller_holds_title` | enum | Whether the seller holds the certificate of title in hand at the sale. |
| `title_signed` | enum | Whether the seller has signed the title over to the buyer. |
| `lien_status` | enum | Lien status: none, released (lien release in hand), or outstanding. |
| `lienholder_name` | text | Name of the lienholder, if any. |
| `lien_release_date` | date | Date the lienholder released the lien. |
| `as_is_clause` | enum | Warranty terms: sold as is with no warranty, or with a written warranty. |
| `warranty_note` | text | Description of any written warranty; empty for an as-is sale. |
| `notarized` | enum | Whether the bill of sale or title assignment was notarized, or notarization is not required. |
| `release_of_liability_filed` | enum | Whether the seller filed the release of liability or notice of transfer with the state agency. |
| `release_filed_date` | date | Date the seller filed the release of liability. |
| `plates_removed` | enum | Whether the seller removed the license plates (relevant where plates stay with the seller). |
| `buyer_title_application_date` | date | Date the buyer applied to title and register the vehicle. |

`seller_id` and `buyer_id` link to the reusable `seller` and `buyer` contact
records. The child tables `..._grade` (class, odometer-exemption and
known-state indicators), `..._grade_rule` (audit trail), and `..._grade_flag`
(flagged issues) hold the engine output.

## 4. Classification algorithm

First matching class wins:

```text
riskIndicated        -> 'risk-flagged'
incompleteIndicated  -> 'incomplete'
otherwise            -> 'complete'
```

**Risk conditions** (`riskIndicated`): the seller certifies the odometer reading
is not the actual mileage or exceeds the mechanical limits; the VIN is invalid
(an `I`, `O`, or `Q`, a symbol, a length other than 17 for a model year of 1981
or later, or a failed ISO 3779 check digit in position 9); a lien is outstanding;
the seller does not hold the title; the title carries a salvage, rebuilt, flood,
lemon-law, or junk brand.

**Incomplete conditions** (`incompleteIndicated`): a missing seller or buyer
name, street address, city, state, or ZIP code; a missing seller or buyer
signature; a missing state, date, price, vehicle year, make, model, VIN, as-is or
warranty statement, lien status, or title-in-hand answer (body type also, when
the odometer disclosure is required; a warranty description when a warranty is
chosen); an incomplete odometer disclosure when one is required (reading,
certification statement, seller signature, buyer acknowledgement); the title held
but not signed over; or a state-required notarization not recorded.

**Federal odometer exemption** (49 CFR 580.17), so no odometer item is required
when any applies: GVWR over 16,000 pounds; not self-propelled; model year 2010 or
earlier and the sale year is at least 10 years after the model year; model year
2011 or later and the sale year is at least 20 years after the model year (the
first 2011 vehicles become exempt in 2031).

**State rules.** The engine encodes a `STATE_RULES` table (below). A state not in
the table uses the uniform default (bill of sale recommended, no notarization, no
deadlines) and raises the `F-BOS-014` verify-state-rule flag. Deadline flags read
the clock (`today`); `bin/test-personas` freezes it at 2026-09-03T12:00:00Z.

| State | Bill of sale | Notarization | Seller notice | Buyer applies | Verified from |
| --- | --- | --- | --- | --- | --- |
| CA (California) | recommended | none | 5 days (REG 138) | 10 days | agency |
| NY (New York) | official form MV-912 | none | none encoded | none encoded | secondary |
| TX (Texas) | recommended (Form 130-U) | none | 30 days | 30 days | agency |
| FL (Florida) | recommended (HSMV 82050) | none | 30 days | 30 days | secondary |
| IL (Illinois) | recommended | none | none encoded | 20 days | secondary |
| PA (Pennsylvania) | recommended (MV-4ST) | title, before a notary | none encoded | 20 days | agency |
| OH (Ohio) | recommended | title, before a notary | none encoded | 30 days | secondary |
| WA (Washington) | official form 420-065 | none | 5 days (Report of Sale) | 15 days | agency |
| LA (Louisiana) | required | bill of sale | none encoded | none encoded | secondary |

"Verified from" is `agency` when an agency page or form was read, `secondary`
when only secondary guides were found. Every row should be re-verified with the
state agency before reliance (see [`doc/index.md`](../doc/index.md)).

## 5. Flagged issues

Computed independently of the class, stable-sorted high > medium > low:

| Id | Category | Priority | Fires when |
| --- | --- | --- | --- |
| F-BOS-001 | odometer-disclosure-missing | high | disclosure required and an item is missing |
| F-BOS-002 | odometer-discrepancy | high | status is not-actual or exceeds-mechanical-limits |
| F-BOS-003 | invalid-vin | high | VIN fails the length, character, or check-digit test |
| F-BOS-004 | lien-outstanding | high | lien status is outstanding |
| F-BOS-005 | title-problem | high / medium | seller has no title (high), or has not signed it over (medium) |
| F-BOS-006 | title-brand | high / low | branded title (high), unknown brand (low) |
| F-BOS-007 | notarization-required | high | the state requires notarization and it is not recorded |
| F-BOS-008 | missing-party-details | medium | party name or address incomplete |
| F-BOS-009 | missing-signature | high | seller or buyer has not signed |
| F-BOS-010 | missing-terms | medium | sale or vehicle details missing |
| F-BOS-011 | release-of-liability | high / medium / low | overdue (high), pending (medium), late (medium), no encoded deadline (low) |
| F-BOS-012 | buyer-title-deadline | medium | buyer application late or overdue |
| F-BOS-013 | sales-tax-basis | medium / low | price 0 without an exemption (medium), basis unrecorded (low) |
| F-BOS-014 | verify-state-rule | medium | state is not in `STATE_RULES` |
| F-BOS-015 | odometer-exempt-note | low | the federal disclosure is exempt |
| F-BOS-016 | state-form | low | the state expects an official or written bill of sale |
| F-BOS-017 | implausible-data | medium | future sale date, model year, mileage, price, or state code |
| F-BOS-018 | disclaimer | low | always |

## 6. Inputs and outputs

**Input.** A typed bill-of-sale object whose shape mirrors the SQL schema in
`sql/`.

**Output.** A result emitted by the engine:

```ts
{
  completenessClass: 'complete' | 'incomplete' | 'risk-flagged';
  odometerExempt: boolean;
  stateRuleKnown: boolean;
  flaggedIssues: FlaggedIssue[];
}
```

Rendered as HTML in the browser and convertible to FHIR R5 Bundle, XML, JSON,
CSV, or TSV.

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

- `bin/test-form united-states-vehicle-bill-of-sale` exits cleanly.
- The engine is pure (no side effects, no I/O apart from the clock) and
  unit-tested, covering each class, the risk precedence, the odometer
  exemption by model year, the VIN check digit, the state table and the
  unknown-state fallback, and the deadline flags.
- `examples/personas.json` pins at least one persona per class and every flag
  category; `bin/test-personas united-states-vehicle-bill-of-sale` passes.
- The HTML front-end conforms to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-end conforms to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)) and
  passes `pnpm check` and `pnpm exec vitest run`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).

## 9. Compliance and disclaimer

Inherits the monorepo compliance baseline. This form is **not** a medical
device: it is a documentation-support tool for a vehicle sale. It is not legal
advice; the issuing state motor vehicle agency (or a court) decides what it
accepts. Federal law (49 CFR Part 580) applies in every state; state law varies,
and the table in §4 is a small, dated sample. The seller and buyer should each
keep a signed copy of the bill of sale and the odometer statement for at least
five years (49 CFR 580.8).

## 10. References

- [49 CFR Part 580: Odometer Disclosure Requirements (eCFR)](https://www.ecfr.gov/current/title-49/subtitle-B/chapter-V/part-580)
- [49 CFR 580.17: Exemptions](https://www.ecfr.gov/current/title-49/part-580/section-580.17)
- [NHTSA: Odometer fraud and disclosure](https://www.nhtsa.gov/vehicle-safety/odometer-fraud)
- [Texas DMV: Buying or selling a vehicle](https://www.txdmv.gov/motorists/buying-or-selling-a-vehicle)
- [California DMV: Notice of Transfer and Release of Liability (REG 138)](https://www.dmv.ca.gov/portal/vehicle-registration/notice-of-transfer-and-release-of-liability-nrl)
- [Washington DOL: Vehicle/Vessel Bill of Sale (420-065)](https://dol.wa.gov/sites/default/files/forms/420065.pdf)
- [Pennsylvania DMV: Motor vehicle FAQs (notarized title transfer)](https://www.pa.gov/agencies/dmv/faqs/motor-vehicle-faqs/motor-vehicle-miscellaneous-faqs)
- [Ohio BMV: Vehicle titles](https://www.bmv.ohio.gov/titles-new.aspx)

- [`index.md`](../index.md): form description and classification model
- [`AGENTS.md`](../AGENTS.md): agent instructions
- [`plan.md`](../plan.md): implementation roadmap
- [`tasks.md`](../tasks.md): task tracking
- [`/spec.md`](../../../spec.md): system-level specification
- [`/AGENTS.md`](../../../AGENTS.md): cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form united-states-vehicle-bill-of-sale
bin/test-personas united-states-vehicle-bill-of-sale
```
