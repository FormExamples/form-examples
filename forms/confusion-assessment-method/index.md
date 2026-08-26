# Confusion Assessment Method (CAM)

A structured, bedside **delirium screening** instrument that records four
observational **features** of an acute confusional state and applies the
validated **CAM diagnostic algorithm** to classify delirium as **present** or
**absent**. The Confusion Assessment Method is not a numeric sum: the output is
a boolean status derived from a fixed pattern of positive features, together
with the list of which features were positive and any safety-critical flags.

The CAM was developed by Inouye and colleagues (1990) to let non-psychiatric
clinicians identify delirium quickly and reliably at the bedside. It operates on
observed cognitive and behavioural findings — collected during a brief
structured interview and a formal attention test — rather than on a laboratory
result or a self-report questionnaire. A validated **CAM-ICU** variant adapts
the same four features for mechanically ventilated and other non-verbal
patients, substituting objective, non-verbal tasks for the interview.

## Scope and intended users

- **Setting:** acute hospital wards, older-persons and orthogeriatric units,
  post-operative recovery and surgical wards, emergency departments, and
  intensive care (via the CAM-ICU variant).
- **Users:** ward and ICU nurses, junior and senior doctors, geriatricians,
  liaison psychiatrists, physiotherapists and occupational therapists trained
  in delirium screening, and clinical researchers.
- **Patients:** older inpatients (typically ≥ 65 years), post-operative
  patients, and critically ill or ventilated patients — the groups at highest
  risk of delirium. The instrument is intended for people with a suspected
  **acute** change in cognition, not for the assessment of stable chronic
  dementia in isolation.

CAM is a screening and case-finding aid; it supports, but does not replace, a
full clinical diagnosis of delirium and the search for its underlying cause.

## Scoring system

The CAM assesses four features. Each feature is recorded as **present** or
**absent** on the basis of the interview, the attention test, and observation.

| # | Feature | Positive when |
| --- | --- | --- |
| 1 | **Acute onset and fluctuating course** | There is an acute change in mental status from the patient's baseline **and** the abnormal behaviour fluctuates during the day (comes and goes, or varies in severity). Usually established from a family member, carer, or nurse. |
| 2 | **Inattention** | The patient has difficulty focusing attention — e.g. is easily distractible, or has difficulty keeping track of what is said. Confirmed with a formal attention test (digit span, months-of-the-year backwards, or serial recitation). |
| 3 | **Disorganized thinking** | The patient's thinking is disorganized or incoherent — rambling or irrelevant conversation, unclear or illogical flow of ideas, or unpredictable switching between subjects. |
| 4 | **Altered level of consciousness** | The patient's level of consciousness is anything other than **alert** — i.e. vigilant (hyperalert), lethargic (drowsy, easily roused), stuporous (difficult to rouse), or comatose (unrousable). |

### Diagnostic algorithm

Delirium is classified as **present** when the following boolean pattern holds:

```
delirium present  ⇔  Feature 1  AND  Feature 2  AND  ( Feature 3  OR  Feature 4 )
```

That is, the diagnosis requires **both** feature 1 (acute onset and fluctuating
course) **and** feature 2 (inattention), **plus at least one** of feature 3
(disorganized thinking) or feature 4 (altered level of consciousness). If the
pattern does not hold, delirium is classified as **absent**.

### Classification (output)

- **Delirium present** — the algorithm above is satisfied.
- **Delirium absent** — the algorithm is not satisfied (delirium not detected;
  this does not exclude delirium if clinical suspicion remains).

The result object also reports the **set of positive features** (which of the
four fired) so that the clinical reasoning behind the classification is
transparent and auditable. Because the output is a status rather than a numeric
score, there is no total, no cut-off, and no band table.

### CAM-ICU variant

For mechanically ventilated and other non-verbal patients, the **CAM-ICU**
assesses the same four features using objective, non-verbal tasks:

1. Level of consciousness is first screened with the **Richmond
   Agitation–Sedation Scale (RASS)**; a patient who is unrousable (RASS −4/−5)
   cannot be assessed and is recorded as *unable to assess*.
2. **Feature 1** — acute onset / fluctuating course from the record and RASS
   fluctuation.
3. **Feature 2** — inattention via the **Attention Screening Examination**
   (letters "SAVEAHAART" squeeze-on-A task, or pictures).
4. **Feature 3** — disorganized thinking via yes/no logic questions and simple
   commands.
5. **Feature 4** — altered level of consciousness via a non-zero RASS.

CAM-ICU applies the identical `1 AND 2 AND (3 OR 4)` algorithm and yields the
same **present / absent** classification.

## Assessment steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessor and encounter | assessor name, role, date and time of assessment, ward / unit, assessment variant (CAM or CAM-ICU) |
| 2 | Patient identification | patient identifier, name, date of birth, age, sex, cognitive baseline (independent / known dementia / mild cognitive impairment), source of collateral history |
| 3 | Feature 1 — acute onset and fluctuating course | evidence of acute change from baseline, fluctuation over the day, collateral source, onset timing |
| 4 | Feature 2 — inattention | attention test used (digit span / months backwards / serial sevens), performance, distractibility observed |
| 5 | Feature 3 — disorganized thinking | coherence of conversation, logical flow, subject switching, tangentiality |
| 6 | Feature 4 — altered level of consciousness | consciousness level (alert / vigilant / lethargic / stupor / coma), RASS score if CAM-ICU |
| 7 | Motoric subtype and observations | psychomotor activity (hypoactive / hyperactive / mixed / normal), hallucinations, delusions, sleep–wake disturbance |
| 8 | Result and disposition | computed classification (present / absent), positive-feature set, suspected precipitants, safety flags, recommended actions, assessor sign-off |

## Flagged issues

Computed independently of the present / absent classification and prioritized
high / medium / low. Categories include:

- **Delirium present → cause workup** (high) — prompt the search for reversible
  precipitants (the *PINCH ME* screen: Pain, Infection, Nutrition,
  Constipation, Hydration, Medication, Environment) and appropriate
  investigations.
- **Hypoactive delirium** (high) — quiet, withdrawn, drowsy presentation that is
  frequently missed and carries a worse prognosis; flagged whenever the motoric
  subtype is hypoactive.
- **Altered consciousness / safety** (high) — stupor or coma, or a markedly
  depressed level of consciousness, requiring urgent medical review.
- **Deliriogenic medication** (medium) — recent addition of a high-risk drug
  (anticholinergics, benzodiazepines, opioids) noted during assessment.
- **Unable to assess** (medium) — CAM-ICU with RASS −4/−5, or attention test not
  completable; re-assess when arousal improves.
- **Fluctuation / repeat screening** (low) — reminder that a single negative
  screen does not exclude delirium; re-screen at least once per shift in
  at-risk patients.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR.
- **XML** representation for archival or legacy import.
- Import and export via **JSON, XML, CSV, and TSV**.
- A concise bedside summary suitable for the nursing observation chart and the
  medical record.

## Directory structure

```
confusion-assessment-method/
  index.md                                          # this file
  README.md -> index.md                             # symlink for GitHub rendering
  AGENTS.md                                         # agent instructions
  plan.md                                           # implementation roadmap
  tasks.md                                          # task tracking
  spec/                                             # living domain spec (index.md)
  doc/                                              # clinical reference documentation
  sql/                                              # Liquibase Postgres migrations (source of truth)
  xml/                                              # XML + DTD per SQL table (generated)
  fhir/                                             # FHIR HL7 R5 JSON per SQL entity (generated)
  protobuf/                                         # Protocol Buffers .proto schemas (generated)
  front-end-with-html/                              # HTML + Lily wizard + dashboard
  front-end-with-svelte/                            # SvelteKit + Lily wizard + dashboard
  back-end-with-loco/                               # Rust axum + Loco JSON API
```

## Clinical references

- Inouye S.K. *et al.* Clarifying confusion: the Confusion Assessment Method.
  *Annals of Internal Medicine* 1990; 113:941–8.
- Ely E.W. *et al.* Delirium in mechanically ventilated patients: validity and
  reliability of the CAM-ICU. *JAMA* 2001; 286:2703–10.
- Inouye S.K. *et al.* The Confusion Assessment Method: a systematic review of
  current usage. *Journal of the American Geriatrics Society* 2008; 56:823–30.
- NICE CG103. *Delirium: prevention, diagnosis and management in hospital and
  long-term care* (updated 2023).
- SIGN 157. *Risk reduction and management of delirium* (2019).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support; Class IIa where the output drives clinical management of delirium.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022 — design and development of information for users.
- UK MHRA *Software and AI as a Medical Device*.

## Verify

```sh
bin/test-form confusion-assessment-method
```
