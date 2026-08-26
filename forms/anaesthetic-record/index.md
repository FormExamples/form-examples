# Anaesthetic Record

The intra-operative anaesthesia chart: the contemporaneous clinical record of an
anaesthetic from pre-induction checks through emergence and recovery handover. It
captures who was present, the pre-operative checks and WHO Safer Surgery
Checklist status, ASA physical status and airway assessment, every drug and dose
given (induction, maintenance, reversal, analgesia, antiemetics, vasoactive),
the airway-management technique and findings, the monitoring modalities in use,
the **timed physiological observations** (blood pressure, heart rate, SpO₂,
end-tidal CO₂, temperature), fluids and estimated blood loss, any regional or
neuraxial technique, intra-operative events and complications, and the recovery
handover.

Unlike a numeric severity score, this form's engine grades **completeness and
validity** rather than a clinical score. It classifies each record as
**Complete**, **Partial**, or **Incomplete** against a set of mandatory-item
rules, and — independently — raises **safety flags** (WHO checklist not
performed, allergy conflict, anticipated difficult airway, drug or anaphylaxis
event, unlogged consent). The output is a signed intra-operative record suitable
for the patient's notes, medico-legal archive, and audit.

## Scope and intended users

- **Setting:** operating theatres, day-surgery units, obstetric theatres,
  interventional / procedural suites, and any location where anaesthesia is
  delivered.
- **Users:** anaesthetists (consultant, associate specialist, trainee),
  anaesthesia associates, and operating-department practitioners (ODPs)
  documenting the anaesthetic. Recovery / PACU nurses receive the handover
  section.
- **Patients:** adults and, where locally configured, paediatric patients
  undergoing a procedure requiring general anaesthesia, regional anaesthesia,
  sedation, or monitored anaesthesia care.
- **Not for:** pre-operative optimization (see *Pre-operative Assessment by
  Clinician*), the surgical operation note (see *Medical Operation Note*), or
  post-operative ward care. It is the intra-operative anaesthetic record only.

## Data captured / sections

The record is organized into the sections below. Each maps to a SQL table and to
a step in the single-page wizard.

| Section | Key data |
| --- | --- |
| Case identification | patient identifier, name, DOB, sex, weight, height; theatre, date, list; anaesthetist(s), ODP, surgeon; planned procedure, urgency (elective / urgent / emergency / immediate) |
| Pre-induction checks | anaesthetic machine check, WHO Safer Surgery Checklist "Sign In / Time Out" status, consent confirmed, fasting confirmed, IV access, patient positioning, allergy band checked |
| ASA & airway assessment | ASA physical status (I–VI, with emergency `E` modifier), Mallampati class, mouth opening, thyromental distance, dentition, anticipated difficult airway, prior difficult intubation |
| Drugs & doses | induction agents, neuromuscular blockers, maintenance (volatile / TIVA), reversal agents, analgesia, antiemetics, antibiotics, vasoactive / emergency drugs — each with dose, unit, route, and time |
| Airway management | technique (facemask / supraglottic / tracheal tube / tracheostomy / awake FOI), device size, tube depth, cuff, Cormack–Lehane grade of view, number of attempts, confirmation (capnography) |
| Monitoring | modalities in use (ECG, NIBP / arterial line, SpO₂, capnography, temperature, neuromuscular, depth of anaesthesia, CVP, urine output) |
| Timed observations | periodic vital-sign rows: timestamp, systolic/diastolic BP, heart rate, SpO₂, end-tidal CO₂, temperature, inspired/expired agent, fresh-gas flow |
| Fluids & blood loss | crystalloid / colloid / blood products with volumes; estimated blood loss; urine output; cell salvage |
| Regional / neuraxial | technique (spinal / epidural / CSE / peripheral block), level, needle, drug and dose, block height / effect, complications |
| Events & complications | free-text and coded intra-operative events (desaturation, hypotension, arrhythmia, laryngospasm, bronchospasm, anaphylaxis, difficult airway, awareness) with time and management |
| Recovery handover | destination (recovery / HDU / ICU / ward), airway status, analgesia and antiemetic plan, oxygen, monitoring instructions, outstanding tasks, handover time and receiving practitioner |
| Sign-off | completeness status, fired rules, safety flags, anaesthetist electronic signature and timestamp |

## Completeness & safety model

This form does **not** compute a numeric severity score. Its engine validates the
record for **completeness** and raises **safety flags**.

### Completeness status

A record is classified into one of three status classes by evaluating the
**mandatory-item rules**:

| Status | Definition |
| --- | --- |
| **Complete** | Every mandatory item is present and internally valid. The record is ready to sign. |
| **Partial** | All *safety-critical* mandatory items are present, but one or more *non-critical* mandatory items are missing. The record may be signed with an explicit acknowledgement. |
| **Incomplete** | One or more *safety-critical* mandatory items are missing or invalid. The record must not be signed until resolved. |

A `completenessPercent` (0–100) is also reported: the proportion of mandatory
items satisfied, for progress display and audit.

### Mandatory-item rules

Safety-critical mandatory items (missing → **Incomplete**): patient
identification, anaesthetist identity, ASA physical status, anaesthetic
technique, airway-management technique, WHO checklist status, at least one
recorded set of timed observations, and the anaesthetist signature at sign-off.

Non-critical mandatory items (missing → **Partial**): weight, monitoring
modalities, fluids summary, estimated blood loss, and recovery-handover
destination.

### Safety flags

Raised independently of completeness status, each with a priority
(high / medium / low):

- **WHO checklist not done** (high) — Sign In / Time Out not recorded as
  performed.
- **Allergy conflict** (high) — a recorded drug matches a documented allergy.
- **Difficult airway** (high) — anticipated difficult airway, or Cormack–Lehane
  grade III–IV, or ≥ 3 intubation attempts.
- **Drug / anaphylaxis event** (high) — an anaphylaxis or drug-reaction event is
  logged.
- **Unlogged consent** (high) — consent not confirmed in pre-induction checks.
- **Physiological derangement** (medium) — a timed observation breaches a
  configured limit (e.g. SpO₂ < 92 %, sustained hypotension).
- **Incomplete assessment** (low) — one or more non-critical mandatory items
  missing.

## Assessment steps

Completed in order on one continuous single-page wizard. No multi-page forms.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Case identification | patient identifier, name, DOB, sex, weight, height, theatre, date, list, anaesthetist(s), ODP, surgeon, planned procedure, urgency |
| 2 | Pre-induction checks | machine check, WHO Sign In / Time Out, consent confirmed, fasting confirmed, IV access, positioning, allergy band checked |
| 3 | ASA & airway assessment | ASA status + `E` modifier, Mallampati, mouth opening, thyromental distance, dentition, anticipated difficult airway, prior difficult intubation |
| 4 | Drugs & doses | induction, neuromuscular blockers, maintenance, reversal, analgesia, antiemetics, antibiotics, vasoactive — dose, unit, route, time |
| 5 | Airway management | technique, device size, tube depth, cuff, Cormack–Lehane grade, attempts, capnography confirmation |
| 6 | Monitoring | modalities in use |
| 7 | Timed observations | repeated rows of time, BP, HR, SpO₂, EtCO₂, temperature, agent, fresh-gas flow |
| 8 | Fluids & blood loss | crystalloid, colloid, blood products, estimated blood loss, urine output, cell salvage |
| 9 | Regional / neuraxial | technique, level, needle, drug, dose, block height, complications |
| 10 | Events & complications | coded and free-text events with time and management |
| 11 | Recovery handover | destination, airway status, analgesia/antiemetic plan, oxygen, monitoring, outstanding tasks, handover time, receiving practitioner |
| 12 | Summary & sign-off | completeness status, `completenessPercent`, fired rules, safety flags, anaesthetist signature |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The validation engine is pure (no side effects, no I/O) and unit-tested.
- Timed observations and drug administrations are repeating child rows, each with
  its own timestamp.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — a clinical
  documentation and completeness-checking tool; its output records and validates
  care rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Royal College of Anaesthetists (RCoA). *Guidelines for the Provision of
  Anaesthesia Services (GPAS): Anaesthesia Records.*
- Association of Anaesthetists. *Recommendations for Standards of Monitoring
  during Anaesthesia and Recovery* (2021).
- World Health Organization. *Surgical Safety Checklist* (2009).
- American Society of Anesthesiologists. *ASA Physical Status Classification
  System* (last amended 2020).
- Cormack R.S., Lehane J. *Difficult tracheal intubation in obstetrics.*
  *Anaesthesia* 1984; 39:1105–11.

## Verify

```sh
bin/test-form anaesthetic-record
```
