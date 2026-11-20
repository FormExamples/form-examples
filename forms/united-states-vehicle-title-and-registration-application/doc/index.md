# United States Vehicle Title and Registration Application — Reference documentation

Federal and state reference material for the form: the instruments the engine
encodes, the verified state values, and design notes. See the form root
[`../index.md`](../index.md) for the design description and
[`../spec/index.md`](../spec/index.md) for the contract.

**Disclaimer.** Documentation support, not legal advice. Statutes, fees, and
deadlines change; the issuing state agency decides. Verification status is
stated per value below (2026-11-20): values marked "confirmed" appeared in an
official agency page or statute during research; values marked "verify" come
from general knowledge of the statute and must be re-checked before anyone
relies on them. Values that sources disagreed about are deliberately not
encoded.

## Federal law (applies in every state)

### VIN format and check digit — 49 CFR 565.15

- A VIN for a vehicle of model year 1981 or later has 17 characters, from the
  digits 0-9 and the letters A-Z excluding I, O, and Q (the transliteration
  table has no entry for them).
- **Check digit (position 9).** Transliterate each character (A=1 through H=8;
  J=1 to N=5; P=7; R=9; S=2 through Z=9; digits keep face value), multiply by the
  position weights `8 7 6 5 4 3 2 10 0 9 8 7 6 5 4 3 2`, sum, and take the
  remainder modulo 11. A remainder of 10 is written `X`.
- **Model-year code (position 10).** A=2010 through Y=2030 (skipping I, O, Q, U,
  Z), then 1-9 for 2031-2039; the same letters and digits cover the earlier
  30-year cycle (1980-2009).
- Source: [49 CFR 565.15 on eCFR](https://www.ecfr.gov/current/title-49/part-565/section-565.15).
  The engine's worked example, `1HGCM82633A004352`, passes the check, with check digit
  `3`.

### Odometer disclosure — 49 U.S.C. 32705 and 49 CFR Part 580

- **580.5** requires a written statement on transfer with: the odometer reading
  (no tenths), the date, the transferor's printed name and address, the
  transferee's printed name and address, the vehicle's make, model, year, body
  type, and VIN, a federal warning statement, the transferor's signature, one of
  three status statements (actual mileage; exceeds the odometer's mechanical
  limits; **not** the actual mileage and not to be relied upon), and the
  transferee's signature. One transferor may sign for several.
- **580.17 exemptions.** A transferor need not disclose when the vehicle has a
  gross vehicle weight rating over 16,000 pounds; is model year 2010 or earlier
  and transferred at least 10 years after January 1 of its model year; or is
  model year 2011 or later and transferred at least 20 years after January 1 of
  its model year. A new vehicle is exempt only before its first transfer other
  than for resale (manufacturer to dealer), so the dealer-to-buyer sale is
  covered.
- **580.8** records are retained for five years.
- Sources: [49 CFR 580.5](https://www.ecfr.gov/current/title-49/part-580/section-580.5),
  [49 CFR 580.17](https://www.ecfr.gov/current/title-49/part-580/section-580.17),
  [NHTSA odometer fraud](https://www.nhtsa.gov/vehicle-safety/odometer-fraud).

### National Motor Vehicle Title Information System (NMVTIS)

- Administered by the Department of Justice (Bureau of Justice Assistance) under
  [49 U.S.C. chapter 305](https://uscode.house.gov/view.xhtml?path=/prelim@title49/subtitle6/partC/chapter305&edition=prelim)
  and [28 CFR part 25, subpart B](https://www.ecfr.gov/current/title-28/chapter-I/part-25/subpart-B).
  It holds title, brand, and total-loss data from state agencies, insurers, and
  junk and salvage yards (a business handling five or more such vehicles a year
  must report) so a brand follows a vehicle to every state and "title washing"
  can be detected.
- Participating state agencies query NMVTIS before issuing a title. The
  applicant-side check is advisory; the engine flags a missing check (medium)
  and a found brand or theft record (high). Sources:
  [Federal Register notice](https://www.federalregister.gov/documents/2009/01/30/E9-1835/national-motor-vehicle-title-information-system-nmvtis),
  [NMVTIS program site](https://vehiclehistory.bja.ojp.gov/).

### Uniform act

The Uniform Law Commission's
[Uniform Certificate of Title Act (2005)](https://www.uniformlaws.org/)
is the model for the default rule: a certificate of title is the evidence of
ownership, a lien is perfected by notation on the title, and a brand (a
"designation") carries to the successor title. Most states follow their own
older statutes; the engine's uniform default is conservative.

## State rules encoded in `STATE_RULES`

| State | Agency | Title deadline (days after acquisition) | State base sales or use tax | Inspection regime | Proof of insurance at registration |
| --- | --- | --- | --- | --- | --- |
| CA | Department of Motor Vehicles | 10 (transfer fees due within 10 days; late penalty after that) | 7.25% | Smog certificate on transfer (see below) | Yes |
| NY | Department of Motor Vehicles | None fixed | 4% | Annual safety and emissions, after registration | Yes |
| TX | Department of Motor Vehicles | 30 | 6.25% | Safety inspection eliminated for non-commercial vehicles from 2025-01-01; emissions in designated counties | Yes |
| FL | Dept. of Highway Safety and Motor Vehicles | 30 | 6% | None | Yes |
| IL | Secretary of State | 20 | 6.25% general rate | Emissions in the Chicago and metro-east areas | Yes |
| PA | Department of Transportation | 20 | 6% | Annual safety inspection; emissions in designated counties | Yes |
| OH | Bureau of Motor Vehicles | 30 | 5.75% | Emissions in designated counties | Yes |
| WA | Department of Licensing | 15 (a $50 penalty on day 16, then $2 a day, capped at $125) | 6.5% | None (emissions testing ended) | No proof at registration |
| AZ | Motor Vehicle Division | 15 | 5.6% | Emissions in the Phoenix and Tucson areas | Yes |

**Confirmed in research:** the CA 10-day transfer-fee rule and $15 transfer fee,
the TX 30-day deadline and 6.25% rate and the 2025 end of non-commercial safety
inspections, the FL 30-day deadline, the OH 30-day deadline and 5.75% state
rate, the WA 15-day deadline and its penalty schedule, the PA 20-day deadline
and statewide safety inspection, and the NY title-only form. **Verify:** the NY
absence of a fixed deadline, the IL 20-day deadline, the AZ 15-day deadline, the
state base tax rates for CA, NY, FL, IL, PA, WA, and AZ, the Illinois, Arizona,
Ohio, and Pennsylvania emissions areas, the WA proof-of-insurance rule, and the
California smog age cutoff.

Sources consulted: the California DMV
[transfer and fees](https://www.dmv.ca.gov/portal/vehicle-registration/registration-fees/)
and [dealer-purchase](https://www.dmv.ca.gov/portal/vehicle-registration/new-registration/registering-a-vehicle-purchased-from-a-dealer/)
pages (the $15 transfer fee and the 10-day rule); the
[Texas DMV buying and selling](https://www.txdmv.gov/motorists/buying-or-selling-a-vehicle)
page (30 days; 6.25%) and the
[Texas DPS notice](https://www.dps.texas.gov/news/vehicle-safety-inspection-program-changes-now-effect)
on House Bill 3297; the New York
[MV-82TON](https://dmv.ny.gov/forms/mv82ton.pdf) application for title; the
Florida [TL-10](https://www.flhsmv.gov/pdf/proc/tl/tl-10.pdf) form and its
30-day rule; the Illinois
[Secretary of State vehicle pages](https://www.ilsos.gov/departments/vehicles/faq.html);
the PennDOT
[out-of-state transfer page](https://www.pa.gov/services/dmv/transfer-vehicle-registration-from-another-state);
the [Ohio BMV](https://www.ohiobmv.gov/military-title-vehicle-purchased-oos.aspx)
(county clerk of courts; 30 days); and the Washington DOL
[buy and register a vehicle](https://dol.wa.gov/vehicles-and-boats/vehicles/buying-and-selling-vehicle/buy-and-register-vehicle)
page and
[RCW 46.17](https://wa-law.org/rcw/46_motor_vehicles/46.17_vehicle_fees.html)
(15 days; the $50 plus $2 a day, capped at $125, penalty).

**Values that sources disagree on and are NOT encoded (verify with the
agency):** every fee amount (the Florida title fee is quoted from $75.25 to
$88.25; the Pennsylvania fee from $58 to $72; the Ohio fee as $15 or $18; the
Washington fee as $15 or $18, plus a $5.50 filing fee; the Illinois fee as $150
or $165), the number of Texas emissions counties (17 or 18), the California
late-penalty amount ($15 to $30 across sources), and the New York deadline.
Local sales-tax add-ons are excluded from `salesTaxBasePercent`. Washington's
private-sale use tax adds 0.3% in one source.

California smog rule used by the engine: a smog certificate is a precondition
of a transfer for a used, non-electric vehicle more than four model years old.
Sources disagree on who supplies it (seller or buyer); the engine only checks
that one is recorded.

## Design notes

- **Class names.** `ready-to-submit`, `incomplete`, `title-brand-or-lien-issue`.
- **Odometer exemption year** uses the calendar year of the acquisition date
  (else the application date), matching 580.17's "January 1 of the calendar
  year" arithmetic.
- **Out-of-state VIN verification** is encoded as a precondition for all nine
  states and the default; each state names its own authorized inspectors.
- **No fee arithmetic.** Fees change every session, so the engine confirms that
  fees were tendered and estimates only the state-level tax.
- **Brands.** Salvage, junk, rebuilt or reconstructed, flood, odometer "not
  actual", lemon-law buyback, hail, and other. Total-loss thresholds differ by
  state and are not encoded; the applicant states the brand on the title.
