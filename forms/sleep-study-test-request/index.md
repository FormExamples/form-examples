# Sleep Study Test Request

A UK NHS–aligned **sleep study / polysomnography request (referral)** that a
clinician completes to request a sleep investigation for a patient, mainly to
diagnose or exclude **obstructive sleep apnoea (OSA)**. It records the requested
study type, the clinical indication and specific question, the Epworth
Sleepiness Scale and STOP-BANG scores, anthropometry (BMI, neck circumference),
symptoms and risk factors, and the requested urgency — then computes a
**four-axis grading** (appropriateness, clinical priority, request completeness,
and triage) plus a set of safety-critical flags. The output is a vetting report
that supports the sleep service's triage and booking decision.

This form is the sleep-medicine counterpart to the repository's other
clinician-driven test-request forms. It is completed by a respiratory
physician, sleep physician, GP, ENT surgeon, neurologist, or physiologist
rather than by the patient, and is aligned with NICE NG202, SIGN guidance, the
Epworth Sleepiness Scale, the STOP-BANG questionnaire, and DVLA fitness-to-drive
guidance for excessive sleepiness.

## Scope and intended users

- **Setting:** NHS respiratory or sleep clinic, ENT clinic, neurology clinic,
  community diagnostic service, or sleep-service triage / vetting desk.
- **Users:** respiratory physicians, sleep physicians, GPs, ENT surgeons,
  neurologists, and physiologists who vet incoming requests.
- **Patients:** adults with suspected OSA, snoring, daytime sleepiness,
  suspected narcolepsy, insomnia, restless legs, or COPD–OSA overlap.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
incomplete or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | Epworth + STOP-BANG vs. indication match (NICE NG202 / SIGN), 1–9 ordinal | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Clinical priority** | Occupational driving, severe daytime sleepiness, comorbidity | low / moderate / high |
| **C. Request completeness** | Mandatory-field checklist; indication, clinical question, and Epworth weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage** | Escalation rules (vocational driver / severe sleepiness → urgent) | routine / urgent (+ target timeframe) |

A vocational-driver request with excessive sleepiness, or severe daytime
sleepiness (high Epworth), **auto-escalates** the triage tier regardless of the
other axes, in line with DVLA guidance.

### Study types and indications

| Study type | Typical use |
| --- | --- |
| Home sleep apnoea test (HSAT) | First-line for uncomplicated suspected OSA |
| Polysomnography (PSG) | Complex / discordant cases, comorbidity, non-respiratory sleep disorders |
| Overnight oximetry | Screening where HSAT is unavailable |
| Multiple sleep latency test (MSLT) | Suspected narcolepsy / hypersomnolence |
| Actigraphy | Circadian-rhythm and insomnia assessment |

| Indication | Notes |
| --- | --- |
| Suspected OSA | High STOP-BANG and/or witnessed apnoeas |
| Snoring | Often with daytime sleepiness |
| Daytime sleepiness | High Epworth; DVLA relevance |
| Suspected narcolepsy | MSLT pathway |
| Insomnia | Often actigraphy |
| Restless legs | Often PSG |
| COPD overlap | NICE NG202 COPD–OSAHS overlap pathway |
| Pre-bariatric | Pre-operative OSA screening |
| Driver assessment | DVLA / occupational driver |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB, BMI |
| 3 | Requested study | study type, primary indication, specific clinical question |
| 4 | Sleep scores | Epworth (0–24), STOP-BANG (0–8), neck circumference, BMI |
| 5 | Symptoms & risk | witnessed apnoeas, occupational driver, cardiovascular disease, relevant history |
| 6 | Triage & submit | requested urgency, requested-by date, setting, notes |
| 7 | Result | computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories
include occupational-driver OSA, severe daytime sleepiness, suspected
narcolepsy, missing Epworth, missing indication, missing clinical question, and
other.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
sleep-study-test-request/
  index.md                          # this file
  AGENTS.md                         # agent instructions
  plan.md                           # implementation roadmap
  tasks.md                          # task tracking
  spec.md                           # living spec (generated from index.md)
  CHANGELOG.md                      # per-form changelog
  doc/                              # clinical reference documentation
  examples/                         # filled-form JSON fixture + FHIR R5 Bundle
  sql-migrations/                   # PostgreSQL migrations (source of truth)
  xml-representations/              # XML + DTD per SQL table (generated)
  fhir-r5/                          # FHIR HL7 R5 JSON per SQL entity (generated)
  protobuf/                         # Protocol Buffers schemas (generated)
  openapi/                          # OpenAPI 3.1 specs (generated)
  front-end-form-with-html/         # single-page HTML wizard
  front-end-form-with-svelte/       # SvelteKit single-page wizard
  front-end-dashboard-with-html/    # vetting dashboard (HTML table)
  front-end-dashboard-with-svelte/  # vetting dashboard (SVAR Grid)
  back-end-with-loco/               # Rust axum + Loco JSON API
  back-end-with-loco-setup          # scaffold generator (generated)
```

## Clinical references

- NICE NG202 *Obstructive sleep apnoea/hypopnoea syndrome and obesity
  hypoventilation syndrome in over 16s* (OSAHS, OHS, and COPD–OSAHS overlap;
  use of the Epworth Sleepiness Scale and STOP-BANG).
  <https://www.nice.org.uk/guidance/ng202>
- NICE NG202 — COPD–OSAHS overlap syndrome chapter.
  <https://www.nice.org.uk/guidance/ng202/chapter/3-COPDOSAHS-overlap-syndrome>
- SIGN — Scottish Intercollegiate Guidelines Network (sleep apnoea / sleep
  disorders). <https://www.sign.ac.uk/>
- Epworth Sleepiness Scale (0–24; >10 indicates abnormal daytime sleepiness).
- STOP-BANG questionnaire (0–8; OSA-risk stratification).
- DVLA *Assessing fitness to drive* — excessive sleepiness / OSA syndrome and
  driving (notification, vocational-driver fast-tracking).
  <https://www.gov.uk/guidance/neurological-disorders-assessing-fitness-to-drive>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / study-type selection.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form sleep-study-test-request
```
