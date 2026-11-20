# United Kingdom Birth Registration — Reference documentation

Source material for the rules the engine encodes. Every rule below is taken from
the GOV.UK pages fetched on 2026-11-20; where a page is silent the rule is
marked as an assumption in [`../spec/index.md`](../spec/index.md).

## Rule-to-source map

| Rule | Engine item | Source |
| --- | --- | --- |
| A birth in England, Wales and Northern Ireland must be registered within 42 days | `STATUTORY_DAYS`, `lateRegistration`, flag `F-LATE-REGISTRATION-001` | GOV.UK Register a birth |
| Register at the local register office for the birth area, at the hospital before the mother leaves, or at any register office | `registrationRoute` | GOV.UK Register a birth |
| Information the registrar asks for: place and date of birth, the child's name and sex, the parents' names, address, places and dates of birth, marriage date, occupations, mother's maiden surname | `missingItems` | GOV.UK Register a birth |
| Bring the red book if you have it; proof of identity; proof of paternity if attending alone | `redBookPresented`, `identityInsufficient`, `paternityEvidenceMissing` | GOV.UK Register a birth |
| Married or civil-partner parents: either may register alone | `VALID_BASES['married-or-civil-partners']` | GOV.UK Who can register a birth |
| Unmarried parents: father's name only by joint registration, signed statutory declaration, or a court document giving parental responsibility; mother may register alone and the father may be added later by re-registration | `VALID_BASES.unmarried`, `unmarriedFatherLeftOff`, flag `F-UNMARRIED-FATHER-001` | GOV.UK Who can register a birth |
| Female couples: both may be recorded; unmarried couples need licensed-clinic treatment and a parenthood agreement plus a joint, declaration or court route | `VALID_BASES['female-couple-unmarried']`, `licensedClinicTreatment` | GOV.UK Who can register a birth |
| Male couples: a parental order from the court is needed before either is registered | `VALID_BASES['male-couple']` | GOV.UK Who can register a birth |
| Qualified informants other than parents (someone present at the birth, someone responsible for the child, hospital administrative staff) when the parents cannot register | `informantProblem`, `NON_PARENT_INFORMANTS` | GOV.UK Who can register a birth |
| One accepted original identity document, or two from the secondary list; mobile phone bills are not accepted | `PRIMARY_DOCUMENTS`, `identityInsufficient`, `identityNotOriginal` | GOV.UK Proving your identity |
| Certificates from GRO: 12.50 pounds standard, 38.50 pounds priority (next working day if ordered by 4pm), card payment | certificate order step, flags `F-CERTIFICATE-*` | GOV.UK Order a copy of a certificate |
| Scotland and Northern Ireland have separate registers | `outOfScopeReason`, flag `F-OUT-OF-SCOPE-COUNTRY-001` | GOV.UK Register a birth |
| Stillbirths are registered separately | `outOfScopeReason`, flag `F-OUT-OF-SCOPE-STILLBIRTH-001` | GOV.UK (not covered in the fetched pages; see the assumptions in the spec) |
| More than 12 months after the birth the Registrar General's authority is needed | `LATE_LIMIT_DAYS`, `overTwelveMonths` | Births and Deaths Registration Act 1953 (assumption; check legislation.gov.uk) |

## References

- [GOV.UK: Register a birth](https://www.gov.uk/register-birth) — the 42-day period in England, Wales and Northern Ireland; where to register (local register office, or the hospital); the information the registrar asks for; what to bring (red book, proof of identity, proof of paternity if attending alone).
- [GOV.UK: Who can register a birth](https://www.gov.uk/register-birth/who-can-register-a-birth) — parents register; married or civil-partner parents (either may register alone); unmarried parents (register together, signed statutory declaration of parentage, or a court document giving parental responsibility); same-sex female couples; same-sex male couples (parental order); other qualified informants (someone present at the birth, someone responsible for the child, hospital administrative staff) when the parents cannot.
- [GOV.UK: Proving your identity (register a birth)](https://www.gov.uk/register-birth/proving-your-identity) — one accepted original document (passport, photocard driving licence, UK birth or adoption certificate, biometric immigration document, travel documents, EU identity card, proof-of-age card) or two from the secondary list (utility bill but not a mobile phone bill, council tax, bank statement, benefit or tax letter, P45 or P60, marriage certificate, NHS or HMRC letter, and others).
- [GOV.UK: Order a copy of a birth, death, marriage or civil partnership certificate](https://www.gov.uk/order-copy-birth-death-marriage-certificate) — General Register Office (GRO) orders for England and Wales: 12.50 pounds a standard certificate, 38.50 pounds for the priority service (next working day when ordered by 4pm), an extra 3.50 pounds a search without a GRO index reference, card payment.
- [GOV.UK: Register a birth abroad](https://www.gov.uk/register-birth-abroad) — a birth outside the UK is registered under that country's rules; optional UK registration.
- Births and Deaths Registration Act 1953 and the Registration of Births and Deaths Regulations 1987 — the statutory basis for the 42-day period, qualified informants, and the register entry. Section numbers are deliberately not cited here; check the Acts on legislation.gov.uk before relying on a specific provision.
- *Human Fertilisation and Embryology Act 2008* — the legal parenthood rules for a female second parent and for parental orders.
