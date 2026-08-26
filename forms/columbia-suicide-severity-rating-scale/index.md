# Columbia Suicide Severity Rating Scale (C-SSRS)

A structured, evidence-based instrument for assessing suicide risk. It records
the **severity of suicidal ideation** on a five-point ordinal scale, the presence
of distinct categories of **suicidal behaviour**, and the **lethality** of any
actual attempt, then classifies the patient into a **Low / Moderate / High**
risk tier that drives a proportionate management response. The C-SSRS is a
status- and severity-classification instrument: it is **not** a summed
questionnaire score, and its output is a risk stratification, not a diagnosis.

The scale was developed by Posner and colleagues at Columbia University and is
widely adopted across mental-health, emergency, primary-care, and crisis
settings. The **screener** (triage) version is a short, plain-language set of
yes/no questions suitable for non-specialists; the **full** version adds
ideation-intensity sub-items and detailed behaviour and lethality coding for
clinical evaluation. A positive high-risk screen prompts an urgent psychiatric
or crisis-service response.

> This instrument concerns suicide risk. It is a validated clinical screening
> tool used by trained staff and is documented here as software; it does not
> replace clinical judgement, direct patient assessment, or local safeguarding
> and escalation policy.

## Scope and intended users

- **Setting:** mental-health and psychiatric services, emergency departments,
  primary care, crisis and helpline services, inpatient wards, and community,
  school, or correctional settings where suicide-risk screening is required.
- **Users:** clinicians, mental-health practitioners, nurses, primary-care
  staff, crisis workers, and trained non-clinical screeners using the screener
  version under an agreed protocol.
- **Patients:** adolescents and adults being screened or assessed for suicide
  risk. Paediatric and cognitively impaired presentations may need an
  age-appropriate or informant-supported variant.
- **Not for:** definitive psychiatric diagnosis, unsupervised self-diagnosis, or
  use as a substitute for a full clinical risk assessment, mental-state
  examination, or statutory safeguarding process. A Low tier does not exclude
  risk; re-screen on any change.

## Scoring system

The C-SSRS does not produce a summed score. It records three ordinal or
categorical dimensions and derives a risk tier from them.

### 1. Suicidal ideation severity (five-point ordinal)

The interviewer records which of the following were present in the reference
period (typically "past month" for current risk, plus a lifetime / worst
timeframe). The **highest** affirmative item sets the ideation level (0 when
none are present).

| Level | Ideation item | Description |
| --- | --- | --- |
| 1 | Wish to be dead | Passive wish to be dead or to go to sleep and not wake up. |
| 2 | Non-specific active suicidal thoughts | General active thoughts of wanting to end one's life, without methods, intent, or plan. |
| 3 | Active ideation with any methods (no plan) | Thinking of at least one method, but without a specific plan and without intent to act. |
| 4 | Active ideation with some intent to act | Active thoughts with some intent to act, without a fully worked-out plan. |
| 5 | Active ideation with specific plan and intent | Active thoughts with a specific plan **and** intent to carry it out. |

Optional **ideation intensity** sub-items (full version) further characterize the
most severe ideation: frequency, duration, controllability, deterrents, and
reasons for ideation. These inform clinical judgement but do not alter the
ordinal level.

### 2. Suicidal behaviour (categorical)

Each category is recorded as present or absent, with a recency window (most
recent event within the past 3 months, or more than 3 months / lifetime) and a
lifetime attempt count.

| Category | Description | Counts as suicidal behaviour |
| --- | --- | --- |
| Actual attempt | A potentially self-injurious act with at least some intent to die. | Yes |
| Interrupted attempt | Interrupted by an outside circumstance before self-harm begins. | Yes |
| Aborted / self-interrupted attempt | The person stops themselves before beginning the act. | Yes |
| Preparatory acts or behaviour | Steps taken to prepare (e.g. acquiring means, writing a note). | Yes |
| Non-suicidal self-injury (NSSI) | Self-injury without intent to die. | No — tracked separately |

### 3. Lethality (for actual attempts)

- **Actual lethality / medical damage** — ordinal 0–5 (0 = no physical damage,
  5 = death).
- **Potential lethality** — ordinal 0–2, coded only when actual lethality is 0,
  estimating the likely harm of the attempt as carried out.

### 4. Risk-tier logic

The tier is derived from the highest ideation level, the presence and recency of
any suicidal behaviour, and lethality:

| Tier | Triggers | Management |
| --- | --- | --- |
| **High** | Ideation level **4 or 5**; **or** any suicidal behaviour within the past 3 months; **or** an actual attempt of high lethality (actual ≥ 3 or potential = 2). | Urgent / immediate psychiatric or crisis response. Do not leave the person alone; ensure safety; remove or restrict access to lethal means; complete a safety plan; arrange emergency mental-health evaluation per local protocol. |
| **Moderate** | Ideation level **3**; **or** any suicidal behaviour more than 3 months ago / lifetime (not recent). | Timely mental-health / behavioural evaluation; safety planning; means-restriction counselling; increased monitoring and defined follow-up. |
| **Low** | Ideation level **1 or 2** with no suicidal behaviour; **or** no ideation and no behaviour. | Supportive response; document; discuss with a clinician; provide crisis resources (e.g. helpline); routine follow-up and re-screen on change. |

Access to lethal means and recent preparatory acts raise the clinical concern
within any tier and always generate a flagged issue. Non-suicidal self-injury is
recorded and flagged but does not by itself set a suicidal-behaviour tier.

## Assessment steps

Completed in order on a single continuous single-page wizard. Ideation questions
are asked in ascending order; higher-numbered ideation items are typically only
explored when the preceding item is affirmative, but every item is recorded.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessing clinician name and role, date and time, care setting, C-SSRS version (screener / full), reason for assessment |
| 2 | Patient identification | patient identifier, age band, sex |
| 3 | Suicidal ideation | ideation items Q1–Q5 (yes/no), reference timeframe (past month / lifetime-worst) → ideation level |
| 4 | Ideation intensity (optional) | frequency, duration, controllability, deterrents, reasons for ideation |
| 5 | Suicidal behaviour | actual / interrupted / aborted attempt, preparatory acts, NSSI, recency window, lifetime attempt count, most-recent attempt date |
| 6 | Lethality | actual lethality (0–5); potential lethality (0–2) when actual is 0 |
| 7 | Means and protective factors | access to lethal means, protective factors note |
| 8 | Summary and risk tier | computed ideation level, behaviour categories, risk tier, flagged issues, management recommendation, free-text clinical note |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — clinical
  decision-support / risk-screening tool; the output stratifies risk and prompts
  escalation rather than determining a diagnosis or treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Posner K. *et al.* The Columbia–Suicide Severity Rating Scale: Initial
  Validity and Internal Consistency Findings. *American Journal of Psychiatry*
  2011; 168(12):1266–1277.
- NICE NG225. *Self-harm: assessment, management and preventing recurrence*
  (2022).
- NICE CG133. *Self-harm: longer-term management* (2011).
- US FDA and SAMHSA guidance recognizing the C-SSRS for suicide-risk assessment.

## Verify

```sh
bin/test-form columbia-suicide-severity-rating-scale
```
