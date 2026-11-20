# United States Birth Certificate Application: reference documentation

Research notes and citations behind the engine's rules. Verified 2026-11-20 by web search and fetch of official pages and statutes; where a page could not be fetched or sources disagreed, that is stated and the form raises the low-priority "verify state rule" flag instead of asserting the value.

See the form root [`../index.md`](../index.md) and the contract in [`../spec/index.md`](../spec/index.md). This form is documentation support, **not legal advice**; the issuing vital records office decides.

## 1. There is no national birth certificate

The federal government does not issue or hold birth certificates. Each state, the District of Columbia, and each territory registers births that occur there and issues certified copies. The CDC National Center for Health Statistics (NCHS) publishes *Where to Write for Vital Records*, a page per state and territory giving the office, address, fees, and application guidelines. The index page states that "the federal government does not distribute certificates, files, or indexes with identifying information for vital records".

- CDC/NCHS, Where to Write for Vital Records: <https://www.cdc.gov/nchs/w2w/index.htm>
- State pages, for example Florida <https://www.cdc.gov/nchs/w2w/florida.htm>, Illinois <https://www.cdc.gov/nchs/w2w/illinois.htm>, Ohio <https://www.cdc.gov/nchs/w2w/ohio.htm>

## 2. The uniform baseline: Model State Vital Statistics Act

The Model State Vital Statistics Act and Regulations (2011 revision, developed with NAPHSIS and the CDC/NCHS) is the uniform act most states built on. It restricts certified copies to the registrant and persons with a **direct and tangible interest** (typically the registrant, parent named on the record, spouse, child, guardian, legal representative, and agencies acting officially). The engine's `DEFAULT_RULE` encodes that conservative set for any state without a verified row. NAPHSIS: <https://www.naphsis.org>.

## 3. The data of the US Standard Certificate of Live Birth

The record the office searches is the state's registration of the US Standard Certificate of Live Birth (CDC/NCHS 2003 revision; the 2016 revision adds fields). The identifiers the form asks for are those used to locate it: the child's name, sex, date and time of birth, facility, city, county and state of birth, the mother's name before first marriage, and the father's or second parent's name. CDC/NCHS: <https://www.cdc.gov/nchs/nvss/birth_certificate.htm>.

## 4. State rules encoded (`STATE_RULES`)

| State | What was verified | Source | Status |
| --- | --- | --- | --- |
| CA | Fee $29, rising to $31 on 1 Jan 2026 (AB 64); eligible "authorized persons" and the notarized sworn statement for mail requests (Health and Safety Code section 103526); informational copies open to anyone | CDPH Vital Records fees <https://www.cdph.ca.gov/Programs/CHSI/Pages/Vital-Records-Fees.aspx>; CDPH notice 25-05 <https://www.cdph.ca.gov/Programs/RPHO/Pages/All-Local-Health-Jurisdiction-Letters-Notices/25-05_2026-Fee-Schedule_11-03-2025.aspx> | fee verified; eligibility list from statute knowledge, CDPH eligibility page was not fetchable |
| NY (outside NYC) | $30 per copy (Public Health Law section 4179 and form DOH-4380); NYC is issued separately by the NYC Health Department at $15 | NYS DOH form <https://www.health.ny.gov/forms/doh-4380.pdf>; NYC <https://www.nyc.gov/site/doh/services/birth-death-records-birth.page> | fee verified; the NYS DOH eligibility page returned 403, so the eligible list is from the form and Public Health Law section 4174 |
| TX | $22 for a certified copy and $3 for each additional copy in the same order | 25 Texas Administrative Code section 181.22 <https://www.law.cornell.edu/regulations/texas/25-Tex-Admin-Code-SS-181-22> | fee verified; immediate-family eligibility from Health and Safety Code section 191.0045 (the DSHS page returned 403) |
| FL | Confidential for 125 years: only the registrant (if of age), parents on the record, a guardian, a legal representative, or a court order; spouse, child, grandchild, or sibling only when the registrant is deceased. Fees: the state search fee component is $9 and county offices charge about $14-15 for the first copy and $10 for each additional copy | Florida Department of Health <https://www.floridahealth.gov/certificates-records/birth-certificates/>; Florida Statutes section 382.0255 <https://m.flsenate.gov/Statutes/382.0255> | eligibility verified; **fee not verified** (sources disagree, so the form uses $15 / $10 and flags it) |
| IL | Parent or legal representative of the person, or an agency; the person if 18; fee $15 for a long-form certified copy, $2 for additional copies ordered together | 410 ILCS 535/25 <https://www.ilga.gov/Documents/legislation/ilcs/documents/041005350K25.htm>; IDPH <https://dph.illinois.gov/topics-services/birth-death-other-records/birth-records/obtain-birth-certificate.html>; CDC <https://www.cdc.gov/nchs/w2w/illinois.htm> | eligibility from statute; **fee not verified** (CDC listing and a legal-aid page differ) |
| PA | $20 per copy (online adds a $10 service fee); eligible: the person (16 and over), spouse, parent or step-parent, sibling or half-sibling, child; legal representatives with documentation | Pennsylvania Department of Health <https://www.pa.gov/agencies/health/programs/vital-records/birth-certificates> | verified from search results of the official pages |
| OH | Birth records are open: anyone who supplies the facts may order a certified copy; state fee $21.50 (local health departments charge $21.50 to $27) | Ohio Revised Code section 3705.24 <https://codes.ohio.gov/ohio-revised-code/section-3705.24>; CDC <https://cdc.gov/nchs/w2w/ohio.htm> | open access from code; **fee not verified** against a current ODH schedule |
| WA | $25 for a certified or informational copy; certified copies only to people with a qualifying relationship, with proof of identity and relationship; informational copies open to anyone | RCW 70.58A.560 <https://lawfilesext.leg.wa.gov/Law/RCW/RCW%20%2070%20%20TITLE/RCW%20%2070%20.%2058A%20CHAPTER/RCW%20%2070%20.%2058A.560.htm>; DOH FAQ <https://doh.wa.gov/id/node/4994> | fee verified from statute; the exact relationship list follows the DOH order form and should be confirmed |

Only the eight states above hold a row. Every other state, DC, and territory falls back to the uniform default and the form raises `F-BIRTH-STATE-001`. Fees and eligibility change often; the form states its expected fee but the office's current schedule governs.

## 5. Identity and documents

Certified copies are generally released only after the requester proves identity, usually with an unexpired government-issued photo ID, or alternative documents where none exists. Requesters who are not the person named, or a parent named on the record, usually must also document the relationship (marriage certificate, own birth certificate, court order, letters of guardianship, attorney engagement). Some states, notably California, require a notarized sworn statement of identity with a mailed request (Health and Safety Code section 103526). The engine encodes these as gaps; it cannot verify that the documents are genuine.

## 6. Which copy for which purpose

- **Passport.** The US Department of State requires a certified birth record issued by the city, county, or state of birth with the registrar's signature, the issue date, the seal, and the full names of the parents; abbreviated certificates and informational copies are not accepted. <https://travel.state.gov/content/travel/en/passports/need-passport/us-passport-birth-certificate.html>. The engine requires the long form for passports.
- **REAL ID, school, employment, benefits.** These need a certified copy, not an informational one.
- **Informational copy.** Stamped "not valid for identity" or similar; available to anyone in a few states (CA, WA). It is useful for genealogy.

## 7. Apostille

A birth certificate used abroad generally needs an **apostille** (Hague Apostille Convention, 1961) or, for non-member countries, legalization through the destination's embassy. The apostille is issued by the state Secretary of State (or equivalent) on a certified copy, often one signed by the current state registrar and recent; the vital records office does not issue it. The US Department of State authenticates only federal documents. HCCH status table: <https://www.hcch.net/en/instruments/conventions/status-table/?cid=41>. The engine requires the certified long form when an apostille is wanted, asks for a destination, and always explains the process.

## 8. Adopted and deceased registrants

For adoptions the original record is normally sealed and an amended certificate is issued after the decree; the office may require the decree. For a deceased registrant most offices require proof of death and of the requester's relationship, and some widen the eligible set (as in Florida). Both raise a medium flag.

## 9. Limits of this tool

- Eight states are encoded. Rules and fees change; the office's current page governs.
- Some values rest on a single secondary source and are flagged `feeVerified: false`.
- The engine cannot check document authenticity, whether a record exists, or whether the office will accept the application.
- Not legal advice.
