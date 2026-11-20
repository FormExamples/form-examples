# United Kingdom Last Will and Testament — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour: update
the spec before changing code.

Slug: `united-kingdom-last-will-and-testament`

## 1. Purpose

A will-drafting documentation instrument for England and Wales. It captures the
testator, the estate, the executors, the beneficiaries and their percentage
shares, guardians and funeral wishes, and the Wills Act 1837 signing and
witnessing facts. Its engine is a **completeness and validity engine**, not a
numeric score: it classifies the will record as **Valid** (ready to execute),
**Incomplete**, or **Formality risk**, and raises flagged issues. It is
documentation support, **not legal advice**: it cannot confirm that a will is
valid and does not replace a solicitor or a regulated will writer.

Full design description: [`index.md`](../index.md). Sources and citations:
[`doc/index.md`](../doc/index.md).

## 2. Scope

In scope: the schema, validation engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Axum JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: drafting will wording, probate, tax computation, trusts, privileged wills,
Scottish and Northern Irish law, hosted deployment, authentication.

## 3. Data model

A single logical will record. Fields default to `''` (text/enum) or `null`
(numeric/date) when unanswered. camelCase here; snake_case columns in `sql/`.

**Testator.**

| Field | Type | Notes |
| --- | --- | --- |
| `testatorName` | text | full legal name |
| `dateOfBirth` | date | must be 18 or over (s.7) |
| `testatorAddress` | text | |
| `domicile` | enum | england-wales / scotland / northern-ireland / other |
| `maritalStatus` | enum | single / married / civil-partnership / cohabiting / divorced-or-dissolved / widowed |
| `marriageExpected` | yes/no | marriage revokes a will unless made in contemplation of it (s.18) |
| `contemplationOfMarriageClause` | yes/no | the will says it is made in contemplation of that marriage |
| `hasMentalCapacity` | yes/no | testamentary capacity |
| `madeVoluntarily` | yes/no | no undue influence |
| `previousWill` | enum | none / exists / unsure |
| `revocationClause` | yes/no | revokes all earlier wills and codicils |

**Estate.**

| Field | Type | Notes |
| --- | --- | --- |
| `estateValueBand` | enum | under-325k / 325k-500k / 500k-2m / over-2m |
| `ownsHome` | yes/no | |
| `homeToDirectDescendants` | yes/no | residence nil-rate band |
| `charityGiftPercent` | numeric | share of net estate to charity; 10% or more earns the 36% rate |
| `estateOtherJurisdictions` | yes/no | property outside England and Wales |
| `otherJurisdictionsDetail` | text | |
| `specificGiftsNotes` | text | |

**Executors.** `executorFirstName`, `executorFirstRelationship`,
`executorSecondName`, `executorSecondRelationship` (text);
`executorsAdultConfirmed` (yes/no).

**Beneficiaries.** For each of four slots `First`, `Second`, `Third`, `Fourth`:
`beneficiary<Slot>Name` (text), `beneficiary<Slot>Relationship` (enum:
spouse-or-civil-partner / unmarried-partner / child / grandchild /
other-relative / friend / charity / other), `beneficiary<Slot>SharePercent`
(numeric, percentage of the residuary estate), `beneficiary<Slot>IsMinor`
(yes/no), `beneficiary<Slot>HasTrustee` (yes/no). Plus `residuaryClause`
(yes/no) and `dependantsConsidered` (yes/no, Inheritance Act 1975 claims).

**Family.** `hasChildrenUnder18` (yes/no), `guardianName` (text),
`funeralWishes` (enum: burial / cremation / no-preference / other),
`funeralWishesNote` (text).

**Execution.** `executionStatus` (enum draft / signed), `dateOfWill` (date),
`willInWriting`, `testatorSigned`, `witnessesPresentTogether`,
`witnessesSigned` (yes/no), and for witnesses `First` and `Second`:
`witness<Slot>Name` (text), `witness<Slot>Over18` (yes/no),
`witness<Slot>IsBeneficiaryOrSpouse` (yes/no); `drafterNote` (text).

**Derived (never stored as input).** `validityClass`, `formalityRisk`,
`sharesTotalPercent`, `witnessCount`, `flaggedIssues[]`.

## 4. Validity algorithm

Pure function, no I/O. `validityClass` takes the first matching class in order;
flagged issues are always computed in full.

```
named witnesses  = witness slots with a non-empty name
named beneficiaries = beneficiary slots with a non-empty name
sharesTotalPercent = sum of the named beneficiaries' shares, 2 decimals
age = whole years between dateOfBirth and (dateOfWill if set, else now)

formalityRisk =
     age < 18
  || hasMentalCapacity == 'no' || madeVoluntarily == 'no'
  || domicile in {scotland, northern-ireland, other}
  || (marriageExpected == 'yes' && contemplationOfMarriageClause != 'yes')
  || any named witness with over18 == 'no'
  || any named witness with isBeneficiaryOrSpouse == 'yes'
         or whose normalised name equals a beneficiary's
  || (executionStatus == 'signed' && count(named witnesses) < 2)
  || (executionStatus == 'signed' &&
        (willInWriting != 'yes' || testatorSigned != 'yes' ||
         witnessesPresentTogether != 'yes' || witnessesSigned != 'yes'))

incomplete =
     testatorName empty || dateOfBirth null
  || hasMentalCapacity != 'yes' || madeVoluntarily != 'yes'
  || no executor named
  || no beneficiary named
  || residuaryClause != 'yes'
  || (beneficiaries named && |sharesTotalPercent - 100| > 0.005)
  || any named beneficiary with isMinor == 'yes' && hasTrustee != 'yes'

validityClass =
    formalityRisk -> 'formality-risk'
    incomplete    -> 'incomplete'
    otherwise     -> 'valid'
```

- `formality-risk` takes precedence over `incomplete`.
- A draft with no witnesses named is not a formality risk; witnesses only
  matter for a will recorded as `signed`, except a witness who is a beneficiary.
- `valid` never means legally valid; the report says so.

## 5. Flagged issues

Emitted independently of the class, each with a priority. Ids and categories
mirror the `grade_flag` table.

| Id | Category | Priority | Fires when |
| --- | --- | --- | --- |
| `F-TESTATOR-UNDER-18-001` | testator-eligibility | high | age under 18 |
| `F-CAPACITY-001` | capacity-or-voluntariness | high | capacity or free choice denied |
| `F-DOMICILE-001` | other-jurisdictions | high | domicile not England and Wales |
| `F-MARRIAGE-REVOCATION-001` | marriage-revocation | high | marriage expected, no contemplation clause |
| `F-WITNESS-UNDER-18-001` | witness-formalities | high | a named witness under 18 |
| `F-WITNESS-BENEFICIARY-001` | witness-is-beneficiary | high | witness or spouse is a beneficiary |
| `F-WITNESSES-001` | witness-formalities | high | signed with fewer than two witnesses |
| `F-EXECUTION-001` | witness-formalities | high | signed but a s.9 step not confirmed |
| `F-NO-EXECUTOR-001` | no-executor | high | no executor |
| `F-NO-BENEFICIARY-001` | no-beneficiary | high | no beneficiary |
| `F-RESIDUARY-001` | residuary-clause-missing | high | residuary clause not confirmed |
| `F-SHARES-001` | shares-not-100 | high | shares do not total 100% |
| `F-MINOR-TRUSTEE-001` | minor-beneficiary-no-trustee | high | beneficiary under 18, no trustee |
| `F-CAPACITY-UNCONFIRMED-001` | capacity-or-voluntariness | medium | capacity or free choice not yes |
| `F-DETAILS-001` | incomplete-details | medium | name or date of birth missing |
| `F-PARTNER-001` | partner-not-provided-for | medium | cohabiting, partner not a beneficiary |
| `F-OTHER-JURISDICTIONS-001` | other-jurisdictions | medium | property abroad |
| `F-PREVIOUS-WILL-001` | previous-will | medium | earlier will, no revocation clause |
| `F-GUARDIAN-001` | guardian-not-named | medium | children under 18, no guardian |
| `F-INHERITANCE-ACT-001` | inheritance-act-provision | medium | claims not considered |
| `F-WITNESSES-PLAN-001` | witness-formalities | low | draft, fewer than two witnesses named |
| `F-EXECUTOR-ADULT-001` | no-executor | low | executor named, adult/willing not confirmed |
| `F-INHERITANCE-TAX-001` | inheritance-tax | low | estate above the nil-rate band |
| `F-FUNERAL-001` | other | low | funeral wishes not recorded |
| `F-DATE-001` | incomplete-details | low | signed, no date of will |

Flags are stable-sorted high, then medium, then low.

**Process note (not scored).** Sign in front of two independent adult witnesses
who are present together and who then each sign; do not alter the will
afterwards; store it safely; change it only by codicil or a new will signed the
same way; review it after marriage, divorce, a birth or a death.

## 6. Inputs and outputs

**Input.** A typed will object whose shape mirrors the SQL schema in `sql/`.

**Output.** A validation object emitted by the engine:

```ts
{
  validityClass: 'valid' | 'incomplete' | 'formality-risk';
  formalityRisk: boolean;
  sharesTotalPercent: number;
  witnessCount: number;
  flaggedIssues: FlaggedIssue[];
}
```

Every report states the disclaimer: documentation support, not legal advice.

## 7. Artefacts

| Subdirectory | Role |
| --- | --- |
| `sql` | source of truth (`testator`, the will, and a grade/rule/flag triad) |
| `xml` | generated |
| `fhir` | generated |
| `protobuf` | generated |
| `openapi` | generated |
| `front-end-with-html` | HTML + Lily (wizard + dashboard) |
| `front-end-with-svelte` | SvelteKit (wizard + dashboard) |
| `back-end-with-axum` | Rust + Axum JSON API |
| `back-end-with-axum-setup` | generated scaffold script |
| `examples/personas.json` | eleven personas pinning the engine |

Generated artefacts are never hand-edited; re-run the generators in
[`/AGENTS.md`](../../../AGENTS.md) §Tools after schema changes.

## 8. Acceptance criteria

- `bin/test-form united-kingdom-last-will-and-testament` exits cleanly.
- The engine is pure and unit-tested: each validity class, the
  formality-over-incomplete precedence, the witness rules (count, age,
  beneficiary by answer and by name), the shares total, the minor-trustee rule,
  and the persona oracle.
- The HTML front-end conforms to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-end conforms to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)) and
  passes `pnpm check`, `pnpm test`, `pnpm lint` and `pnpm format:check`.
- The Rust crate builds and `cargo test` passes against a PostgreSQL database.
- Every report carries the not-legal-advice disclaimer.

## 9. Compliance

UK GDPR and the Data Protection Act 2018; WCAG 2.2 AA; ISO/IEC/IEEE
26514:2022. The form is written to the law of England and Wales (Wills Act
1837; Inheritance (Provision for Family and Dependants) Act 1975;
Administration of Estates Act 1925) and the GOV.UK "Make a will" guidance. It is
not a medical device and not a regulated legal service.

## 10. References

- [GOV.UK — Make a will](https://www.gov.uk/make-will)
- [GOV.UK — Make sure your will is legal](https://www.gov.uk/make-will/make-sure-your-will-is-legal)
- [GOV.UK — Inheritance Tax](https://www.gov.uk/inheritance-tax)
- [Wills Act 1837](https://www.legislation.gov.uk/ukpga/Will4and1Vict/7/26)
- [Inheritance (Provision for Family and Dependants) Act 1975](https://www.legislation.gov.uk/ukpga/1975/63)
- [Law Society — Wills and probate](https://www.lawsociety.org.uk/for-the-public/common-legal-issues/wills-and-probate)

- [`index.md`](../index.md) — form description and validity model
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form united-kingdom-last-will-and-testament
bin/test-personas united-kingdom-last-will-and-testament
```
