# United Kingdom Vehicle Bill of Sale

A bill of sale / sales receipt for a **private** vehicle sale in the United
Kingdom, following the GOV.UK "Buy a vehicle" and "Sell, scrap or transfer a
vehicle" journeys. One continuous single-page wizard records the sale, the
seller and buyer, the vehicle, the checks, the price and payment, the condition
terms, the DVLA steps, and both signatures.

**This form is documentation support, not legal advice.** It does not create or
replace any statutory document and does not decide anyone's legal rights.

## Classification, not a score

The engine is a **completeness and validity** engine. It classifies the record
as:

- **Complete** — every required item is filled in and no risk condition holds.
- **Incomplete** — one or more required items are missing.
- **Risk flagged** — a risk condition holds (outstanding finance, V5C not
  present or not matching, seller not the registered keeper, description not
  matching the advert). Takes precedence over incomplete.

It also raises flagged issues: no VIN, no mileage, finance outstanding, V5C not
present, seller not the registered keeper, payment-method risk, missing
signatures, description mismatch, MOT, trader sale, V5C/2 slip, and DVLA
notification.

## Steps

| # | Step | Records |
| --- | --- | --- |
| 1 | Sale | date, place, private or trader |
| 2 | Seller | contact details, registered keeper |
| 3 | Buyer | contact details |
| 4 | Vehicle | registration, make, model, colour, VIN, year, fuel, mileage |
| 5 | Checks | V5C, MOT, outstanding finance |
| 6 | Price and payment | price, deposit, method, funds received |
| 7 | Condition | sold as seen or warranty, known faults, matches advert |
| 8 | DVLA | V5C/2 new keeper slip, telling DVLA |
| 9 | Signatures | seller, buyer, date |
| 10 | Summary | live classification |

## Related forms

Three DVLA forms already exist
([`v1`](../united-kingdom-driver-and-vehicle-licensing-agency-v1-form/),
[`m1`](../united-kingdom-driver-and-vehicle-licensing-agency-m1-form/),
[`b1`](../united-kingdom-driver-and-vehicle-licensing-agency-b1-form/)), and
`united-kingdom-vehicle-registration-application` covers the buyer's
registration. This form does not duplicate them.

## Documents

- [`spec/index.md`](spec/index.md) — living domain spec
- [`doc/index.md`](doc/index.md) — sources and rules cited
- [`AGENTS.md`](AGENTS.md), [`plan.md`](plan.md), [`tasks.md`](tasks.md)
