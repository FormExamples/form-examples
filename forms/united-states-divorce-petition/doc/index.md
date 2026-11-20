# United States Divorce Petition — reference documentation

Research notes and citations behind the engine's rules. Divorce (dissolution of
marriage) is state law, so the engine encodes a small verified table of state
rules (`STATE_RULES` in `front-end-with-html/js/rules.js`, mirrored in
`front-end-with-svelte/src/lib/engine/rules.ts`) on top of the federal and
uniform-act rules below. This is documentation support, not legal advice; the
court decides.

## Verified state rules

| State | State residency | County | Waiting period (runs from) | Separation for contested no-fault | Property | Fault grounds |
| --- | --- | --- | --- | --- | --- | --- |
| CA | 6 months | 3 months (90 days) | 6 months and a day (service) | none | community | no (irreconcilable differences) |
| NY | 2 years; 1 year if married or lived as spouses in NY | none | none | none (breakdown for 6 months, DRL 170(7)) | equitable | yes |
| TX | 6 months | 90 days | 60 days (filing) | none | community | yes |
| FL | 6 months | none | 20 days (filing) | none | equitable | no (irretrievably broken) |
| IL | 90 days | none | none | 6 months (waivable by agreement) | equitable | no |
| PA | 6 months | none | 90 days (service; mutual consent) | 1 year (3301(d)) | equitable | yes |
| OH | 6 months | 90 days | none | 1 year | equitable | yes |
| WA | none | none | 90 days (later of filing or service) | none | community | no |
| AZ | 90 days | none | 60 days (service) | none | community | no |
| NV | 6 weeks | none | none | none | community | no |

Statutes: Cal. Fam. Code 2310, 2320, 2339; N.Y. Dom. Rel. Law 170(7), 230;
Tex. Fam. Code 6.301, 6.702; Fla. Stat. 61.021, 61.052, 61.19; 750 ILCS 5/401;
23 Pa.C.S. 3104, 3301; Ohio R.C. 3105.01, 3105.62 and Civ.R. 3(C);
RCW 26.09.030; A.R.S. 25-312, 25-329; NRS 125.010, 125.020.

## Sources consulted

- Justia, [Uncontested divorce laws and forms: 50-state survey](https://justia.com/family/divorce/uncontested-divorce-forms-50-state-resources)
- FindLaw, [Details on state requirements for divorce](https://statelaws.findlaw.com/family-laws/details-on-state-requirements-for-divorce.html)
- Pennsylvania courts, [Divorce procedure](https://www.pacourts.us/Storage/media/pdfs/20210515/225026-file-5373.pdf) (90 days after service before consent affidavits)
- Ohio Supreme Court, [Termination of marriage](https://supremecourt.ohio.gov/courts/services-to-courts/domestic-relations-resource-guide/termination-of-marriage) (6 months state, 90 days county)
- New York Senate, [Domestic Relations Law 230, required residence of parties](https://www.nysenate.gov/legislation/laws/DOM/230)
- WomensLaw, [Washington residency requirements](https://www.womenslaw.org/laws/wa/divorce/what-are-residency-requirements-divorce-washington)
- WomensLaw, [A.R.S. 25-312, dissolution of marriage findings](https://www.womenslaw.org/es/leyes/az/estatutos/ss-25-312-dissolution-marriage-findings-necessary)

Where a figure came from a secondary source (for example the Illinois separation
presumption, the Florida 20-day period and the Pennsylvania residency period) it
is marked for verification in `spec/index.md` and must be confirmed against the
statute before anyone relies on it.

## Federal and uniform law

- Uniform Child Custody Jurisdiction and Enforcement Act (UCCJEA), section 201:
  a state is a child's home state only after six consecutive months; the engine
  raises a high flag when the children have lived in the state under six months.
- Servicemembers Civil Relief Act, 50 U.S.C. 3931: an affidavit is required
  before a default judgment against a servicemember.
- Uniform Marriage and Divorce Act, section 302: the model 90-day domicile and
  irretrievable-breakdown framework; the engine's default rule for a state not in
  the table (with a "verify state rule" flag).
- Child support guidelines (42 U.S.C. 667): each state must have a presumptive
  guideline; the petition records that the state worksheet is completed.
- Vital records: divorce certificates are issued by each state vital-records
  office from the clerk's report (the CDC National Vital Statistics System
  collects the data); a certified decree comes from the clerk of court.

## Property division

Community-property states: Arizona, California, Idaho, Louisiana, Nevada, New
Mexico, Texas, Washington and Wisconsin. All other states use equitable
distribution. The engine knows the regime of its ten verified states and reports
`unknown` for the rest.
