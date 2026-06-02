# United Kingdom Lasting Power of Attorney for Health and Care Decisions

A digital implementation of the statutory **Lasting Power of Attorney for
Health and Welfare** (statutory form **LP1H**) under the **Mental Capacity
Act 2005** (England and Wales). The donor — or a solicitor, attorney, or
advocate acting on their behalf — completes a single-page **14-step wizard**
that captures every field of the paper LP1H form, applies a deterministic
statutory-validity engine, raises compliance flags, and emits a
registration-ready application bundle for the **Office of the Public
Guardian (OPG)**.

The output is an LPA instrument that, once signed and registered, lets one
or more named attorneys make health and welfare decisions on behalf of the
donor *after* the donor has lost the capacity to make those decisions
themselves.

## Scope and intended users

- **Jurisdiction:** England and Wales. Scotland uses a separate *Welfare
  Power of Attorney* under the **Adults with Incapacity (Scotland) Act
  2000**; Northern Ireland has no health-and-welfare LPA equivalent
  (Enduring Power of Attorney covers finances only).
- **Donor:** ≥ 18 years of age, with mental capacity to create the LPA at
  the time of signing (Mental Capacity Act 2005 s.9(2), s.10).
- **Attorneys:** 1 – 4 named attorneys, each ≥ 18 and with capacity. Up to
  4 replacement attorneys may be named.
- **Certificate provider:** an independent person who certifies the donor
  understands the LPA and is not under undue pressure. Either *skill-based*
  (registered solicitor, GP, registered social worker, registered nurse,
  IMCA, psychiatrist) or *knowledge-based* (known the donor personally for
  ≥ 2 years and not a family member, business partner, employee, or
  attorney).
- **Operators of this digital tool:** donors, solicitors, will writers,
  Age UK volunteers, NHS pre-admission staff, Independent Mental Capacity
  Advocates (IMCAs), Solicitors for the Elderly members.

## Key statutory features (England and Wales)

- An **LPA for Health and Welfare** can only be **used after** the donor
  has lost the capacity to make a particular decision *and* the LPA has
  been registered with the OPG (contrast with an LPA for Property and
  Financial Affairs, which can be used with the donor's consent).
- An LPA cannot override an **Advance Decision to Refuse Treatment (ADRT)**
  made by the donor while they had capacity, *unless* the ADRT was made
  before the LPA and the LPA expressly authorises the attorney to consent
  to or refuse the same treatment.
- Attorneys must act in the donor's **best interests** under MCA s.4 and
  follow the MCA's five statutory principles.
- An LPA for Health and Welfare only allows attorneys to give or refuse
  consent to **life-sustaining treatment** if the donor expressly opted
  in (Section 5, Option A).
- LPAs require registration with the OPG before they have legal effect.
  Registration fee is **£82** (2026) per LPA, with remission and exemption
  for low income.

## 14-step wizard

Completed as a single continuous single-page wizard. Each step is mapped
to a section of the paper LP1H form.

| # | Step | LP1H section | Key fields |
| --- | --- | --- | --- |
| 1 | Donor identification | s.1 | full name, any other names used, DOB, address, telephone, email, NHS number (optional) |
| 2 | LPA scope & activation | s.4–5 | jurisdiction confirmation (E&W), confirmation that the LPA only operates after registration **and** loss of capacity |
| 3 | Attorneys | s.2 | 1 – 4 attorneys: full name, DOB, address, telephone, relationship to donor |
| 4 | Attorney decision rules | s.3 | jointly **/** jointly and severally **/** jointly for some decisions and severally for others (list the joint-decision set) |
| 5 | Replacement attorneys | s.4 | 0 – 4 replacement attorneys (same fields as s.3); replacement-trigger conditions |
| 6 | Life-sustaining treatment | s.5 | Option A (attorneys may give or refuse consent) **or** Option B (donor reserves this decision) |
| 7 | Preferences | s.7 (Option A) | non-binding guidance on residence, contact, religion, food, end-of-life care |
| 8 | Instructions | s.7 (Option B) | binding constraints; must be lawful, possible, not contradict an ADRT |
| 9 | People to notify on registration | s.6 | 0 – 5 named recipients of notice of intention to register |
| 10 | Certificate provider | s.10 | full name, address, profession (if skill-based), years known (if knowledge-based), certificate statement |
| 11 | Donor signature & witness | s.9 | donor signature, signing date, witness name and address |
| 12 | Attorney signatures & witnesses | s.11 | each attorney signs *after* the donor and the certificate provider; signing date; witness name and address |
| 13 | Registration application (Part C) | LP1H Part C | applicant (donor / one attorney / all attorneys jointly), applicant signature, fee / remission / exemption |
| 14 | Validity summary | computed | completeness %, fired statutory rules, ambiguity flags, recommended next steps, OPG submission packet |

## Validity engine

A pure function `calculateLpaValidity(data: LpaApplication)` runs the
statutory checks in parallel and returns:

```ts
{
  validityStatus: 'ready-to-register' | 'needs-correction' | 'invalid';
  completenessScore: number;          // 0..100 percent of required fields populated
  firedRules: FiredRule[];            // statutory rules that triggered
  additionalFlags: AdditionalFlag[];  // ambiguity or risk warnings
  effectiveDate: string | null;       // earliest possible OPG submission date
}
```

The engine has no side effects, no network calls, no `Date.now()` inside
rules. Each rule has a stable identifier (`R-MCA-S9-AGE`, `R-MCA-CP-FAMILY`,
`R-MCA-LST-OPT`, …) so fired rules can be cited in audit logs and re-tested
across releases.

### Statutory rule catalogue

| Rule ID | Predicate | Severity | Source |
| --- | --- | --- | --- |
| `R-MCA-S9-AGE` | donor age ≥ 18 at signing | **fatal** | MCA 2005 s.9(2)(c) |
| `R-MCA-S10-CAP` | donor has capacity at signing (declared) | **fatal** | MCA 2005 s.9(2)(b) |
| `R-MCA-ATT-AGE` | every attorney age ≥ 18 | **fatal** | MCA 2005 s.10(1)(a) |
| `R-MCA-ATT-CAP` | every attorney has capacity | **fatal** | MCA 2005 s.10(1)(b) |
| `R-MCA-CP-FAM` | certificate provider not a family member of donor or attorney | **fatal** | LPA Regs 2007 Sch.1 Pt.2 |
| `R-MCA-CP-EMP` | certificate provider not a business partner or employee of donor or attorney | **fatal** | LPA Regs 2007 Sch.1 Pt.2 |
| `R-MCA-CP-ROUTE` | certificate provider qualifies via skill-based OR knowledge-based (≥ 2 years) route | **fatal** | LPA Regs 2007 Sch.1 Pt.2 |
| `R-MCA-ORDER` | sign-order: donor → certificate provider → attorneys | **fatal** | LPA Regs 2007 Sch.1 |
| `R-MCA-LST-CHOICE` | life-sustaining treatment option A or B selected and initialled | **fatal** | MCA 2005 s.11(7) |
| `R-MCA-NOTIFY-MAX` | ≤ 5 people to notify on registration | **fatal** | LPA Regs 2007 |
| `R-MCA-FEE` | registration fee or remission/exemption indicated | **fatal** | LPA Regs 2007 reg.6 |
| `R-MCA-INSTR-LAW` | instructions are lawful and possible | high | MCA 2005 s.9(4) |
| `R-MCA-INSTR-ADRT` | instructions do not contradict a known ADRT | high | MCA 2005 s.25 |
| `R-MCA-JOINT-COLLAPSE` | warn when *jointly* decision-rule selected with replacements named | medium | OPG guidance LP12 |
| `R-MCA-JOINT-MIXED-SCOPE` | when mixed decisions chosen, the joint-decision set must be listed | high | LPA Regs 2007 Sch.1 |
| `R-MCA-COP-PROHIBITED` | instructions do not authorise assisted dying or unlawful restraint | **fatal** | Suicide Act 1961; MCA 2005 |
| `R-MCA-WIT-NOT-ATT` | witness is not an attorney named in the same LPA | **fatal** | LPA Regs 2007 |
| `R-MCA-WALES` | Welsh-language form accepted for Welsh donors | informational | Welsh Language (Wales) Measure 2011 |

## Compliance flags

Computed independently of statutory rules. Examples:

- **Donor capacity concern** — answers suggest fluctuating capacity; refer
  to a capacity assessment under MCA s.2.
- **Coercion concern** — preferences or witness identity raise undue
  influence flag; signal to the certificate provider.
- **ADRT conflict** — donor's instructions overlap with an existing ADRT
  in the dataset (cross-form check).
- **Foreign domicile** — donor habitual residence outside E&W; LPA may
  still be valid but recommend solicitor review.
- **Solicitor recommended** — instructions are complex (e.g. religious
  dietary requirements interacting with life-sustaining-treatment refusal).
- **Replacement-attorney trigger ambiguous** — donor specified replacement
  conditions that are not enumerated by LP1H.
- **Bilingual donor** — donor first language Welsh or BSL; surface
  bilingual form path.

## Output

- **HTML report preview** of every field exactly as it appears on LP1H,
  with fired rules and flags annotated.
- **Downloadable PDF** of the LP1H form, OPG-submission-ready, generated
  with `pdfmake`.
- **FHIR R5 Bundle** with a `Consent` resource representing the LPA, a
  `RelatedPerson` per attorney, and `Practitioner` for the certificate
  provider.
- **XML** representation for archival in legacy practice-management
  systems.
- **JSON** export for OPG digital-LPA submission once *Powers of Attorney
  Act 2023* digital-signing provisions are commenced.

## Directory structure

```
united-kingdom-lasting-power-of-attorney-for-health-and-care-decisions/
  index.md                              # this file
  AGENTS.md                             # agent instructions
  plan.md                               # implementation roadmap
  tasks.md                              # task tracking
  doc/                                  # statutory references, OPG guidance
  sql-migrations/                       # Liquibase PostgreSQL migrations
  xml-representations/                  # XML + DTD per SQL table
  fhir-r5/                              # FHIR HL7 R5 JSON resources
  protobuf/                             # Protocol Buffers schemas
  typespec/                             # TypeSpec API definitions
  front-end-form-with-html/             # static single-page HTML wizard
  front-end-form-with-svelte/           # SvelteKit single-page wizard
  front-end-dashboard-with-html/        # review dashboard (HTML table)
  front-end-dashboard-with-svelte/      # review dashboard (SVAR Grid)
  back-end-with-loco/        # Rust backend + UI
  back-end-with-loco-new/    # Loco scaffold generator
```

## Statutory and regulatory references

- **Mental Capacity Act 2005** — primary statute defining LPAs in England
  and Wales. Sections 9–14 (creation, formalities), 22–23 (court powers
  over LPAs), 24–26 (advance decisions).
- **Mental Capacity Act 2005 Code of Practice** (2007, draft revision
  2022) — Chapter 7 on LPAs.
- **Lasting Powers of Attorney, Enduring Powers of Attorney and Public
  Guardian Regulations 2007** (SI 2007/1253), as amended by SI 2009/1884,
  SI 2015/899, SI 2024/367 — prescribes form LP1H content.
- **Powers of Attorney Act 2023** — modernises LPA creation, introduces a
  digital channel for OPG submission (commencement pending 2026).
- **Office of the Public Guardian** practice notes LP12 (decisions),
  LP12 *Decisions*, LP13 *Life-sustaining treatment*.
- **Court of Protection Rules 2017** — challenges to LPAs.
- **gov.uk/lasting-power-attorney** — citizen-facing guidance.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — administrative
  legal-document tool, **not** a medical device. The validity engine is
  decision-support, not clinical decision-support.
- UK Medical Devices Regulations 2002 — not in scope (administrative
  document).
- ISO/IEC/IEEE 26514:2022 — design and development of information for
  users.
- ICO UK GDPR — donor and attorney personal data (Article 9 — health data
  category).
- NHS Data Security and Protection Toolkit — when run within an NHS
  organisation.

## Verify

```sh
bin/test-form united-kingdom-lasting-power-of-attorney-for-health-and-care-decisions
```
