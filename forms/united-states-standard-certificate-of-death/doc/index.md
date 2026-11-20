# US Standard Certificate of Death: reference documentation

Sources, citations and design notes. Documentation support, not legal advice:
death registration is state law and the registering agency decides.

## Federal and uniform sources

There is no federal death-registration statute. Registration is a state
function; CDC's National Center for Health Statistics (NCHS) publishes the model
certificate, the handbooks that standardize how it is completed, and the model
law the states adapt. The engine is based on those, with a per-state table.

- NCHS, *U.S. Standard Certificate of Death* (2003 revision): https://www.cdc.gov/nchs/data/dvs/DEATH11-03final-acc.pdf
- NCHS, *Physicians' Handbook on Medical Certification of Death* (2003): https://www.cdc.gov/nchs/data/misc/hb_cod.pdf. Source of the section 4 rules: no mechanism alone, etiology required, terms in full, intervals, diabetes type, cancer site and cell type, manner categories, tobacco and pregnancy items.
- NCHS, *Instructions for Completing the Cause-of-Death Section of the Death Certificate* (retrieved 2026-11-20; title and author confirmed): https://www.cdc.gov/nchs/data/dvs/blue_form.pdf
- NCHS, *Medical Examiners' and Coroners' Handbook on Death Registration and Fetal Death Reporting* (2003): https://www.cdc.gov/nchs/data/misc/hb_me.pdf. Source of the referral circumstances.
- NCHS, *Model State Vital Statistics Act and Regulations* (2011 revision), the uniform act, basis of the default rule: https://www.cdc.gov/nchs/nvss/
- NCHS "Where to Write for Vital Records", one page per state, source of the fees: https://www.cdc.gov/nchs/w2w/

The Handbook URLs were not re-fetched in the build session. Federal law does not
set fee, deadline or eligibility rules; those are state rules.

## State rules and verification status (retrieved 2026-11-20)

| State | Certified copy fee | File deadline | Certifier deadline |
|---|---|---|---|
| CA | $24, verified (CDC) | 8 calendar days (H&S Code 102800), **not verified** | 15 hours (102795), recorded as 1 day, **not verified** |
| NY | $30, verified (CDC, NYS DOH, PHL 4174) | 72 hours, verified (PHL 4140, nysenate.gov) | none held |
| TX | $20, verified (CDC); $3 additional **not verified** (city page only) | 10 days (H&S Code ch. 193), **not verified** | 5 days, verified (H&S Code 193.005) |
| FL | $5 first, $4 additional, verified (FL DOH, CDC) | 5 days and before final disposition, verified (Fla. Stat. 382.008) | 72 hours, **not verified** |
| IL | $19, verified (CDC); $4 additional **not verified** | 7 days (410 ILCS 535), **not verified** | 48 hours, **not verified** |
| PA | $20, verified (CDC) | 96 hours (35 P.S. 450.503), **not verified** | 48 hours, **not verified** |
| OH | $21, verified (CDC) | 3 days (R.C. 3705.16), **not verified** | 48 hours after notification, verified (R.C. 3705.16) |
| WA | $25, verified (CDC, WA DOH) | 3 business days (RCW 70.58A), **not verified** | 2 business days, **not verified** |

"Verified" means read from the named primary or official source on the
retrieval date. Where a statute page could not be retrieved (HTTP 403 or no
text) the value was recorded as understood and marked not verified; the engine
appends "not independently verified" to that deadline flag. Fees change and
counties may add charges. Unknown states use the default (file 5 days, certify 3
days, no fee check) and raise F-VERIFY-STATE-001.

## Design notes

- Referral is derived, not only declared: a non-natural manner, injury wording or an unattended death indicates referral even if the certifier answered no.
- A medical examiner or coroner certifier is not referred; a pending manner raises F-PENDING-001 instead.
- `MECHANISMS` comes from the Handbook's unacceptable terms; heart failure is included because the Handbook asks for its cause. A mechanism with an etiology below it is accepted.
- HIV and AIDS are accepted abbreviations (a judgement for this tool).
- Not modeled: education, race, Hispanic origin, occupation, parents, informant, SSN, electronic registration handshake.
