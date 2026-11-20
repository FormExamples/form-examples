# United States Marriage License Application — Reference documentation

Research notes behind the state rule table. **Documentation support, not legal
advice.** Rules change and counties differ, so each value must be confirmed with the
issuing county clerk. Retrieved 2026-11-20.

## What is federal and what is state

- There is no federal marriage license. Each state (and the District of Columbia and
  territories) sets age, waiting period, validity, witnesses, and procedure; a local
  official, usually the county clerk, issues the license.
- *Obergefell v. Hodges* (2015): states must license marriages between two people of
  the same sex and recognize those validly licensed elsewhere. The Respect for Marriage
  Act (2022) requires federal recognition of a marriage valid where entered.
- 42 U.S.C. 666(a)(13) is why state applications ask for Social Security numbers. Most
  states do not refuse an applicant who has none.
- 8 U.S.C. 1101(a)(35) limits proxy marriage for immigration purposes only; the state
  decides whether a proxy marriage is valid.

## Verified values

| State | Min age (minor path) | Wait | Valid | Witnesses | Proxy | Return | Source notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CA | 18 (court order to 2026-12-31; none after) | none | 90 d | 1 public, 0 confidential | military | 10 d | Recording Law, Wikipedia |
| NY | 18 (no exceptions) | 24 h | 60 d | 1 | none | 5 d | Recording Law |
| TX | 18 (court order, floor 16) | 72 h; waived: course, active duty | 90 d | 0 | military | 30 d | Texas Family Code 2.204 |
| FL | 18 (parental consent at 17, partner within 2 years) | 72 h; waived: course, both nonresident | 60 d | 0 | none | 10 d | Recording Law, Wikipedia |
| IL | 18 (parental consent or court at 16-17) | 24 h | 60 d | 0 | none | 10 d | Recording Law |
| PA | 18 (no exceptions) | 72 h | 60 d | 0 (2 for self-uniting) | none | 10 d | Recording Law |
| OH | 18 (juvenile court at 17, partner within 4 years) | none | 60 d | 0 | none | 30 d | Recording Law |
| WA | 18 (no exceptions) | 72 h, no waiver | 60 d | 2 | none | 30 d | RCW 26.04, King and Clark counties |
| GA | 18 (court/emancipation at 17) | none | no statutory expiry (365 d used) | 0 | none | 30 d | Recording Law |
| VA | 18 (no exceptions) | none | 60 d | 0 | none | 30 d | Recording Law |

Notes:

- California's confidential license needs no witness; a public license needs one. The
  court-order path for a minor closes on 2027-01-01 (Recording Law, Wikipedia).
- Texas: 72 hours, with exceptions for active-duty service members, a premarital
  education course, and a judge's waiver for good cause (Texas Family Code 2.204).
- Washington: three days, not waivable even by a court; license valid 60 days
  (RCW 26.04.180); two witnesses (RCW 26.04.070 as cited by Thurston County). Counties
  differ on when the wait starts, so the engine counts from the issue date.
- Florida: three days for residents, waived by a premarital course or when neither
  applicant lives in Florida; 17-year-olds with parental consent when the partner is
  within two years.
- Ohio: 17 with juvenile-court consent when the partner is within four years.
- No encoded state requires a premarital blood test; the engine keeps a `bloodTest`
  flag in each rule for any state or territory that adds one.
- Fees are set by county and are shown only as an indication.

## Sources

- [Cornell LII — Marriage Laws of the Fifty States, District of Columbia and Puerto Rico](https://www.law.cornell.edu/wex/table_marriage)
- [Justia — Getting a Marriage License: 50-State Survey](https://justia.com/family/getting-a-marriage-license-50-state-survey)
- [Recording Law — Marriage License Requirements by State (2026)](https://www.recordinglaw.com/us-laws/marriage-license-requirements/)
- [Wikipedia — Marriageable age in the United States](https://en.wikipedia.org/wiki/Marriageable_age_in_the_United_States)
- [Texas Family Code section 2.204 — 72-hour waiting period and its exceptions](https://codes.findlaw.com/tx/family-code/fam-sect-2-204/)
- [Revised Code of Washington 26.04.180 — license validity](https://law.justia.com/codes/washington/2022/title-26/chapter-26-04/section-26-04-180/?current=1)
- [Clark County, Washington Auditor — three-day waiting period](https://clark.wa.gov/auditor/waiting-period)
- [King County, Washington — marriage licensing](https://www.kingcounty.gov/marriage)
- [*Obergefell v. Hodges*, 576 U.S. 644 (2015)](https://supreme.justia.com/cases/federal/us/576/644/)
- [Respect for Marriage Act, Pub. L. 117-228 (2022)](https://www.congress.gov/bill/117th-congress/house-bill/8404)
- [42 U.S.C. 666(a)(13) — Social Security numbers on marriage license applications](https://www.law.cornell.edu/uscode/text/42/666)
- [8 U.S.C. 1101(a)(35) — proxy marriage and immigration](https://www.law.cornell.edu/uscode/text/8/1101)
