# United States Divorce Petition — living domain spec

Petition for dissolution of marriage, the divorce decree and the vital-records
divorce certificate. A single-page, step-by-step wizard that collects the filing,
spouses, children, property, service and decree details, applies a
completeness-and-eligibility engine, and produces a readiness report with
prioritized flags. This is documentation support, not legal advice; the court
decides. Research and citations are in [`../doc/index.md`](../doc/index.md).

## 1. Purpose and scope

Help a petitioner or court self-help preparer check, before filing, that the
filing state's residency, county-residency, separation and waiting-period rules
look satisfied and that the required items (names, marriage date, grounds,
custody plan, child-support worksheet, settlement agreement, financial
disclosure, service) are present. Out of scope: drafting the pleading, computing
child support, valuing property, and any legal conclusion.

## 2. Data model

Six wizard sections plus a summary. SQL tables: `petitioner`, `attorney`,
`united_states_divorce_petition` (main record), and the grade triad
`united_states_divorce_petition_grade`, `..._grade_rule`, `..._grade_flag`.

| Section | Fields |
| --- | --- |
| filing | state, county, filingDate, caseType (uncontested/contested), groundType (no-fault/fault), faultGround |
| spouses | petitionerName, respondentName, marriageDate, marriagePlace, separationDate, petitionerResidencyMonths, countyResidencyDays, marriedOrLivedInState, respondentMilitary |
| children | hasMinorChildren, childrenCount, childrenHomeStateMonths, pregnant, custodyPlanDocumented, childSupportWorksheetCompleted, childSupportMonthlyAmount |
| property | propertyDivisionApproach (community/equitable), settlementAgreementSigned, financialDisclosureFiled, spousalSupportRequested |
| service | serviceMethod (personal/acceptance/mail/publication/none), serviceDate, respondentResponded |
| decree | decreeEntered, decreeDate, nameRestorationRequested, nameToRestore, certificateRequested |

Conventions: `''` for unanswered text and enum fields, `null` for unanswered
numbers and dates.

## 3. State rules

`STATE_RULES` holds, per state: state residency months, county residency days,
waiting period (months and days) and what it runs from (filing, service, or the
later of the two), separation days for a contested no-fault ground, property
regime and whether the state has only no-fault grounds. Ten states are verified
(CA, NY, TX, FL, IL, PA, OH, WA, AZ, NV; table in `doc/index.md`). Any other
state uses `DEFAULT_RULE` (90-day domicile, no county rule, no waiting period)
and raises the medium flag `F-DIV-UNKNOWN-STATE-001`.

## 4. Classification

First match wins:

1. `not-yet-eligible`: state residency short, or county residency short, or a
   separation period short (contested no-fault only), or a decree dated before
   the earliest permitted decree date.
2. `incomplete`: a core field missing, or children with no custody plan or no
   guideline worksheet, or a fault ground in a no-fault-only state, or an
   uncontested case without a signed settlement agreement, or a decree entered
   with service never completed.
3. `ready-to-file`: otherwise.

`earliestDecreeDate` is the waiting period added to its base date; null when the
state has no waiting period or the base date is unset. `propertyRegime` is
`community`, `equitable` or `unknown`.

## 5. Flags

Independent of the class; sorted high, medium, low. Ids `F-DIV-<TOPIC>-NNN`.

| Priority | Flags |
| --- | --- |
| high | core details missing; state residency short; county residency short; separation short; fault ground unavailable; custody plan missing; child-support worksheet missing; UCCJEA home-state gap; decree without service; decree before the waiting period |
| medium | unknown state rule; separation date missing; property approach mismatch; financial disclosure missing; uncontested without agreement; military respondent not appeared (SCRA); service by publication |
| low | respondent not yet served; waiting period pending; name restoration incomplete; vital-records certificate not requested |

## 6. Verification

`bin/test-form united-states-divorce-petition`, `bin/test-personas` (ten
personas cover every class and every flag), `bin/test-engines`,
`bin/test-sql-apply`, `bin/test-examples-conformance`, `bin/test-e2e --html`,
Svelte `svelte-check` / `vitest` / lint, and `cargo test` against a scratch
Postgres.

## 7. Items to verify against primary sources

The Illinois six-month separation presumption and its waiver, the Florida
20-day period (Fla. Stat. 61.19), and the Pennsylvania six-month residency come
from secondary sources. Residency and waiting periods change by statute and by
county rule; a clerk or attorney must confirm them.
