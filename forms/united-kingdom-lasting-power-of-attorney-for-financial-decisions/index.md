# United Kingdom Lasting Power of Attorney for Financial Decisions

A digital implementation of the Office of the Public Guardian (OPG) form
**LP1F — Lasting power of attorney for property and financial affairs**. The
LPA is a statutory deed under the Mental Capacity Act 2005 by which a donor
("the donor") appoints one or more attorneys to make decisions about their
property and financial affairs. Once registered by the OPG it is the
legal instrument that lets attorneys run bank accounts, sell property,
manage investments, claim benefits, and pay bills on behalf of the donor.

This project captures the LP1F deed, the four LPC continuation sheets, and
the OPG registration application (sections 12–15 of LP1F) as a single-page,
15-step wizard. The output is a structured record that can be exported as
PDF for wet-signature, FHIR R5 Bundle for health-record integration where
relevant, XML / Protobuf / TypeSpec for system-to-system exchange, and a
validation report flagging legal blockers and risk-of-failure conditions
before the deed is signed or sent for registration.

## Source

- **Form:** LP1F — Lasting power of attorney for property and financial
  affairs (version 08.25, October 2025).
- **Issuing authority:** Office of the Public Guardian (OPG), an executive
  agency of the UK Ministry of Justice.
- **Statutory basis:** Mental Capacity Act 2005, Part 1 and Schedules 1–4;
  the Lasting Powers of Attorney, Enduring Powers of Attorney and Public
  Guardian Regulations 2007 (SI 2007/1253) as amended.
- **Code of practice:** Mental Capacity Act 2005 Code of Practice (TSO 2007).
- **Online service:** <https://www.gov.uk/power-of-attorney>.
- **Reference pack:** `20260420-LPA-Finance-Complete-Pack/` (LP1F form,
  LP12 guide, LP3 notify-people form, LPC continuation sheets, LPA120A
  reduced-fee form).

## Scope and intended users

- **Setting:** any adult (≥ 18 years) with mental capacity to make their own
  decisions wishes to appoint attorneys to manage their finances now or in
  the future. Used in solicitors' offices, OPG-supported sessions, banks
  offering attorney-onboarding services, age-concern charities, NHS social
  care discharge planning, and direct-to-consumer.
- **Donor:** the person making the LPA — must be ≥ 18 and have mental
  capacity at the time of signing.
- **Attorneys:** 1 or more chosen people (or a single trust corporation) who
  will make decisions — must be ≥ 18, must have mental capacity, must not
  be bankrupt or subject to a debt relief order.
- **Replacement attorneys:** 0 or more people who step in when an original
  attorney can no longer act.
- **Certificate provider:** 1 person who certifies that the donor
  understands what they are doing and is not under pressure — either
  knowing the donor for ≥ 2 years personally, or having relevant
  professional skill (GP, solicitor, healthcare professional).
- **People to notify:** 0–5 people who will be notified when the OPG is
  asked to register the LPA, so they can object if they have concerns.
- **Witnesses:** present for the donor's signature and for each attorney's
  signature.
- **Applicant:** the donor or the attorneys, who apply to OPG to register
  the LPA.

## Validation engine

The LPA validator is the analogue of a scoring engine for an LPA: it does
not produce a clinical grade but a **registration-readiness band** and a
set of **fired rules** (statutory blockers) plus **additional flags**
(non-blocking warnings). The OPG returns LPAs for correction at a rate of
about 1 in 5; the validation engine's job is to drive that rate to zero
before the form is sent.

Outputs:

| Output | Type | Description |
| --- | --- | --- |
| `validityBand` | enum | `draft` / `ready_for_signing` / `partially_signed` / `fully_signed` / `ready_for_registration` / `submitted` / `registered` / `rejected` |
| `compositeRisk` | enum | `low` / `moderate` / `high` / `critical` — the chance that this LPA will fail in practice when needed |
| `firedRules` | array | statutory blockers that prevent registration |
| `additionalFlags` | array | non-blocking warnings (single attorney without replacement, no people-to-notify, very broad instructions, etc.) |

### Statutory blocker rules (fire ⇒ critical)

- **DonorUnderEighteen** — donor DOB indicates age < 18 at signing date.
- **DonorMustHaveCapacity** — donor signature missing or capacity flagged
  absent (s. 9(2)(c) MCA 2005).
- **AttorneyUnderEighteen** — any attorney's DOB indicates age < 18.
- **AttorneyBankruptOrDRO** — any attorney is bankrupt or subject to a debt
  relief order (s. 10(1)(b), s. 13(8) MCA 2005).
- **NoAttorneyAppointed** — section 2 has zero attorneys.
- **CertificateProviderIsAttorney** — certificate provider also appears as
  attorney or replacement attorney.
- **CertificateProviderRelatedToAttorney** — certificate provider is a
  spouse, civil partner, in-law, parent, child, sibling, or step-relative
  of the donor or any attorney (LPA Regulations 2007 reg. 8).
- **CertificateProviderIsCareHomeOwner** — certificate provider is an
  owner, manager, director, or employee of the care home where the donor
  lives (reg. 8).
- **CertificateProviderUnderEighteen** — certificate provider DOB indicates
  age < 18.
- **WitnessIsDonor** — donor's signature witness is the donor.
- **WitnessIsAttorney** — donor's signature witness is also an attorney or
  replacement attorney.
- **AttorneyWitnessIsDonor** — an attorney's signature witness is the
  donor.
- **JointlyButNoReplacement** — attorneys appointed "jointly" and no
  replacement attorney listed (LPA will fail entirely if any one attorney
  drops out — strongly discouraged).
- **MixedDecisionWithoutContinuationSheet** — "jointly for some decisions"
  selected without continuation sheet 2 listing which decisions.
- **PeopleToNotifyExceedsFive** — > 5 people to notify.
- **PersonToNotifyIsAttorney** — overlap between people-to-notify and
  attorneys / replacement attorneys (s. 6 LP1F restriction).
- **SigningOrderViolation** — section 10 signed before section 9, or
  section 11 signed before section 10 (regulation 9).
- **TrustCorporationMissingContinuationSheet4** — trust corporation
  appointed as attorney without LPC continuation sheet 4.
- **DonorCannotSignWithoutContinuationSheet3** — donor's signature is
  marked as "signed on behalf of donor" without LPC continuation sheet 3.
- **RegistrationApplicantInvalid** — applicant is neither donor nor any
  attorney, or attorneys are joint but not all have signed section 15.

### Additional flag rules (fire ⇒ moderate / high)

- **SingleAttorneyNoReplacement** — only one attorney appointed and no
  replacement (moderate; LPA fails if attorney loses capacity).
- **OnlyWhenNoCapacitySelected** — section 5 set to "only when I don't
  have mental capacity" (moderate; LPA much less useful in practice).
- **NoPeopleToNotify** — no people-to-notify chosen (low; reduces external
  safeguarding signal).
- **InstructionsLong** — instructions free-text > 500 characters (low;
  OPG may reject if not legally correct).
- **PreferencesEmpty** — preferences free-text empty and instructions
  empty (low; donor may want to leave guidance).
- **AttorneyEmailMissing** — any attorney without an email address (low).
- **EmergencyContactMissing** — no `prefersToBeContactedBy` set on
  section 13 (low).
- **ReducedFeeWithoutLPA120A** — reduced fee requested but no LPA120A
  evidence attachment (high; OPG cannot waive without evidence).
- **OverFourAttorneysNoContinuation** — more than 4 attorneys but no
  LPC continuation sheet 1 (high).

The composite risk is **max-grade** — any statutory blocker promotes the
LPA to `critical`; otherwise the worst flag wins.

## 15-step wizard

The form is one continuous single-page wizard (monorepo rule). 15 steps map
to sections 1–15 of the LP1F deed and registration application.

| # | Step | LP1F section | Key fields |
| --- | --- | --- | --- |
| 1 | Donor | 1 | title, first names, last name, other names, DOB, address, postcode, email |
| 2 | Attorneys | 2 | 1+ attorney cards: title, first names, last name, DOB, address, postcode, email, isTrustCorporation; "more than 4" flag (uses LPC sheet 1) |
| 3 | How attorneys make decisions | 3 | `singleAttorney` / `jointlyAndSeverally` / `jointly` / `mixed` (with continuation-sheet-2 text for `mixed`) |
| 4 | Replacement attorneys | 4 | 0+ replacement cards (same shape as attorneys); optional "when and how" override (uses LPC sheet 2) |
| 5 | When attorneys can act | 5 | `asSoonAsRegistered` / `onlyWhenNoCapacity` |
| 6 | People to notify | 6 | 0–5 cards: title, first names, last name, address, postcode |
| 7 | Preferences and instructions | 7 | preferences text (≤ 2000 chars); instructions text (≤ 2000 chars) |
| 8 | Legal rights | 8 | acknowledgement that the donor has read the legal-rights statement |
| 9 | Donor signature | 9 | donor signature blob, date signed, plus witness: name, address, postcode, signature, date |
| 10 | Certificate-provider signature | 10 | certificate provider: title, names, address, postcode, DOB, knownAsFriend / knownAsProfessional, signature, date, all eligibility confirmations |
| 11 | Attorney signatures | 11 | for each attorney + replacement: signature, date, witness {name, address, postcode, signature} |
| 12 | Applicant | 12 | `donor` / `attorneys` + per-applicant name and DOB |
| 13 | Who receives the LPA | 13 | `donor` / `attorney` / `other` (name + address); contact: post, phone, email, Welsh |
| 14 | Application fee | 14 | `card` (+ phone) / `cheque`; reducedFeeRequested; repeatApplication + caseNumber |
| 15 | Registration signature | 15 | per applicant: signature, date |

Each step is rendered side-by-side with its inline legal restrictions and
its corresponding LP12 Guide reference (part A1 … B5).

## Output

- **HTML preview** — section-by-section review of every field on a single
  printable page.
- **PDF** — typeset replica of LP1F + LPC continuation sheets via
  `pdfmake` server-side rendering, with embedded signatures and witness
  blocks.
- **JSON** — canonical `Lpa` document for storage and machine processing.
- **FHIR R5 Bundle** — `Consent` + `Patient` + `RelatedPerson` resources
  enabling integration with NHS Digital and hospital EHRs where the LPA is
  legally relevant to clinical decision-making (banking access, care-home
  fees, NHS continuing-healthcare top-ups).
- **XML + DTD** — archival representation with one XML / DTD pair per SQL
  table.
- **Protocol Buffers** — `.proto` schemas for system-to-system exchange.
- **TypeSpec** — single-source schema definitions.
- **CSV / TSV** — import/export of one row per LPA for case-management
  systems.
- **Validation report** — fired rules and additional flags with priority,
  statutory citation, and remediation hint.

## Directory structure

```
united-kingdom-lasting-power-of-attorney-for-financial-decisions/
  index.md                                              # this file
  AGENTS.md                                             # agent instructions
  plan.md                                               # implementation roadmap
  tasks.md                                              # task tracking
  doc/                                                  # documentation
  20260420-LPA-Finance-Complete-Pack/                   # source PDFs (LP1F, LP12, LP3, LPC, LPA120)
  sql-migrations/                                       # Liquibase Postgres migrations
  xml-representations/                                  # XML + DTD per SQL table
  fhir-r5/                                              # FHIR HL7 R5 JSON resources
  protobuf/                                             # Protobuf .proto schemas
  typespec/                                             # TypeSpec schemas
  front-end-form-with-html/                             # static single-page HTML wizard
  front-end-form-with-svelte/                           # SvelteKit single-page wizard
  front-end-dashboard-with-html/                        # review dashboard (HTML table)
  front-end-dashboard-with-svelte/                      # review dashboard (SVAR Grid)
  back-end-with-loco/                # Rust backend + server-rendered UI
  back-end-with-loco-setup           # `cargo loco generate scaffold` setup script
```

## Legal references

- Mental Capacity Act 2005, c. 9 — Part 1 (lasting powers of attorney),
  Schedule 1 (formal requirements), Schedule 4 (enduring powers of
  attorney transition).
- The Lasting Powers of Attorney, Enduring Powers of Attorney and Public
  Guardian Regulations 2007 (SI 2007/1253), as amended.
- Mental Capacity Act 2005 Code of Practice (TSO 2007).
- Powers of Attorney Act 2023, c. 22 (modernisation of registration —
  partially in force).
- Office of the Public Guardian — *Making and registering your lasting
  power of attorney: a guide* (LP12, August 2025).
- Office of the Public Guardian — *Form LP1F: Lasting power of attorney
  for property and financial affairs* (October 2025).
- Office of the Public Guardian — *Form LP3: Notice of intention to apply
  for registration of a lasting power of attorney*.
- Office of the Public Guardian — *Form LPC: LPA continuation sheets 1–4*.

## Compliance

- MDCG 2019-11 Rev.1 — this form is **not** a medical device. It is an
  administrative legal-deed builder and is out of scope of EU MDR.
- UK General Data Protection Regulation 2018 — donor and attorney
  identification, addresses, and email addresses are personal data; the
  certificate provider's professional details may be special-category data;
  retention follows OPG's published policy (20 years after donor death).
- ISO/IEC/IEEE 26514:2022 — design and development of information for
  users — applied to the on-screen help and the printable PDF.
- WCAG 2.2 AA — the form is operable by donors with sensory, cognitive,
  and motor impairments; this is especially important because LPAs are
  often made when the donor is anticipating diminishing capacity.
- NCSC Cyber Essentials — handling of signatures and personal data.
- Welsh Language Act 1993 — the form supports Welsh-language correspondence
  via section 13.

## Verify

```sh
bin/test-form united-kingdom-lasting-power-of-attorney-for-financial-decisions
```
