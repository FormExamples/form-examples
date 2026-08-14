# Mental Health Act Assessment

A formal assessment under the **UK Mental Health Act 1983** (as amended by the
Mental Health Act 2007) to determine whether a person with a mental disorder
should be **detained in hospital** for assessment or treatment, admitted
informally, or supported in the community. It records the coordinated assessment
by an **Approved Mental Health Professional (AMHP)** together with the required
medical recommendations from **two registered medical practitioners** (at least
one of whom is **Section 12 approved**), documents the **statutory criteria**
that must be satisfied, captures the **nearest relative / consultee** position,
and records the **recommended section** and the **outcome**.

This is a **legal and clinical documentation instrument**, not a numeric
severity score. Detention deprives a person of liberty, so the Act, its Code of
Practice, and the Human Rights Act 1998 require that every statutory criterion
and every required signatory be explicitly documented before an application can
be made. The engine therefore validates **legal completeness** — every element
the chosen section requires is present — and **classifies** the recommended
section and its urgency. It flags gaps (a missing second medical recommendation,
an absent Section 12 doctor, a criterion not met, or a least-restrictive /
human-rights concern) rather than producing a score.

## Scope and intended users

- **Setting:** hospital wards, emergency departments, section 136 suites, care
  homes, and community settings (a person's home) where an assessment for
  possible detention is convened.
- **Users:** **Approved Mental Health Professionals (AMHPs)** who coordinate the
  assessment and make the application; **Section 12 approved doctors** and other
  **registered medical practitioners** who provide medical recommendations;
  **psychiatrists** and duty consultants; and, for the holding powers,
  responsible clinicians and nurses of the prescribed class.
- **Subjects:** any person (adult or, with appropriate safeguards, a young
  person) being assessed for possible detention under Part II or held under a
  holding or place-of-safety power.
- **Not for:** informal capacity-based decisions under the Mental Capacity Act
  2005, Deprivation of Liberty Safeguards / Liberty Protection Safeguards
  authorizations, or as a substitute for the statutory forms prescribed by the
  Mental Health (Hospital, Guardianship and Treatment) (England) Regulations —
  this instrument documents and validates the assessment; the statutory forms
  remain the legal record.

## Sections and statutory criteria

The form records **which section** is recommended and validates the criteria and
signatories that section requires.

| Section | Purpose | Duration | Applicant / signatories |
| --- | --- | --- | --- |
| **2** | Admission for **assessment** | up to 28 days | AMHP (or nearest relative) application + **two** medical recommendations (one s12) |
| **3** | Admission for **treatment** | up to 6 months, renewable | AMHP (or nearest relative) application + **two** medical recommendations (one s12); appropriate medical treatment must be available |
| **4** | **Emergency** admission for assessment | up to 72 hours | AMHP (or nearest relative) + **one** medical recommendation; used only where urgency prevents obtaining a second |
| **5(2)** | Doctor's **holding power** over an informal in-patient | up to 72 hours | the registered clinician (or nominee) in charge of the patient's treatment |
| **5(4)** | Nurse's **holding power** over an informal in-patient | up to 6 hours | a nurse of the prescribed class (mental health / learning disability) |
| **136** | **Police** removal from a public place to a place of safety | up to 24 hours | a constable; assessment by an AMHP + a doctor at the place of safety |

**Statutory criteria** (recorded as met / not met / not applicable, each with
supporting evidence):

1. **Mental disorder** — the person is suffering from a mental disorder of a
   nature or degree that warrants the proposed action.
2. **Risk** — detention is necessary in the interests of the person's own
   **health**, their own **safety**, or **for the protection of other people**.
3. **Least-restrictive alternative** — the objective cannot be achieved in a
   less restrictive way (informal admission, community treatment, or care under
   the Mental Capacity Act).
4. **Appropriate medical treatment available** — for **Section 3** (and CTO
   recall / renewal), appropriate medical treatment must be available to the
   person.

## Completeness / validity and classification model

The engine is a **documentation-completeness and classification engine**, not a
numeric scorer. It produces:

- **Completeness status** — **`valid`** when every element the recommended
  section requires is documented (all applicable statutory criteria marked met
  with evidence, and all required signatories present), or **`incomplete`** when
  any required element is missing. This status governs whether the assessment is
  ready to support a lawful application; it is **not** a clinical judgement that
  detention is warranted.
- **Recommended section class** — one of `section-2`, `section-3`, `section-4`,
  `section-5-2`, `section-5-4`, `section-136`, or `none` (informal admission or
  community outcome), derived from the assessment and validated against that
  section's required signatories and criteria.
- **Urgency class** — `routine`, `urgent`, or `emergency`, driven by the section
  and the recorded risk (emergency powers — s4, s5, s136 — and imminent
  risk-to-others classify as `emergency`).
- **Flagged issues** — see [`spec/index.md`](spec/index.md) §5; each carries a
  priority. Key flags: **criteria not met**, **missing second medical
  recommendation**, **Section 12 doctor absent**, **least-restrictive / human
  rights concern**, **nearest relative not consulted**, and **medical
  recommendations out of statutory time limits**.

The output is a structured, signable assessment summary that names the
recommended section, the completeness status, the criteria evidence, the
signatories, and the outcome — suitable for the clinical record and for
transcription onto the prescribed statutory forms.

## Assessment steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessment date and time, location / setting, referral source, reason for assessment |
| 2 | Person identification | person identifier, age band, sex, first language / interpreter need |
| 3 | Assessing professionals | AMHP name and approval details; doctor 1 (name, GMC, **Section 12** approved yes/no, examination time); doctor 2 (as doctor 1); prior acquaintance with the patient |
| 4 | Mental disorder | presence and nature/degree of mental disorder; presentation; supporting evidence |
| 5 | Risk | risk to own health, risk to own safety, risk to others; evidence for each; imminence |
| 6 | Least-restrictive alternative | alternatives considered (informal admission, community, MCA); why they are insufficient |
| 7 | Appropriate treatment | for s3: appropriate medical treatment available and where; treatment plan summary |
| 8 | Nearest relative / consultees | nearest relative identified, consulted, objection; AMHP consultation record |
| 9 | Recommended section and outcome | recommended section; outcome (detain under section / informal admission / community); bed and conveyance; free-text clinical and legal note |
| 10 | Summary and validation | computed completeness status, recommended section class, urgency, flagged issues, signatory checklist |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The validation / classification engine is pure (no side effects, no I/O) and
  unit-tested.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — this is a
  documentation and legal-completeness instrument; the output supports
  professional and legal decision-making rather than diagnosing or determining
  treatment automatically.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*
- **Mental Health Act 1983 (as amended 2007)** and the **Mental Health Act Code
  of Practice** (2015) are the governing legal framework; the **Human Rights Act
  1998** (Article 5, right to liberty) and the **Mental Capacity Act 2005**
  are directly relevant. This tool documents and validates the assessment; the
  statutory forms prescribed under the Act remain the definitive legal record.

## Legal and clinical references

- Mental Health Act 1983 (as amended by the Mental Health Act 2007).
- Department of Health. *Mental Health Act 1983: Code of Practice* (2015).
- Mental Health (Hospital, Guardianship and Treatment) (England) Regulations
  2008 — prescribed statutory forms.
- Reference Guide to the Mental Health Act 1983 (Department of Health).
- Human Rights Act 1998, Article 5 (right to liberty and security).

## Verify

```sh
bin/test-form mental-health-act-assessment
```
