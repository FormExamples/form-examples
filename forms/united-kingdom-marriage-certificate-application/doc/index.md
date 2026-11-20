# United Kingdom Marriage Certificate Application — Reference documentation

Statutory and guidance reference material for the United Kingdom marriage
certificate application form: the real GOV.UK and General Register Office (GRO)
rules the engine encodes, with sources and the date each was checked
(2026-11-20). See the form root [`../index.md`](../index.md) for the design and
[`../spec/index.md`](../spec/index.md) for the contract.

This form is a **completeness and validity** instrument for England and Wales.
It is not legal advice, and the register office decides each notice. Scotland
(different notice and "impediment" rules) and Northern Ireland are out of scope.

## Rules the engine encodes

| Rule | What the sources say | Engine behavior |
| --- | --- | --- |
| Minimum age | "You must be at least 18" to marry or form a civil partnership. The Marriage and Civil Partnership (Minimum Age) Act 2022 raised the age from 16 and removed the parental-consent route; it applies to ceremonies from 27 February 2023, including ones held abroad that involve a UK resident. | A party who is under 18 on the ceremony date (else the notice date) makes the application `ineligible`. There is no consent exception. |
| Not already married | You must not already be married or in a civil partnership. | A party recorded as currently married or in a civil partnership makes the application `ineligible`. |
| Prohibited degrees | You must not be closely related to your partner. | `closelyRelated = yes` makes the application `ineligible`. |
| Notice and the notice period | Give notice at the local register office at least 29 days before the ceremony; the earliest ceremony date is 30 days after the notice date (notice on 1 May allows a ceremony from 30 May, which is 29 days later). | `earliestCeremonyDate = noticeDate + 29 days`; an earlier ceremony raises `notice-period-too-short`. |
| Notice validity | The ceremony must take place within 12 months of giving notice. | `latestCeremonyDate = noticeDate + 12 months`; a later ceremony raises `notice-expires-before-ceremony`. |
| Residence | You must have lived in the registration district for the past 7 days. Parties in different districts each give notice in their own district. | `daysResidentInDistrict < 7` raises `residence-under-7-days`. |
| Previous marriage or civil partnership | A decree absolute, final order, annulment certificate or the former partner's death certificate is needed; originals only. A fee is charged for the register office to check the documents, higher if the GRO must check them. | `divorced`, `widowed`, `dissolved-civil-partnership` or `annulled` without evidence raises `prior-relationship-evidence-missing`; with evidence a low `prior-evidence-check-fee` reminder is raised. |
| Immigration status | A party from outside the UK and Ireland must give notice together with their partner at a designated register office, unless they have British or Irish citizenship, settled or pre-settled status under the EU Settlement Scheme, or a qualifying pending EU Settlement Scheme application. Acceptable proof includes a passport with visa or endorsement, an eVisa or biometric residence permit share code, or an EU Settlement Scheme share code. Without acceptable proof the notice can be referred to the Home Office (Immigration Enforcement), which can take up to 70 days. | `nationalityStatus = other` requires joint notice (`joint-notice-required`); `other` or `eu-settlement-scheme` without evidence raises `immigration-status-referral` and sets `immigrationReferralIndicated`. |
| Identity and address | Original photographic identity and proof of home address (a UK contact address if living overseas) are shown at the appointment; photocopies are not accepted. | Missing confirmation raises `identity-missing` / `address-proof-missing`. |
| Venue | Final venue details are needed when giving notice; religious ceremonies need a registered building, civil ceremonies a register office or approved premises. | `venueConfirmed != yes` raises `venue-not-confirmed`. |
| Witnesses | Ceremonies need at least two witnesses. | `witnessCount < 2` raises `witnesses-insufficient`. |
| Certificate copies | Order from the GRO online, by phone, post or the local register office: standard copy £12.50 (about 4 days with a GRO index reference; each search without one costs £3.50 more and takes about 15 working days); priority £38.50 (next working day if ordered by 4pm). | Copies without a service make the application `incomplete`; copies without a GRO index reference raise a low flag; copies below 1 raise `certificate-copies-invalid`. |

Fees quoted above were current on 2026-11-20 and change; the engine does not
compute fees, it only reminds the applicant to ask.

## Sources

- [GOV.UK — Marriages and civil partnerships in England and Wales: give notice](https://www.gov.uk/marriages-civil-partnerships/give-notice) (29 days, 12 months, 7 days' residence, joint notice, EU Settlement Scheme exceptions)
- [GOV.UK — Marriages and civil partnerships: legal requirements](https://www.gov.uk/marriages-civil-partnerships/legal-requirements) (18 or over, not already married, not closely related)
- [GOV.UK — Documents you'll need to give notice](https://www.gov.uk/marriages-civil-partnerships/documents-youll-need-to-give-notice) (originals, proof of address, decree absolute, final order, death certificate, checking fees, immigration evidence)
- [GOV.UK — Plan your ceremony](https://www.gov.uk/marriages-civil-partnerships/plan-your-ceremony) (two witnesses, venues, registrar, fees)
- [GOV.UK — Order a copy of a birth, death, marriage or civil partnership certificate](https://www.gov.uk/order-copy-birth-death-marriage-certificate) (GRO service, fees, priority service)
- [Marriage and Civil Partnership (Minimum Age) Act 2022](https://www.legislation.gov.uk/ukpga/2022/28/contents) (minimum age 18 from 27 February 2023)
- [Marriage Act 1949](https://www.legislation.gov.uk/ukpga/Geo6/12-13-14/76/contents) and [Civil Partnership Act 2004](https://www.legislation.gov.uk/ukpga/2004/33/contents) (prohibited degrees, notice, schedules)
- [Immigration Act 2014, Part 4](https://www.legislation.gov.uk/ukpga/2014/22/part/4) (referral of notices where immigration status cannot be shown)
- Local authority guidance repeating GOV.UK, for the proof lists and the up to 70-day referral period (for example Bradford, Manchester, Leeds register offices).

## Known gaps

- The engine does not model Anglican banns or common licence, Quaker or Jewish
  ceremonies, housebound or detained persons, or marriage by Registrar General's
  licence; each has its own process.
- A party under 18 abroad, or a forced-marriage concern, is out of scope.
- Local register offices differ on accepted documents; the engine tracks only
  "original identity", "original proof of address", "evidence the previous
  relationship ended" and "immigration evidence".
