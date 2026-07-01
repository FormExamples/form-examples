# Glasgow Coma Scale

A structured, clinician-driven assessment of impaired consciousness. The
observer scores three independent responses — **Eye opening (E, 1–4)**,
**Verbal response (V, 1–5)**, and **Motor response (M, 1–6)** — and the engine
computes the **total GCS (3–15)**, the **E/V/M breakdown**, and a **severity
band** (mild / moderate / severe). It supports a **"not testable" (NT)** result
per component (for example a swollen-shut eye, an intubated airway, or a
paralysed limb) and, as a secondary instrument, the pupil-augmented
**GCS-Pupils (GCS-P)** score.

The scale follows the 2014 Glasgow structured approach (Teasdale *et al.*),
which standardises the *check → observe → stimulate → rate* sequence, the exact
response descriptors, and the reporting of untestable components. The GCS is the
most widely used measure of consciousness worldwide and underpins trauma triage,
neuro-observation charts, and critical-care sedation targets.

## Scope and intended users

- **Setting:** emergency department, acute medical and surgical wards, neuro and
  neurosurgical units, intensive care and high-dependency units, and the
  pre-hospital / ambulance environment.
- **Users:** doctors, nurses, paramedics, emergency medical technicians,
  advanced clinical practitioners, and neuro-observation staff.
- **Patients:** adults and older children assessed for head injury, stroke,
  intracranial haemorrhage, poisoning / overdose, metabolic encephalopathy,
  sepsis, post-ictal states, and depth of sedation. Infants and pre-verbal
  children use a separate paediatric GCS and are out of scope here.
- **Not a diagnosis.** The GCS quantifies conscious level at a point in time; it
  supports triage and monitoring but does not replace clinical judgement.

## Scoring system

The examiner rates the **best** response observed for each of the three
components, then sums them. Always record the three components separately — the
breakdown carries more information than the total alone, and a falling motor
score is the single most important early sign of deterioration.

### Eye opening (E) — 1 to 4

| Score | Descriptor | Criterion |
| --- | --- | --- |
| 4 | Spontaneous | Eyes open without stimulation |
| 3 | To sound | Eyes open to spoken or shouted request |
| 2 | To pressure | Eyes open after fingertip pressure stimulus |
| 1 | None | No eye opening to any stimulus |
| NT | Not testable | Local factor prevents testing (e.g. periorbital swelling, dressings) |

### Verbal response (V) — 1 to 5

| Score | Descriptor | Criterion |
| --- | --- | --- |
| 5 | Orientated | Correctly states name, place, and date |
| 4 | Confused | Converses but disorientated |
| 3 | Words | Intelligible single words only, no sustained conversation |
| 2 | Sounds | Groans or moans, no words |
| 1 | None | No audible response |
| NT | Not testable | Local factor prevents testing (e.g. intubation, tracheostomy, language barrier) |

### Motor response (M) — 1 to 6

| Score | Descriptor | Criterion |
| --- | --- | --- |
| 6 | Obeys commands | Performs a two-part request |
| 5 | Localising | Purposeful movement towards a supraorbital / trapezius stimulus |
| 4 | Normal flexion | Withdraws, bends arm rapidly, but not localising |
| 3 | Abnormal flexion | Slow, stereotyped flexion (decorticate posturing) |
| 2 | Extension | Arm extension to stimulus (decerebrate posturing) |
| 1 | None | No motor response |
| NT | Not testable | Local factor prevents testing (e.g. neuromuscular blockade, spinal injury, limb immobilisation) |

### Total and severity bands

The total GCS is **E + V + M**, ranging from **3** (deepest coma) to **15**
(fully alert). It is only defined when all three components are testable.

| Total | Band | Interpretation |
| --- | --- | --- |
| 13–15 | Mild | Mild impairment / normal-to-drowsy |
| 9–12 | Moderate | Moderate impairment |
| 3–8 | Severe | Severe impairment — coma; GCS ≤ 8 signals inability to protect the airway |

### Reporting untestable components

When a component is NT the numeric total is undefined. Report the breakdown
explicitly, marking the untestable component — for example `E3 V-NT M5`. By
long-standing convention an intubated patient's verbal score is annotated with a
trailing **T** (e.g. an eye-plus-motor sum reported as "9T"). Never silently
substitute a value: an assumed score misrepresents the assessment.

### GCS-Pupils (GCS-P) — secondary

GCS-P extends the bottom of the scale to better separate the most severely
injured. It subtracts a **Pupil Reactivity Score (PRS)** from the GCS total:

- PRS = number of pupils **unreactive** to light (0, 1, or 2).
- **GCS-P = GCS total − PRS**, ranging **1 to 15**.

GCS-P is reported alongside — not instead of — the standard GCS and its E/V/M
breakdown, and is only computed when the total GCS is defined and both pupils
have been examined.

## Assessment steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessor name and role, date and time, setting (ED / neuro / critical care / pre-hospital), reason for assessment |
| 2 | Confounders | intubated / tracheostomy, sedation, neuromuscular blockade, periorbital swelling, language barrier — each may force a component to NT |
| 3 | Eye opening (E) | best eye response 1–4, or NT with reason |
| 4 | Verbal response (V) | best verbal response 1–5, or NT with reason |
| 5 | Motor response (M) | best motor response 1–6, or NT with reason |
| 6 | Pupils | left and right pupil size and reactivity (for GCS-P) |
| 7 | Trend | previous total and time, to compute change since last assessment |
| 8 | Summary & sign-off | computed total, breakdown, band, GCS-P, fired rules and flags, free-text notes, assessor signature |

## Flagged issues

Computed independently of the severity band. Priority: high / medium / low.

- **GCS ≤ 8 (coma)** — airway at risk; consider definitive airway management /
  intubation and senior escalation (high).
- **Deteriorating GCS** — a sustained fall of ≥ 2 points from the previous
  total, or any fall in the motor component, warrants urgent senior and
  neurosurgical review and consideration of CT imaging (high).
- **Unequal or unreactive pupils** — asymmetry or a fixed dilated pupil suggests
  raised intracranial pressure or herniation; urgent CT head and neurosurgical
  referral (high).
- **Untestable component** — one or more components NT: the total is undefined;
  flag the reliability limitation and record the reason (medium).
- **Falling motor score** — the most sensitive early warning of neurological
  deterioration even when the total is stable (medium).

## Output

- **HTML report preview** with the E/V/M breakdown, total, band, and GCS-P.
- **FHIR R5 Bundle** (Observation resources for the total, each component, and
  the pupillary findings) for EHR integration.
- **XML** and **JSON / CSV / TSV** export for archival and interchange.

## Directory structure

```
glasgow-coma-scale/
  index.md                      # this file
  AGENTS.md                     # agent instructions
  plan.md                       # implementation roadmap
  tasks.md                      # task tracking
  spec/                         # living domain spec (index.md)
  doc/                          # clinical reference documentation
  sql/                          # PostgreSQL migrations (source of truth)
  xml/                          # XML + DTD per SQL table (generated)
  fhir/                         # FHIR HL7 R5 JSON per SQL entity (generated)
  protobuf/                     # Protocol Buffers .proto schemas (generated)
  openapi/                      # OpenAPI 3.1 .yaml specs (generated)
  front-end-with-html/          # HTML + Lily wizard + dashboard
  front-end-with-svelte/        # SvelteKit + Lily wizard + dashboard
  back-end-with-loco/           # Rust axum + Loco JSON API
```

## Clinical references

- Teasdale G., Jennett B. *Assessment of coma and impaired consciousness: a
  practical scale.* *Lancet* 1974; 2:81–4.
- Teasdale G. *et al.* *The Glasgow Coma Scale at 40 years: standing the test of
  time.* *Lancet Neurology* 2014; 13:844–54.
- Glasgow Coma Scale — structured assessment aid and training.
  <https://www.glasgowcomascale.org/>.
- Brennan P.M., Murray G.D., Teasdale G.M. *Simplifying the use of prognostic
  information in traumatic brain injury. Part 1: The GCS-Pupils score.*
  *Journal of Neurosurgery* 2018; 128:1612–20.
- NICE NG232. *Head injury: assessment and early management* (2023).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support; Class IIa where the score drives triage or escalation.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022 — design and development of information for users.
- UK MHRA *Software and AI as a Medical Device*.

## Verify

```sh
bin/test-form glasgow-coma-scale
```
