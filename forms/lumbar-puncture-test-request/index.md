# Lumbar Puncture Test Request

A UK NHS–aligned **lumbar puncture (LP) request (referral)** that a clinician
completes to request cerebrospinal fluid (CSF) sampling and/or manometry
(opening-pressure measurement) for a patient. It records the procedure intent,
the clinical indication and specific question, raised-intracranial-pressure and
bleeding-risk safety screening, the opening-pressure requirement, and the
requested urgency — then computes a **four-axis grading** (appropriateness,
safety / contraindication, request completeness, and triage priority) plus a set
of safety-critical flags. The output is a vetting report that supports the
neurology / acute-medicine team's triage and scheduling decision.

This form is the neurology-procedure counterpart to the repository's other
clinician-driven request forms. It is completed by a neurologist, hospital
doctor, GP, anaesthetist, or emergency physician rather than by the patient, and
is aligned with NICE NG240 (bacterial meningitis / meningococcal disease),
subarachnoid-haemorrhage / CSF-xanthochromia guidance, and Association of
British Neurologists guidance on LP safety in anticoagulation and raised
intracranial pressure.

## Scope and intended users

- **Setting:** NHS neurology clinic, acute medical unit, emergency department,
  inpatient ward, or day-case procedure unit.
- **Users:** neurologists, hospital doctors, GPs, anaesthetists, and emergency
  physicians who request or vet incoming LP requests.
- **Patients:** adults requiring diagnostic or therapeutic lumbar puncture.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
unsafe (needing imaging or coagulation correction first) or incomplete.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | Indication match (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Safety / contraindication** | Raised-ICP imaging rule, coagulation / antithrombotic, thrombocytopenia, local infection | ok / caution / contraindicated |
| **C. Request completeness** | Mandatory-field checklist; indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Red-flag escalation rules | routine / urgent / emergency (+ target timeframe) |

Suspected meningitis or suspected subarachnoid haemorrhage **auto-escalates** the
triage tier to **emergency** regardless of the other axes.

## Safety thresholds

| Concern | Threshold / rule |
| --- | --- |
| Raised intracranial pressure | Image (CT head) and stabilise before LP if suspected ICP, new focal neurological signs, or reduced consciousness (GCS ≤ 9) |
| INR | LP generally avoided / delayed if INR > 1.5 |
| Platelet count | LP generally avoided if platelets < 40–50 ×10⁹/L |
| Anticoagulation | Hold / reverse and discuss with haematology before LP |
| Local infection | Skin / soft-tissue infection at the puncture site is a contraindication |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB |
| 3 | Procedure & indication | procedure intent, primary indication, specific clinical question, relevant history |
| 4 | Raised-ICP / neuro safety | suspected raised ICP, focal neurological signs, reduced consciousness, CT head status |
| 5 | Bleeding / coagulation safety | anticoagulant + agent, antiplatelet + agent, INR, platelet count, bleeding disorder, local skin infection |
| 6 | Procedure detail & triage | opening-pressure required, requested urgency, requested-by date, setting, notes; computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
suspected-raised-icp-needs-imaging, suspected-meningitis-emergency,
coagulopathy, high-bleeding-risk-anticoag, thrombocytopenia, local-infection,
missing-indication, missing-clinical-question, other.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
lumbar-puncture-test-request/
  index.md                          # this file
  AGENTS.md                         # agent instructions
  plan.md                           # implementation roadmap
  tasks.md                          # task tracking
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

- NICE NG240 *Meningitis (bacterial) and meningococcal disease: recognition,
  diagnosis and management* — neuroimaging prior to LP; do not routinely image,
  but image and stabilise first when raised ICP is suspected (new focal signs,
  abnormal pupils, GCS ≤ 9). <https://www.nice.org.uk/guidance/ng240>
- NICE NG240 evidence — *Role of neuroimaging prior to lumbar puncture*.
  <https://www.nice.org.uk/guidance/ng240/evidence/b5-role-of-neuroimaging-prior-to-lumbar-puncture-pdf-481072534164>
- NICE quality standard QS19 — *Lumbar puncture*.
  <https://www.nice.org.uk/guidance/qs19/chapter/Quality-statement-2-Lumbar-puncture>
- Subarachnoid haemorrhage / CSF xanthochromia — LP at ≥ 12 h after headache
  onset for spectrophotometry when CT is negative.
- Association of British Neurologists / haematology guidance — LP generally safe
  with platelets ≥ 40 ×10⁹/L and INR ≤ 1.5; avoid / delay otherwise.
  <https://www.stroke-manual.com/lumbar-puncture-and-antithrombotic-therapy/>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / safety vetting.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form lumbar-puncture-test-request
```
