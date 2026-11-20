# United States Vehicle Bill of Sale — Reference documentation

Regulatory reference material for the United States vehicle bill-of-sale form:
the federal odometer rule, the state rules the engine encodes, and where each
value came from. See the form root [`../index.md`](../index.md) for the design
description and [`../spec/index.md`](../spec/index.md) for the contract.

This is documentation support, not legal advice. State rules change and vary;
every value below should be re-verified with the state agency.

## Federal law

- **Truth in Mileage Act and 49 CFR Part 580.** A transferor of a motor vehicle
  must give the transferee a written odometer disclosure on transfer of
  ownership. [eCFR Part 580](https://www.ecfr.gov/current/title-49/subtitle-B/chapter-V/part-580).
  - **§ 580.5** requires, signed by the transferor with a printed name: the
    odometer reading (no tenths), the date of transfer, the transferor's and the
    transferee's printed names and current addresses, and the identity of the
    vehicle (make, model, year, body type, VIN). The document must carry a
    statement referring to federal law and warning that failure to complete it or
    providing false information may result in fines or imprisonment. The
    transferor certifies one of three statements: the reading reflects the actual
    mileage; the mileage exceeds the odometer's mechanical limits; or the reading
    does not reflect the actual mileage (a warning that a discrepancy exists).
  - **§ 580.8** requires each party to keep the disclosure for five years.
  - **§ 580.17 exemptions.** (a)(1) a vehicle with a GVWR over 16,000 pounds;
    (a)(2) a vehicle that is not self-propelled; (a)(3) a vehicle of model year
    2010 or earlier, transferred at least 10 years after January 1 of the
    calendar year of its model year; (a)(4) a vehicle of model year 2011 or later,
    transferred at least 20 years after January 1 of the calendar year of its
    model year (the first such transfers are in 2031); (a)(5) a vehicle sold
    directly by the manufacturer to a federal agency. The engine applies these as
    `sale year - model year >= 10` for model year 2010 or earlier and
    `>= 20` for model year 2011 or later.
  - Source read on 2026-11-20: the eCFR renderer text of §§ 580.5 and 580.17
    (summarized; the (a)(4) text says "in or after the 2011 model year" while its
    example says "2011 or older", so the engine follows the rule text).
- **VIN.** A 17-character VIN (49 CFR Part 565) never contains I, O, or Q, and
  position 9 is a check digit computed from the other characters (weights
  8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2, modulus 11, remainder 10 is `X`). The
  check digit applies to model year 1981 and later.

## State rules in the engine

| State | What the engine encodes | Source | Verified from |
| --- | --- | --- | --- |
| CA | seller notice (REG 138) within 5 calendar days (Vehicle Code 5900); buyer applies within 10 days; no notarization | [CA DMV NRL page](https://www.dmv.ca.gov/portal/vehicle-registration/notice-of-transfer-and-release-of-liability-nrl); the 10-day buyer figure is from secondary guides | agency (seller), secondary (buyer) |
| NY | MV-912 is the official bill of sale; DTF-802 states the sales-tax transaction; plates stay with the seller; no notarization | secondary guides (the DMV pages were not reachable) | secondary |
| TX | seller gives the buyer a signed Form 130-U showing the price; seller transfer notification within 30 days; buyer titles within 30 days; tax 6.25% of the higher of price or the standard presumptive value | [TxDMV](https://www.txdmv.gov/motorists/buying-or-selling-a-vehicle) | agency |
| FL | seller Notice of Sale (HSMV 82050 or the title back) within 30 days; buyer applies within 30 days | a county tax collector page and secondary guides | secondary |
| IL | buyer applies within 20 days; private-party vehicle use tax on RUT-50; seller's report of sale has no deadline encoded | secondary guides | secondary |
| PA | legal transfer when both parties sign the title before a notary; buyer submits within 20 days of notarization; MV-4ST reports price and mileage | [PennDOT FAQ](https://www.pa.gov/agencies/dmv/faqs/motor-vehicle-faqs/motor-vehicle-miscellaneous-faqs) | agency |
| OH | seller signature on the title notarized; buyer titles within 30 days; sales tax at the county rate | [Ohio BMV](https://www.bmv.ohio.gov/titles-new.aspx) and secondary guides | secondary |
| WA | official Vehicle/Vessel Bill of Sale 420-065; Report of Sale within 5 days; buyer transfers within 15 days (late fee from $50 to $125) | [WA DOL form 420-065](https://dol.wa.gov/sites/default/files/forms/420065.pdf) | agency |
| LA | bill of sale notarized (OMV expects it) | secondary guides only | secondary |

Conflicts found: sources disagree on whether NY, IL, and OH legally require a
bill of sale (the engine says "recommended" or "official form" rather than
"required"), on whether WA counts the 5 days as calendar or business days (the
engine counts calendar days), and on notarization in GA, MD, MT, NE, WV, and WY
(not encoded; those states use the uniform default and the verify-state-rule
flag).

## Why a small table

State law changes, and secondary guides disagree. The table is deliberately
small, dated, and flagged by confidence; an unknown state falls back to the
uniform default and the engine says so. Add a state only after reading its
agency page, then update `rules.js`, `bill-of-sale-rules.ts`, the spec, and the
personas together.

## Not legal advice

The engine documents and checks. It does not interpret the law for a
particular sale, and the issuing state agency or a court decides.
