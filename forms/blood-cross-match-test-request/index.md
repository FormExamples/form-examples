# Blood Cross-Match Test Request

A UK NHS–aligned **blood cross-match / transfusion compatibility request
(referral)** that a clinician completes to request group-and-save, antibody
screen, crossmatch, or emergency blood for a patient. It records the requested
test type and blood component, the clinical indication, the patient's ABO/Rh
blood group, antibody and transfusion history, pre-transfusion sample collection
and two-sample (group-check) status, and the requested urgency — then computes a
**four-axis grading** (appropriateness, identity / sample safety, request
completeness, and triage priority) plus a set of safety-critical flags. The
output is a vetting report that supports the transfusion laboratory's
acceptance, query, and prioritization decision.

This form is the transfusion-compatibility counterpart to the repository's other
clinician-driven request forms. It is completed by a doctor, nurse, midwife, or
operating-department practitioner rather than by the patient, and is aligned with
NICE NG24 *Blood transfusion*, British Society for Haematology (BSH)
pre-transfusion compatibility guidance, and the Serious Hazards of Transfusion
(SHOT) recommendations on positive patient identification and the two-sample
group-check rule.

## Scope and intended users

- **Setting:** NHS ward, operating theatre, emergency department, obstetric
  unit, day-case / oncology unit, or transfusion-laboratory vetting desk.
- **Users:** doctors, nurses, midwives, operating-department practitioners, and
  biomedical scientists who vet incoming requests.
- **Patients:** any patient who may require red cells, platelets, fresh-frozen
  plasma, cryoprecipitate, or pre-transfusion compatibility testing.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a highly appropriate request can still be
incomplete, identity-unsafe, or time-critical.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | NICE NG24 restrictive thresholds + indication (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Identity / sample safety** | BSH / SHOT positive patient ID + two-sample group-check rule | ok / caution / reject-risk |
| **C. Request completeness** | Mandatory-field checklist; indication, blood group and sample status weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Red-flag escalation rules | routine / urgent / emergency / stat (+ target timeframe) |

> **Note on the 1–9 scale.** There is **no single published transfusion-ordering
> score** comparable to the ACR Appropriateness Criteria for imaging. The 1–9
> appropriateness axis here is **anchored on NICE NG24 restrictive thresholds**
> (e.g. a 70 g/L red-cell threshold, 80 g/L in acute coronary syndrome) and on
> indication appropriateness, and is explicitly labelled as such throughout the
> schema and engine.

A red-flag (declared major / massive haemorrhage, haemodynamic instability,
active uncontrolled bleeding) **auto-escalates** the triage tier regardless of
the other axes.

### Request types, components, and indications

| Request type | Component | Typical indication |
| --- | --- | --- |
| Group and save | none (sample only) | elective surgery with low expected blood loss |
| Antibody screen | none (sample only) | antenatal screening, pre-transfusion workup |
| Crossmatch | red cells | surgery with expected loss, symptomatic anaemia |
| Crossmatch | platelets / FFP / cryoprecipitate | thrombocytopenia, coagulopathy, massive transfusion |
| Emergency O-negative | red cells | major haemorrhage before group is known |

| Indication | NICE NG24 anchor |
| --- | --- |
| Surgery | predicted loss + restrictive threshold |
| Acute bleeding | major haemorrhage protocol, target Hb 70–90 g/L |
| Anaemia (non-bleeding) | restrictive 70 g/L threshold; consider alternatives |
| Obstetric haemorrhage | major haemorrhage protocol; anti-D relevance |
| Chemotherapy support | individualized threshold for chronic anaemia |
| Transfusion-dependent | individual thresholds and targets |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB, positive patient ID confirmation |
| 3 | Requested test & component | request type, component, units required, requested-by date/time |
| 4 | Clinical indication | primary indication, clinical details, current haemoglobin / platelet context |
| 5 | Blood group & history | ABO/Rh group, known antibodies + detail, previous transfusion, previous reaction, pregnancy |
| 6 | Sample & identity safety | sample collected, collection date/time, two-sample (group-check) rule met, labelling check |
| 7 | Triage & submit | requested urgency, required-by date/time, setting, notes; computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories
are: massive-haemorrhage-stat, two-sample-rule-not-met,
known-antibodies-extra-time, previous-transfusion-reaction, mislabel-risk,
missing-clinical-details, missing-blood-group, and other.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / LIMS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
blood-cross-match-test-request/
  index.md                          # this file
  AGENTS.md                         # agent instructions
  plan.md                           # implementation roadmap
  tasks.md                          # task tracking
  spec.md                           # living spec (generated from index.md)
  CHANGELOG.md                      # per-form changelog
  doc/                              # clinical reference documentation
  examples/                         # filled-form JSON fixture + FHIR R5 Bundle
  sql/                   # PostgreSQL migrations (source of truth)
  xml/              # XML + DTD per SQL table (generated)
  fhir/r5/                          # FHIR HL7 R5 JSON per SQL entity (generated)
  protobuf/                         # Protocol Buffers schemas (generated)
  openapi/                          # OpenAPI 3.1 specs (generated)
  front-end-with-html/         # single-page HTML wizard
  front-end-with-svelte/       # SvelteKit single-page wizard
  front-end-with-html/    # vetting dashboard (HTML table)
  front-end-with-svelte/  # vetting dashboard (SVAR Grid)
  back-end-with-loco/               # Rust axum + Loco JSON API
  back-end-with-loco-setup          # scaffold generator (generated)
```

## Clinical references

- NICE NG24 *Blood transfusion* (restrictive red-cell threshold 70 g/L, target
  70–90 g/L; 80 g/L in acute coronary syndrome; platelet, FFP and cryoprecipitate
  thresholds). <https://www.nice.org.uk/guidance/ng24>
- British Society for Haematology (BSH) *Guidelines for pre-transfusion
  compatibility procedures in blood transfusion laboratories*.
  <https://b-s-h.org.uk/guidelines/>
- BSH *Administration of blood components* (Robinson et al., 2018) — positive
  patient identification and the two-sample (group-check) requirement.
  <https://b-s-h.org.uk/guidelines/>
- Serious Hazards of Transfusion (SHOT) annual reports — Wrong Blood in Tube
  (WBIT) and patient-identification recommendations. <https://www.shotuk.org/>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / acceptance decisions.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form blood-cross-match-test-request
```
