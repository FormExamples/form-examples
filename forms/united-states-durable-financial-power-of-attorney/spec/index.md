# United States Durable Financial Power of Attorney — specification

Living domain spec. Update it before changing code. Slug:
`united-states-durable-financial-power-of-attorney`.

## 1. Purpose

Check, before signing, whether a durable power of attorney for property and
finances is ready to execute under the governing state's law. Federal law has no
general POA statute; the baseline is the Uniform Power of Attorney Act (2006)
and a `STATE_RULES` table for eight states. Not legal advice; the statute, the
notary, and a court decide. See [`../doc/`](../doc/index.md).

## 2. Scope

In scope: the schema, the validity engine, two front-ends (wizard and dashboard,
HTML and SvelteKit), and the Axum JSON API. Out of scope: health-care directives,
guardianship, trusts, e-signature or remote-notarization platform integration,
IRS Form 2848 contents.

## 3. Data model

Sections and fields (camelCase; SQL columns are snake_case). Unanswered text and
enum fields are `''`; unanswered numeric and date fields are `null`. `yn` means
`yes` / `no` / `''`.

**principal**: `principalName` text; `dateOfBirth` date; `state` 2-letter US
state or `''`; `principalAddress` text; `capacityConfirmed` yn.

**instrument**: `durableStatement` yn (the document says authority survives
incapacity, or the state default applies and is not negated); `effectiveness`
`immediate` / `springing` / `''`; `springingTrigger`
`physician-certification` / `named-person-declaration` / `court-determination` /
`''`; `statutoryNoticeIncluded` yn.

**agents**: `agentName`; `agentRelationship` `spouse` / `child` / `other-family` /
`friend` / `professional` / `financial-institution` / `''`; `agentIsAdult` yn
(an individual 18 or older, or a qualifying institution); `agentSignedAcknowledgment`
yn; `successorAgentName`; `coAgentsMode` `sole` / `jointly` / `independently` /
`''`; `compensation` `none` / `reasonable` / `fixed` / `''`; `compensationAmount`
number or null (annual USD).

**authority**: general grants, each yn: `grantBanking`, `grantRealEstate`,
`grantInvestments`, `grantBusiness`, `grantInsurance`, `grantTaxMatters`,
`grantBenefits`, `grantRetirement`, `grantClaims`, `grantPersonalProperty`. Hot
powers, each yn: `hotCreateTrust`, `hotGift`, `hotSurvivorship`, `hotBeneficiary`,
`hotDelegate`, `hotAnnuityWaiver`, `hotDisclaim`. `hotPowersInitialed` yn;
`giftLimitType` `annual-exclusion` / `fixed-amount` / `unlimited` / `none` / `''`;
`giftLimitAmount` number or null; `selfGiftingAllowed` yn.

**execution**: `notaryArranged` yn; `witnessCount` number or null (witnesses other
than the notary); `witnessIsAgent` yn (any witness is an agent or successor).

**acceptance**: `usedForRealEstate` yn; `bankFormCompleted` `yes` / `no` /
`not-needed` / `''`; `form2848Status` `filed` / `not-filed` / `not-needed` / `''`.

**Derived** (never input): `validityClass`, `governingState`,
`executionRiskIndicated`, `flaggedIssues[]`.

## 4. Classification algorithm

Pure function, no I/O. First match wins.

```
rule = STATE_RULES[state] or DEFAULT          # unknown or blank state: DEFAULT
executionRisks(d) = any of:
  notaryDeficient   : notaryArranged == 'no' and (rule.notary == 'required'
                      or usedForRealEstate == 'yes'
                      or (rule.notary == 'either' and effectiveWitnesses < 2))
  witnessesShort    : rule.witnesses > 0 and witnessCount != null
                      and effectiveWitnesses < rule.witnesses
                      and not (rule.notary == 'either' and notaryArranged == 'yes')
  witnessIsAgent    : witnessIsAgent == 'yes' and rule.witnesses > 0
  springingBanned   : effectiveness == 'springing' and rule.springing == 'prohibited'
  notDurable        : durableStatement == 'no'
  capacityMissing   : capacityConfirmed == 'no'
  hotNotInitialed   : rule.initials and any hot power == 'yes' and hotPowersInitialed == 'no'
  agentIneligible   : agentIsAdult == 'no'
  agentSignatureNY  : rule.agentSignature == 'effectiveness' and agentSignedAcknowledgment == 'no'
effectiveWitnesses = (witnessCount or 0) + (rule.notaryCountsAsWitness and notaryArranged == 'yes' ? 1 : 0)

incomplete(d) = any of: principalName, state, agentName blank; effectiveness,
  durableStatement, capacityConfirmed, notaryArranged unanswered; no grant == 'yes';
  effectiveness == 'springing' with springingTrigger blank

class = executionRisks ? 'execution-risk' : incomplete ? 'incomplete' : 'ready-to-execute'
```

Unanswered items never create an execution risk; they create `incomplete`.
`governingState` is the state name from the rule, or `Uniform default (verify)`.

## 5. Flagged issues

Ids `F-...-001`; priority high, medium, low; ordered high, medium, low, stable.

| Id | Priority | Category | Fires when |
| --- | --- | --- | --- |
| F-NOTARIZATION-REQUIRED-001 | high | execution-formality | notaryDeficient |
| F-WITNESSES-SHORT-001 | high | execution-formality | witnessesShort |
| F-WITNESS-IS-AGENT-001 | high | execution-formality | witnessIsAgent |
| F-SPRINGING-PROHIBITED-001 | high | effectiveness | springingBanned |
| F-DURABILITY-LANGUAGE-001 | high | effectiveness | notDurable |
| F-CAPACITY-NOT-CONFIRMED-001 | high | execution-formality | capacityMissing |
| F-HOT-POWERS-NOT-INITIALED-001 | high | authority-scope | hotNotInitialed |
| F-AGENT-NOT-ELIGIBLE-001 | high | agent | agentIneligible |
| F-AGENT-SIGNATURE-REQUIRED-001 | high (NY) / medium (PA) | agent | rule needs agent signature and it is `no` |
| F-REAL-ESTATE-NOT-RECORDABLE-001 | high | acceptance | usedForRealEstate yes and notaryArranged no |
| F-GIFT-AUTHORITY-UNLIMITED-001 | medium | gifting | hotGift yes and giftLimitType unlimited |
| F-GIFT-LIMIT-UNDEFINED-001 | medium | gifting | hotGift yes and giftLimitType none or blank |
| F-SELF-GIFTING-001 | medium | gifting | selfGiftingAllowed yes |
| F-SPRINGING-NO-DETERMINER-001 | medium | effectiveness | springing and trigger blank |
| F-NO-SUCCESSOR-AGENT-001 | medium | agent | successorAgentName blank |
| F-IRS-FORM-2848-001 | medium | tax-representation | grantTaxMatters yes and form2848Status not filed or not-needed |
| F-STATUTORY-NOTICE-MISSING-001 | medium | execution-formality | rule.notice and statutoryNoticeIncluded no |
| F-STATE-RULE-VERIFY-001 | medium | jurisdiction | state blank or not in the table |
| F-BANK-ACCEPTANCE-001 | low | acceptance | bankFormCompleted no |
| F-COMPENSATION-UNDEFINED-001 | low | agent | compensation blank |
| F-CO-AGENTS-UNDEFINED-001 | low | agent | coAgentsMode blank |
| F-HOT-POWER-DEFAULT-DENY-001 | low | authority-scope | no hot power answered yes: advisory that gifting, trusts, and beneficiary changes are not authorized |

Fired rules (`R-...`) are the executionRisks and incompleteness reasons, written
to the `_grade_rule` table with a dimension.

## 6. Inputs and outputs

```ts
{ validityClass: 'ready-to-execute' | 'incomplete' | 'execution-risk';
  governingState: string; executionRiskIndicated: boolean;
  firedRules: {ruleId, dimension, category, description}[];
  flaggedIssues: FlaggedIssue[] }
```

## 7. Artefacts

| Subdirectory | Role |
| --- | --- |
| `sql` | source of truth |
| `xml`, `fhir`, `protobuf`, `openapi` | generated |
| `front-end-with-html`, `front-end-with-svelte` | wizard + dashboard |
| `back-end-with-axum`, `back-end-with-axum-setup` | Axum JSON API, generated script |

## 8. Acceptance criteria

- `bin/test-form united-states-durable-financial-power-of-attorney` passes.
- The engine is pure and unit-tested; personas cover every class and flag.
- Both front-ends pass their Lily contract checks, `pnpm check`, tests, lint.
- The Axum crate builds and `cargo test` passes against a scratch Postgres.

## 9. Compliance

Administrative documentation aid; not a medical device and not legal advice. The
repository baseline in [`/AGENTS.md`](../../../AGENTS.md) applies.

## 10. References

See [`../doc/upoaa-framework.md`](../doc/upoaa-framework.md),
[`../doc/state-rules.md`](../doc/state-rules.md) (statutes read, with
confidence), and [`../doc/irs-form-2848.md`](../doc/irs-form-2848.md).
Uniform Law Commission, *Uniform Power of Attorney Act (2006)*.

## 11. Verify

```sh
bin/test-form united-states-durable-financial-power-of-attorney
```
