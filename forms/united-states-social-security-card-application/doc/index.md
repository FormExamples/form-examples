# United States Social Security card application - reference documentation

Research notes behind the engine. The form is federal: every rule here comes
from federal law and SSA policy, so the state of residence is recorded but does
not change any result.

## What the form is

Form SS-5 is the single application for an original Social Security card, a
replacement card, or a corrected card (name, date of birth, or other data).
SSA decides every application; this repository's engine only checks that an
application and its evidence are complete.

## Rules the engine encodes

1. **Replacement limits.** A person may receive at most 3 replacement cards in a
   calendar year and 10 in a lifetime (IRTPA 2004 section 7213; 20 CFR
   422.103(e)). An original card and a legal name change do not count. At a
   limit, SSA denies the replacement unless an exception applies: a legal name
   change, a legend change, non-receipt of a card, an SSA error, or hardship,
   each supported by documents.
2. **Evidence.** Every application needs proof of identity: a current,
   unexpired document that shows name, identifying information, and preferably
   a photograph (for example a US driver license, a state non-driver ID, or a
   US passport). An original card or a date-of-birth correction needs proof of
   age (a birth certificate is preferred). An original or corrected card needs
   proof of US citizenship or lawful alien status; for a replacement it is
   needed only when SSA does not already hold it. A lawfully admitted
   noncitizen without work authorization needs a valid non-work reason. A legal
   name change needs the document that shows it (marriage certificate, divorce
   decree, or court order). Documents must be originals or copies certified by
   the issuing agency; photocopies and notarized copies are not accepted.
3. **In person.** An applicant aged 12 or older requesting an original card
   must apply in person.
4. **Signer.** A parent or legal guardian signs for an applicant under 18. When
   anyone other than the applicant signs, that person shows their own identity.
5. **Death.** SSA does not issue a card for a person who has died. The death is
   reported instead (funeral home or 1-800-772-1213). The engine treats a
   deceased applicant as not eligible and flags an unreported death.
6. **Privacy.** The Social Security number is never collected or stored by this
   form.

## Verification status

The 3-per-year and 10-per-lifetime limits, the exclusion of original cards and
legal name changes, and the five exception reasons were confirmed against SSA's
own policy manual and 20 CFR 422.103. The detailed lists of acceptable identity,
age, and citizenship documents and the age-12 in-person rule follow the SS-5
instructions as summarized by secondary sources, because ssa.gov refused
automated fetches during research. They are to be re-verified against the
current SS-5 PDF before any production use.

## Sources

- [SSA Form SS-5, Application for a Social Security Card](https://www.ssa.gov/forms/ss-5.pdf) (the form and its instructions; the host refused automated fetches, so the item list and evidence rules below come from SSA regulations and POMS, cross-checked with secondary sources, and should be re-verified against the current PDF).
- [20 CFR 422.103, Social Security numbers](https://www.law.cornell.edu/cfr/text/20/422.103): paragraph (e) limits replacement cards to 3 per year and 10 per lifetime and ties replacements to the evidence rules in 422.107.
- [20 CFR 422.107, Evidence requirements for an SSN card](https://www.law.cornell.edu/cfr/text/20/422.107): proof of age, identity, and US citizenship or lawful alien status.
- [SSA POMS RM 10205.400, Limits on replacement SSN cards](https://secure.ssa.gov/poms.nsf/lnx/0110205400): original cards and legal name changes do not count; exception reasons are a name change, a legend change, non-receipt of a card, an SSA mistake, and hardship.
- [Federal Register, Social Security Number Cards; Limiting Replacement Cards (31 July 2006)](https://regulations.justia.com/regulations/fedreg/2006/07/31/E6-12254.html): the rule implementing section 7213 of the Intelligence Reform and Terrorism Prevention Act of 2004.
- [Kiplinger, The 3-and-10 Rule](https://www.kiplinger.com/retirement/social-security/the-3-and-10-rule-how-social-security-replacement-card-limits-work): plain-language summary of the limits (secondary source).
- [SSA Social Security Number and Card](https://www.ssa.gov/ssnumber/): the agency pages for original, replacement, and corrected cards and for reporting a death (1-800-772-1213).

## Disclaimer

Documentation support, not legal advice. The Social Security Administration
decides every application.
