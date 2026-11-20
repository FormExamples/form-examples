# United States Vehicle Title and Registration Application

An application for a **certificate of title and registration** with a United
States state motor vehicle agency. The applicant records the state and
transaction, the owner and co-owner identification, the vehicle and its VIN, the
federal **odometer disclosure**, the title history and any **title brand**
(salvage, junk, rebuilt, flood, and so on), any **lien**, proof of insurance,
inspections, and the **sales or use tax** and fees. The engine checks the
application for completeness and consistency against federal rules and the rules
of the chosen state, before it reaches a clerk.

The form is not a clinical score. Its engine is a **completeness, validity, and
eligibility** engine: it validates the VIN format and check digit, decides
whether a federal odometer disclosure is required or exempt, tests the title
history for brands, NMVTIS alerts, and unreleased liens, applies the state's
deadline, tax-rate, inspection, and insurance rules, and classifies the
application as **Ready to submit**, **Incomplete**, or **Title brand or lien
issue**, raising prioritized flagged issues.

Vehicle titling is a state function. Each of the 50 states, the District of
Columbia, and the territories runs its own certificate-of-title law, forms,
fees, and deadlines, so the engine takes a two-letter `state` and a small
`STATE_RULES` table (California, New York, Texas, Florida, Illinois,
Pennsylvania, Ohio, Washington, Arizona). Any other state falls back to the
uniform default rule and raises a "verify the state rule" flag. Three federal
overlays apply everywhere: the VIN standard (49 CFR 565.15), the odometer
disclosure (49 U.S.C. 32705; 49 CFR Part 580), and the National Motor Vehicle
Title Information System (49 U.S.C. chapter 305; 28 CFR part 25).

**Disclaimer.** This is documentation support, not legal advice. The issuing
state agency decides whether to issue a title and registration.

## Scope and intended users

- **Setting:** a vehicle owner, dealer, or title service preparing the paperwork
  before visiting a motor vehicle office or submitting by mail or online.
- **Users:** vehicle buyers and owners, dealership title clerks, and agency
  clerks who triage applications.
- **Transactions:** new and used vehicles bought from a dealer or a private
  seller, gifts, inheritances, and out-of-state transfers.
- **Not for:** commercial carrier credentials (IRP, IFTA, USDOT), boats and
  off-highway vehicles, or any legal determination of ownership.

## The eight sections

| Step | Section | What it captures |
| --- | --- | --- |
| 1 | The application | State, transaction type, new or used, acquisition method and date, application date, out-of-state transfer |
| 2 | Owner identification | Owner type and name, co-owner and AND/OR, identification, mailing address, signatures |
| 3 | The vehicle | VIN, model year, make, model, class, fuel, GVWR |
| 4 | Odometer disclosure | Reading, status, seller statement, buyer acknowledgment (49 CFR Part 580) |
| 5 | Title history and brands | Title document, prior title, brand, NMVTIS result, rebuilt inspection |
| 6 | Lienholder | Lien status and lienholder |
| 7 | Insurance and inspections | Proof of insurance, emissions, safety, out-of-state VIN verification |
| 8 | Fees and tax | Price, sales or use tax, fees, applicant note |

A ninth, read-only summary step shows the live class, VIN check, and outstanding
items.

## Classification

Precedence, first match wins:

1. **Title brand or lien issue:** a title brand, an NMVTIS brand or theft
   record, an unreleased existing lien, or a "not actual mileage" odometer
   disclosure.
2. **Incomplete:** any outstanding item (a missing required answer, an invalid
   VIN, a missing signature, missing insurance proof where the state asks for
   it, a missing out-of-state VIN verification, an uncalculated tax).
3. **Ready to submit:** otherwise.

There is no numeric score. See [`spec/index.md`](spec/index.md) for the
algorithm, the flag catalogue, and the state rule table, and
[`doc/index.md`](doc/index.md) for the sources.
