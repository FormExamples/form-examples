# United States Property Tax Exemption Application — Reference documentation

Statutory and agency reference material for the form: the laws behind the
engine's `STATE_RULES` table, the verified values, and design notes.

See the form root [`../index.md`](../index.md) for the design and
[`../spec/index.md`](../spec/index.md) for the behavior contract.

## Why the rules are state-variable

There is no federal property tax exemption. Real property tax is assessed and
collected by each state's counties (or equivalent), under that state's
constitution and statutes. The common shape is: a **homestead** exemption for an
owner-occupied primary residence, held on an **assessment (lien) date** (usually
January 1), with an annual or one-time **application** to the county assessor by
a state deadline; plus income- or age-tested **senior**, **disability** and
**disabled-veteran** relief, and income-based **circuit-breaker** relief. The
engine encodes that common shape (`DEFAULT_RULE`) and a verified table for eight
states.

## Sources

| Jurisdiction | Source | Verified value |
| --- | --- | --- |
| California | [BOE Homeowners' Exemption](https://boe.ca.gov/proptaxes/homeowners_exemption.htm) | $7,000 reduction of taxable value; claim BOE-266, one-time filing with the county assessor; full exemption if filed by February 15; principal residence on the January 1 lien date |
| Texas | [Comptroller exemptions](https://comptroller.texas.gov/taxes/property-tax/exemptions/) and [residence homestead FAQ](https://comptroller.texas.gov/taxes/property-tax/) | $140,000 school district homestead exemption (tax year 2025 on); additional $60,000 for age 65+ or disabled; apply before May 1 (April 30); late application up to two years after the delinquency date |
| Florida | [DOR PT-113 brochure](https://floridarevenue.com/property/Documents/PT113.pdf) and [Fla. Stat. 196.031](https://www.flsenate.gov/Laws/Statutes/2023/196.031) | Title and permanent residence on January 1; Form DR-501 to the county property appraiser by March 1 (late = waiver for the year); first $25,000 all taxes, additional up to $25,722 (2025, CPI indexed) on value over $50,000, non-school taxes |
| New York | [Tax Department STAR eligibility](https://www.tax.ny.gov/pit/property/star/eligibility.htm) | Basic STAR: income $500,000 (credit) / $250,000 (exemption); Enhanced STAR age 65+, income about $110,750 for 2026 (secondary local source: verify); deadline March 1 in most localities |
| Illinois | [35 ILCS 200/15-172](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K15-172.htm) and bill summaries | Senior exemption $8,000 (Cook and contiguous) / $5,000 elsewhere; senior freeze income limit $65,000 (bills propose $75,000): verify; no single statewide filing date |
| Pennsylvania | [DCED homestead exclusion](https://dced.pa.gov/local-government/property-tax-relief-homestead-exclusion/) and [Revenue PTRR](https://www.pa.gov/agencies/revenue/incentives-credits-and-programs/ptrr) | Homestead/farmstead application by March 1 for the following tax year; Property Tax/Rent Rebate household income limit $48,110, due June 30 and often extended |
| Ohio | county auditor 2026 notices (Cuyahoga, Franklin, Ashtabula) | Age 65 by December 31; income limit $41,000 (2025 Ohio AGI), $40,000 for late filers; exemption on $29,000 of market value; DTE 105A due December 31 of the year sought; 100% disabled veterans have no income limit |
| Washington | [RCW 84.36.381](https://lawfilesext.leg.wa.gov/Law/RCW/RCW%20%2084%20%20TITLE/RCW%20%2084%20.%2036%20%20CHAPTER/RCW%20%2084%20.%2036%20.381.htm) | Age 61 on December 31 of the filing year; income thresholds set by county (floors $30,000 / $35,000 / $40,000); more than six months occupancy; filing deadline not confirmed: verify |

Figures change yearly and some come from secondary sources. The engine marks those states (`verify: true`) and raises a low-priority flag; the
issuing county assessor's current published figures always govern. Verified 2026-11-20.

## Assessment appeals (basics only)

An exemption lowers the taxable value; it does not contest the assessed value. An
appeal (protest, grievance, complaint) is a separate proceeding with its own, shorter
window that starts at the notice of value: Texas review board by May 15 or 30 days
after the notice; Florida value adjustment board within 25 days of the TRIM notice;
Ohio board of revision by March 31; Washington 60 days from the notice or July 1.
The engine only gives guidance (flag `F-APPEAL-001`); these windows are secondary-source
and must be confirmed with the county.

## Penalty for a false statement

Applications are signed under penalty of perjury or equivalent. A false claim can
lead to removal of the exemption, back taxes with interest and penalties, and
prosecution. The declaration step requires the applicant to acknowledge this.

## Disclaimer

Documentation support, not legal or tax advice. The county assessor or state
agency decides.
