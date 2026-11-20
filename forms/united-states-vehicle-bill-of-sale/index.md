# United States Vehicle Bill of Sale

A bill of sale for a private-party sale of a motor vehicle in the United States.
One continuous single-page wizard collects the sale (state, date, price, payment,
sales-tax basis), the seller and buyer, the vehicle (year, make, model, body type,
VIN, title brand), the federal odometer disclosure statement (49 CFR Part 580),
the as-is clause, title and lien status, notarization where the state requires
it, and the post-sale release of liability and buyer title application. The
engine classifies the sale as **complete**, **incomplete**, or **risk flagged**
and raises prioritized flags. It is documentation support, not legal advice: the
state motor vehicle agency decides what it accepts.

The living domain spec is [`spec/index.md`](spec/index.md); research and
citations are in [`doc/index.md`](doc/index.md).

## Scope and intended users

Private sellers and buyers, and the notaries and tag agents who help them, in the
fifty states and the District of Columbia. It is **not** for dealer sales (which
carry their own disclosure and tax rules), and it files nothing with a state
agency. Federal law applies everywhere; state law varies, so the engine carries a
small table of verified state rules and falls back to a uniform default, with a
"verify state rule" flag, for any other state.

## Sections and classification model

1. **Sale transaction.** State, date of sale, price (0 for a gift), payment
   method, sales-tax basis.
2. **Seller (transferor).** Printed name, type, current address, phone,
   signature.
3. **Buyer (transferee).** The same fields.
4. **Vehicle.** Year, make, model, body type, VIN, color, title number, title
   brand, GVWR over 16,000 lb, self-propelled.
5. **Odometer disclosure (49 CFR 580).** Reading in whole miles, the seller
   certification (actual / exceeds the mechanical limits / not the actual
   mileage), and both signatures. Exempt for a vehicle over 16,000 lb GVWR, a
   trailer, a model year 2010 or earlier vehicle 10 years on, and a model year
   2011 or later vehicle 20 years on (49 CFR 580.17).
6. **Terms, title, and lien.** As-is or warranty, whether the seller holds the
   title and has signed it over, lien status and release, notarization.
7. **After the sale.** Release of liability or notice of transfer, plates, buyer
   title application date, and the live classification.

The class is chosen by precedence: any risk condition (odometer discrepancy,
invalid VIN, outstanding lien, no title in hand, branded title) gives
**risk flagged**; otherwise any missing required item gives **incomplete**;
otherwise **complete**. The 18 flags (`F-BOS-001` to `F-BOS-018`) are listed in
[`spec/index.md`](spec/index.md) §5.

## State rules

| State | Notarization | Seller notice | Buyer applies |
| --- | --- | --- | --- |
| CA | none | 5 days | 10 days |
| NY | none (official form MV-912) | none encoded | none encoded |
| TX | none | 30 days | 30 days |
| FL | none | 30 days | 30 days |
| IL | none | none encoded | 20 days |
| PA | title, before a notary | none encoded | 20 days |
| OH | title, before a notary | none encoded | 30 days |
| WA | none (official form 420-065) | 5 days | 15 days |
| LA | bill of sale | none encoded | none encoded |

Rows marked `secondary` in `spec/index.md` came from secondary guides rather than
an agency page. Verify every row with the state agency.

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric and date fields.
- camelCase in TypeScript and front-end serde; snake_case in SQL and Rust.
- Generated artefacts are never hand-edited.

## Compliance

This is not a medical device. It is a documentation-support tool and not legal
advice. See [`spec/index.md`](spec/index.md) §9 and the repo-wide baseline in
[`/AGENTS.md`](../../AGENTS.md).

## References

- [49 CFR Part 580: Odometer Disclosure Requirements](https://www.ecfr.gov/current/title-49/subtitle-B/chapter-V/part-580)
- [NHTSA: Odometer fraud and disclosure](https://www.nhtsa.gov/vehicle-safety/odometer-fraud)
- [Texas DMV: Buying or selling a vehicle](https://www.txdmv.gov/motorists/buying-or-selling-a-vehicle)
- [California DMV: Notice of Transfer and Release of Liability](https://www.dmv.ca.gov/portal/vehicle-registration/notice-of-transfer-and-release-of-liability-nrl)
- [Washington DOL: Vehicle/Vessel Bill of Sale](https://dol.wa.gov/sites/default/files/forms/420065.pdf)
- [Pennsylvania DMV: Motor vehicle FAQs](https://www.pa.gov/agencies/dmv/faqs/motor-vehicle-faqs/motor-vehicle-miscellaneous-faqs)

## Verify

```sh
bin/test-form united-states-vehicle-bill-of-sale
```
