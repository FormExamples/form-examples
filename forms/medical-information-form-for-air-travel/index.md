# Medical Information Form for Air Travel (MEDIF)

A **Medical Information Form (MEDIF)** is the standardised airline document used
to determine whether a passenger with specific health needs is fit to fly and
whether in-flight medical support (supplemental oxygen, stretcher, incubator,
medical escort, battery-powered medical device) must be arranged in advance. It
is completed in two parts: Part 1 by the passenger (or booking agent) and Part 2
by the attending physician, then forwarded to the airline's medical desk for
clearance.

This form digitises that workflow as a single-page, step-by-step wizard. It
captures passenger and trip details, the attending physician's clinical
evaluation, the requested in-flight medical accommodations, and computes a
**fitness-to-fly band** (`fit`, `fit-with-conditions`, `requires-review`,
`unfit-to-fly`) together with a set of safety flags and an airline-medical-desk
submission summary.

## Scope and intended users

- **Setting:** outpatient clinic, GP surgery, hospital discharge planning,
  travel-medicine clinic, airline accessible-travel desk, or repatriation
  service.
- **Users:** treating physician, travel-medicine clinician, hospital
  discharge coordinator, airline medical-clearance officer, accessible-travel
  agent acting on behalf of the passenger.
- **Passengers:** adults and children booked on commercial flights who meet
  any of the trigger criteria below.

## When a MEDIF is required

A MEDIF is required when any one of the following applies:

- **In-flight medical equipment** — supplemental oxygen, portable oxygen
  concentrator (POC), CPAP / BiPAP, ventilator, infant incubator, stretcher,
  IV pump, or other battery-powered medical device subject to dangerous-goods
  rules.
- **Recent acute event** — surgery, myocardial infarction, stroke, pulmonary
  embolism, pneumothorax, fracture, scuba-diving incident, or serious injury
  within the airline's specified recovery window.
- **Unstable or potentially decompensating condition** — severe anaemia
  (Hb < 75 g/L), unstable angina, recent cardiac failure, severe COPD with
  resting hypoxia, uncontrolled epilepsy, sickle-cell crisis history, recent
  major haemorrhage, or any condition that may cause distress to other
  passengers.
- **Communicable disease** — active tuberculosis, measles, varicella, COVID-19
  during infectious period, or any notifiable communicable disease.
- **Late-stage pregnancy** — typically beyond 28 weeks for multiple
  pregnancies and 32 weeks for singleton, or any complicated pregnancy.
- **Mobility or escort requirements** — passenger needs a stretcher, a
  medical escort, an extra seat for medical reasons, or a service animal
  beyond standard accessibility provision.
- **Psychiatric clearance** — recent acute psychiatric admission, suicidal
  ideation, or behavioural risk requiring sedation or escort.

## Fitness-to-fly band

Computed by a deterministic *max-grade* engine: the worst-band finding sets
the overall band. The band drives the airline-medical-desk recommendation.

| Band | Drivers | Recommendation |
| --- | --- | --- |
| `fit` | stable condition, no equipment, no recent acute event, pregnancy < 28 weeks | proceed; no medical clearance needed beyond the form |
| `fit-with-conditions` | stable chronic condition + supplemental oxygen at low flow, simple POC, or a single mobility accommodation | clear with documented conditions (oxygen flow rate, seat allocation) |
| `requires-review` | recent surgery within 14 days, unstable angina with recent stent, late pregnancy 32–36 weeks, complex equipment, communicable disease in convalescence | submit to airline medical desk; senior physician review required |
| `unfit-to-fly` | acute MI within 7 days, recent pneumothorax, uncontrolled seizures, infectious communicable disease, Hb < 75 g/L, late pregnancy > 36 weeks for singleton or > 32 weeks for multiple | do not fly until reassessed |

## 14-step single-page wizard

Completed in order on one continuous page; no multi-page flow.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Submitting agent identification | name, role (passenger / agent / clinician), email, phone, organisation, airline booking reference |
| 2 | Passenger identification | name, date of birth, sex, nationality, passport number, NHS / national health ID, address, emergency contact |
| 3 | Trip details | airline, flight number(s), origin, destination, transit airports, outbound and return dates, cabin class, sector duration, special-assistance code requested (WCHR / WCHS / WCHC / MEDA / STCR / OXYG / POC) |
| 4 | Reason MEDIF is required | one or more of: equipment, recent acute event, unstable condition, communicable disease, pregnancy, mobility / escort, psychiatric |
| 5 | Attending physician identification | name, specialty, registration number (GMC / NMC / equivalent), clinic, email, phone, address, signature date |
| 6 | Diagnosis and clinical history | primary diagnosis, ICD-10 codes, date of onset, current treatment, recent hospital admission and discharge dates, last specialist review |
| 7 | Cardiovascular fitness | resting BP, resting HR, NYHA functional class, recent MI / stent date, anticoagulation, pacemaker / ICD, exercise tolerance (metres on flat) |
| 8 | Respiratory fitness | resting SpO₂ on room air, predicted in-flight SpO₂, hypoxic challenge test result, recent pneumothorax, asthma stability, COPD severity, CPAP use |
| 9 | Recent events and surgery | date of last surgery, surgical site, gas in body cavity (eye / abdomen / cranium), recent fracture and cast, recent DVT / PE, scuba diving within 24 hours |
| 10 | Pregnancy and obstetric history | currently pregnant, gestation weeks, singleton or multiple, complications, expected delivery date, obstetrician contact |
| 11 | Communicable disease screening | infectious status, last symptom date, isolation precautions, vaccination status, current antimicrobials |
| 12 | In-flight medical requirements | supplemental oxygen flow rate and duration, POC make and model, battery hours, stretcher, incubator, IV pump, medical escort, extra seat, special meal, accessible lavatory access, wheelchair type, accompanying carer |
| 13 | Medications and equipment in cabin | regular medications, controlled drugs, dangerous-goods battery declaration, syringes and sharps, refrigeration requirements, customs documentation |
| 14 | Summary and physician sign-off | computed fitness band, fired rules, safety flags, physician declaration of fitness, electronic signature, valid until date (typically 10–14 days from completion) |

## Safety flags

Computed independently of the fitness band. Priority: high / medium / low.

- **High:** acute MI within 7 days; pneumothorax within 14 days; cabin gas
  expansion risk (recent intra-ocular / intra-cranial / intra-abdominal gas);
  uncontrolled seizures; active communicable disease; severe anaemia
  (Hb < 75 g/L); pregnancy > 36 weeks (singleton) or > 32 weeks (multiple);
  oxygen flow > 4 L/min sustained; resting SpO₂ < 85 % on room air;
  contagious infectious disease.
- **Medium:** recent surgery 8–14 days; pulmonary embolism within 6 weeks;
  unstable angina; uncontrolled diabetes (glucose lability with insulin);
  cabin pressure–sensitive surgical fixation; sickle-cell history; deep vein
  thrombosis risk factors stacked; cognitive impairment without escort.
- **Low:** mobility assistance only; mild stable asthma; controlled
  hypertension; non-infectious chronic dermatology condition; mild
  motion-sickness history.

## Submission timing

Most carriers require the completed MEDIF at least 48 hours before departure
(Emirates, Qatar Airways) and many prefer 72 hours (LOT, KLM). The form must
typically have been completed within 10 to 14 days of the initial flight
date; for longer trip planning the physician must re-sign closer to travel.

## Output

- **HTML report preview** of every section.
- **Downloadable PDF** via `pdfmake` suitable to email the airline medical
  desk.
- **FHIR R5 Bundle** including `Patient`, `Practitioner`, `Encounter`,
  one `Observation` per clinical section, a `ClinicalImpression` for the
  fitness band, and `DetectedIssue` resources for each safety flag.
- **XML** archival representation with a matching DTD.
- **CSV / TSV** export of the row for batch processing by the airline desk.

## Directory structure

```
medical-information-form-for-air-travel/
  index.md                                          # this file
  AGENTS.md                                         # agent instructions
  plan.md                                           # implementation roadmap
  tasks.md                                          # task tracking
  seed.md                                           # research seed
  doc/                                              # clinical references
  sql/                                   # Liquibase Postgres migrations
  xml/                              # XML + DTD per SQL table
  fhir/r5/                                          # FHIR HL7 R5 JSON resources
  protobuf/                                         # Protocol Buffers .proto schemas
  typespec/                                         # TypeSpec interface definitions
  front-end-with-html/                         # static single-page HTML wizard
  front-end-with-svelte/                       # SvelteKit single-page wizard
  front-end-with-html/                    # review dashboard (HTML table)
  front-end-with-svelte/                  # review dashboard (SVAR Grid)
  back-end-with-loco/            # Rust backend + server-rendered UI
  back-end-with-loco-setup       # Rust scaffold setup script
```

## Clinical references

- IATA *Medical Manual* (13th ed., 2023).
- Civil Aviation Authority (UK). *Assessing fitness to fly: guidelines for
  health professionals from the Aerospace Medical Association*.
- Aerospace Medical Association (ASMA). *Medical Guidelines for Airline
  Travel*. <https://www.asma.org/asma/media/AsMA/pdf-policy/Medical-Guidelines.pdf>.
- British Thoracic Society. *Air travel and lung disease guidelines*.
- Civil Aviation Authority of New Zealand, Australian CASA, EASA, FAA AC
  120-32 — aeromedical reference frameworks.
- Sample airline forms: Emirates MEDIF, British Airways MEDIF,
  LOT Polish Airlines MEDIF, Air India MEDIF, Qatar Airways MEDIF, KLM
  MEDIF, ANA MEDIF, Starlux MEDIF.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — Class I
  documentation aid; not a Class IIa decision-support tool (the final
  fitness-to-fly decision is taken by the airline's medical desk).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022 *Design and development of information for users*.
- UK MHRA *Software and AI as a Medical Device* — informational
  questionnaire.
- IATA *Dangerous Goods Regulations* for in-cabin battery declarations.

## Verify

```sh
bin/test-form medical-information-form-for-air-travel
```
