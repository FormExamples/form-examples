# Mental State Examination (MSE)

A structured clinician record of a psychiatric assessment at a single point in
time. It documents observed and elicited findings across the standard mental
state domains — **appearance and behaviour**, **speech**, **emotion (mood and
affect)**, **perception**, **thought (form and content)**, **insight and
judgement**, and **cognition** — and raises safety-critical flags (suicidal or
homicidal ideation, command hallucinations, thoughts of self-harm or harm to
others, psychosis with risk, lack of insight with risk).

The MSE is a **documentation and completeness** instrument, not a numeric score.
It does not diagnose or grade severity. Its engine grades whether the record is
**Complete** or **Partial** (every domain documented, or some outstanding),
computes a completeness percentage, and derives a **risk indicator** from the
findings so that a reviewing clinician can see at a glance whether the
examination is finished and whether it surfaced any safety concern. It mirrors
the mental state section a psychiatrist or mental-health nurse writes at the end
of a clinical interview, following the widely taught **ASEPTIC** mnemonic
(Appearance/behaviour, Speech, Emotion, Perception, Thought, Insight, Cognition).

## Scope and intended users

- **Setting:** psychiatric outpatient clinics and community mental-health teams,
  inpatient wards, liaison psychiatry in the general hospital, crisis and
  home-treatment teams, and primary care — any setting where a structured mental
  state is recorded as part of a clinical interview.
- **Users:** psychiatrists, mental-health nurses, general practitioners,
  liaison-psychiatry clinicians, psychiatric trainees, and allied mental-health
  professionals.
- **Patients:** adults and older adolescents undergoing psychiatric assessment.
- **Not for:** definitive diagnosis, formal cognitive testing (use a validated
  instrument such as the MMSE or MoCA), risk stratification in place of a full
  risk assessment, or as a substitute for clinical judgement. The risk indicator
  is a documentation prompt, not a validated predictive tool.

## Domains and documentation model

The examination is recorded across **seven domains**. Each domain is marked
**documented** once its findings are entered, and each may raise one or more
**risk flags**. The engine reports a per-domain completeness status and an
overall Complete / Partial status.

| # | Domain (ASEPTIC) | What is recorded | Possible risk flags |
| --- | --- | --- | --- |
| 1 | **A** — Appearance and behaviour | Grooming, hygiene, dress, physical state, eye contact, rapport, psychomotor activity (agitation / retardation), abnormal movements, engagement | Agitation / behavioural risk |
| 2 | **S** — Speech | Rate, volume, quantity, tone, fluency, spontaneity, articulation | — |
| 3 | **E** — Emotion (mood and affect) | Subjective mood (patient's own words), objective affect: range, congruence, reactivity, appropriateness | Low / depressed mood with risk |
| 4 | **P** — Perception | Hallucinations (auditory, visual, olfactory, gustatory, tactile), illusions, depersonalisation, derealisation | Command hallucinations; psychosis with risk |
| 5 | **T** — Thought (form and content) | Form (linear, circumstantial, tangential, flight of ideas, thought block), content: delusions, obsessions, overvalued ideas, **suicidal ideation**, **homicidal ideation**, self-harm thoughts | Suicidal ideation; homicidal ideation / harm to others; thoughts of self-harm; delusional content with risk |
| 6 | **I** — Insight and judgement | Insight into illness (full / partial / none), understanding of need for treatment, decision-making and judgement | Lack of insight with risk |
| 7 | **C** — Cognition | Orientation (time, place, person), attention and concentration, memory (immediate, recent, remote), gross cognitive impression | Cognitive impairment with risk |

**Completeness status.** A domain is **documented** when its findings are
recorded. `completenessPercent` = documented domains ÷ 7 × 100. Overall status
is **Complete** when all seven domains are documented, otherwise **Partial**.

**Risk indicator.** Derived from the flags raised across all domains, not from a
sum of points:

| Risk level | Driven by |
| --- | --- |
| **None** | No risk flags raised. |
| **Low** | Only low-priority flags (e.g. mild agitation, passive low mood without ideation). |
| **Moderate** | Any moderate-priority flag (e.g. thoughts of self-harm without plan, lack of insight with risk, delusional content). |
| **High** | Any high-priority flag: active suicidal ideation, homicidal ideation or thoughts of harm to others, command hallucinations, or psychosis with risk. |

A **High** indicator is a prompt to complete a full risk assessment and escalate
per local safety policy; it is not itself a risk-management decision.

## Assessment steps

Completed in order on a single continuous single-page wizard. Each step records
**observed or elicited findings** for one domain.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | clinician name and role, date and time of assessment, care setting, reason for assessment / referral |
| 2 | Patient identification | patient identifier, age band, sex |
| 3 | Appearance and behaviour | grooming, dress, eye contact, rapport, psychomotor activity, abnormal movements, behaviour → domain 1 |
| 4 | Speech | rate, volume, quantity, tone, fluency, spontaneity → domain 2 |
| 5 | Emotion (mood and affect) | subjective mood (patient's words), affect range / congruence / reactivity → domain 3 |
| 6 | Perception | hallucination modalities, illusions, depersonalisation / derealisation, command-hallucination flag → domain 4 |
| 7 | Thought (form and content) | thought form, delusions, obsessions, suicidal ideation, homicidal ideation, self-harm thoughts → domain 5 |
| 8 | Insight and judgement | insight level, understanding of treatment, judgement → domain 6 |
| 9 | Cognition | orientation, attention, memory, gross cognitive impression → domain 7 |
| 10 | Summary and formulation | computed completeness status, completeness percent, risk indicator, fired rules, flagged issues, free-text clinical formulation |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The grading engine is pure (no side effects, no I/O) and unit-tested.
- British English throughout.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — clinical
  documentation and decision-support tool; the output records findings and
  prompts escalation rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Semple D., Smyth R. *Oxford Handbook of Psychiatry* — the mental state
  examination.
- Trzepacz P.T., Baker R.W. *The Psychiatric Mental Status Examination.* Oxford
  University Press.
- Geeky Medics. *Mental State Examination (MSE) — OSCE Guide.*
- Royal College of Psychiatrists. Assessment and documentation standards.
- NICE NG225. *Self-harm: assessment, management and preventing recurrence*
  (2022).

## Verify

```sh
bin/test-form mental-state-examination
```
