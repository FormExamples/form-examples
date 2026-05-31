# Medical Operation Note

A surgical operation note ("op note") is the legal contemporaneous record
written by the operating team immediately after a procedure. It documents
who did what, what was found, what was used, what was left behind, what
went wrong, and what the post-operative plan is. It supports continuity
of care, anaesthetic recovery, ward handover, theatre auditing, and
medico-legal defence.

This form is a UK NHS– and Royal College of Surgeons–aligned structured
op note implemented as a single-page step-by-step wizard. It collects
**operative findings recorded by the operating team** (lead surgeon,
assistant, anaesthetist, scrub nurse), computes a **composite operative
risk grade** (Routine / Complicated / High-risk / Critical) and a set of
safety flags (incorrect count, retained item, conversion to open,
unplanned ICU admission, intra-operative complication, EBL exceeding
1.5 L, transfusion required, anaesthetic incident, never-event suspicion),
and emits a signed PDF report and FHIR R5 `Procedure` bundle suitable
for the electronic health record.

## Scope and intended users

- **Setting:** NHS operating theatre, day-surgery unit, interventional
  suite, trauma theatre, obstetric theatre, dental theatre, endoscopy
  suite.
- **Users:** consultant surgeons, surgical registrars, foundation
  trainees writing under supervision, anaesthetists, theatre scrub
  nurses, theatre coordinators.
- **Patients:** adults and children of any age undergoing elective,
  urgent, emergency, or immediate surgery under general, regional, or
  local anaesthesia.

## Scoring system

- **Primary instrument:** composite operative risk grade
  (Routine / Complicated / High-risk / Critical), driven by the
  worst-band finding across estimated blood loss, complications,
  conversion to open, swab/needle/instrument count discrepancies,
  retained items, unplanned post-op disposition, and anaesthetic
  events. Algorithm is **max-grade** — the worst finding sets the
  composite grade; Routine is the default when no rules fire.
- **Secondary instruments:**
  - **WHO Surgical Safety Checklist** sign-out items (count
    confirmed, specimen labelled, equipment problems addressed,
    key concerns for recovery communicated).
  - **Clavien–Dindo** classification for any intra-operative
    complication (I, II, IIIa, IIIb, IVa, IVb, V).
  - **ASA Physical Status** carried over from the pre-operative
    assessment (I–VI), used as a context modifier for composite risk.

| Band | Drivers |
| --- | --- |
| Routine | EBL ≤ 500 mL, no complications, counts correct, no conversion, planned disposition, Clavien–Dindo 0, ASA I–II |
| Complicated | EBL 500–1500 mL, Clavien–Dindo I–II, minor anaesthetic event, planned step-up to enhanced care |
| High-risk | EBL 1500–3000 mL, Clavien–Dindo IIIa–IIIb, transfusion required, conversion to open, unplanned HDU/ICU admission, ASA IV |
| Critical | EBL > 3000 mL, Clavien–Dindo IVa–V, count discrepancy unresolved, retained foreign body suspected, never-event suspicion, intra-operative arrest, ASA V–VI |

## 12-step operating-team wizard

Completed in order on a single page. Each step collects **objective
operating-team findings** documented immediately after the procedure,
before the team leaves the theatre.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Operation identification | hospital, theatre / OR number, list type (elective / CEPOD / trauma / obstetric), case start time, anaesthesia start time, knife-to-skin time, end of surgery time, case end time |
| 2 | Patient identification | NHS number, MRN, name, date of birth, sex, weight, height, allergies summary, consent status, side marked, WHO Sign-In completed |
| 3 | Surgical team | lead surgeon (name, GMC), first assistant, second assistant, anaesthetist (name, GMC), ODP, scrub nurse, circulating nurse, students present |
| 4 | Diagnoses & procedures | pre-operative diagnosis, post-operative diagnosis, planned procedure(s), procedures actually performed, OPCS-4 codes, urgency (NCEPOD), laterality, indication |
| 5 | Anaesthesia | type (GA / regional / neuraxial / sedation / MAC / local), airway (face-mask / supraglottic / ETT / awake FOI / surgical airway), induction agent, maintenance agent, neuromuscular blockade, regional block details, lines and monitoring, intra-operative fluids (crystalloid mL, colloid mL, blood mL), anaesthetic events |
| 6 | Position, prep & approach | patient position, pressure-area protection, prep solution, drapes, surgical approach, incision type and length (cm), table tilt, tourniquet (site, pressure, time on/off) |
| 7 | Operative findings & technique | numbered free-text step-by-step technique, pathology found, anatomical anomalies, intra-operative photographs taken (yes/no), frozen-section requested (yes/no) |
| 8 | Materials, implants & prostheses | sutures (type, gauge, count), staples, clips, mesh, screws, plates, prosthetic joints, vascular grafts, lot / serial / batch / expiry numbers, manufacturer, registry submitted |
| 9 | Drains, packs & specimens | drains placed (type, site, output target, removal plan), packs left in situ (count, removal-by date), urinary catheter, NG tube, specimens sent (label, container, fixative, pathology destination, urgent / routine) |
| 10 | Safety, counts, EBL & complications | swab count first / final agreed, needle count first / final agreed, instrument count first / final agreed, count discrepancy resolution, estimated blood loss (mL), transfusion given (units PRBC / FFP / platelets / cryo), intra-operative complications (Clavien–Dindo grade, description), never-event flagged |
| 11 | Post-operative plan | recovery destination (PACU / ward / enhanced care / HDU / ICU / day-case discharge), monitoring frequency, IV fluids, analgesia plan, antibiotics, VTE prophylaxis, diet, mobilisation, wound care, drain removal plan, follow-up plan, special instructions, debrief completed (WHO Sign-Out) |
| 12 | Summary, grade & sign-off | computed composite risk grade + fired rules, ASA carried over, Clavien–Dindo, safety flags, surgeon override + reason (optional), final attestation, electronic signature, dictation timestamp |

## Safety flags

Computed independently of the composite grade. Priority: high / medium / low.

- **Incorrect count** — swab / needle / instrument count discrepancy
  unresolved at sign-out (high).
- **Retained foreign body** — declared retained item (high; never-event
  candidate).
- **Wrong-site / wrong-side / wrong-patient / wrong-procedure** — any
  WHO never-event candidate flagged (high; statutory report).
- **Unplanned ICU admission** — post-op disposition more intensive than
  pre-op plan (high).
- **Massive haemorrhage** — EBL > 1500 mL or > 30 % blood volume (high).
- **Massive transfusion** — ≥ 4 units PRBC intra-operative or massive
  haemorrhage protocol activated (high).
- **Conversion to open** — planned laparoscopic / endoscopic /
  arthroscopic / robotic case converted to open (medium).
- **Intra-operative arrest** — cardiac or respiratory arrest in theatre
  (high).
- **Anaesthetic incident** — failed intubation, awareness, anaphylaxis,
  malignant hyperthermia, suxamethonium apnoea (high).
- **Implant registry pending** — implant placed but registry submission
  not yet confirmed (medium).
- **Specimen labelling issue** — specimen sent without complete labelling
  or chain-of-custody (medium).
- **Equipment problem** — equipment failure or sterility breach (medium).
- **Documentation gap** — required field missing at sign-off (low).

## Output

- **HTML report preview** and downloadable **PDF** via `pdfmake`.
- **FHIR R5 Bundle** with `Procedure`, `Encounter`, `Observation`,
  `Specimen`, `Device`, and `DeviceUseStatement` resources.
- **XML** representation per SQL table for archival.
- **Op note suitable for inclusion in the surgical record**, WHO Safer
  Surgery Checklist Sign-Out, and ward handover.

## Directory structure

```
medical-operation-note/
  index.md                                          # this file
  AGENTS.md                                         # agent instructions
  CLAUDE.md                                         # Claude Code project instructions
  plan.md                                           # implementation roadmap
  tasks.md                                          # task tracking
  seed.md                                           # source seed material
  doc/                                              # clinical reference documentation
  sql-migrations/                                   # Liquibase Postgres migrations
  xml-representations/                              # XML + DTD per SQL table (generated)
  fhir-r5/                                          # FHIR HL7 R5 JSON per SQL entity (generated)
  protobuf/                                         # Protocol Buffers .proto per SQL entity (generated)
  openapi/                                          # OpenAPI 3.1 .yaml per SQL entity (generated)
  front-end-form-with-html/                         # static single-page op-note wizard
  front-end-form-with-svelte/                       # SvelteKit single-page op-note wizard
  front-end-dashboard-with-html/                    # HTML review table
  front-end-dashboard-with-svelte/                  # SvelteKit SVAR DataGrid review dashboard
  full-stack-with-loco-tera-htmx-alpine/            # Rust backend with server-rendered HTMX UI
  full-stack-with-loco-tera-htmx-alpine-setup       # cargo loco scaffold script (generated)
```

## Clinical grounding

- **Royal College of Surgeons of England** — *Good Surgical Practice* (2014,
  updated 2023), §3.5 *Record-keeping and the operation note*.
- **WHO Surgical Safety Checklist** (2009, 2nd edition) — Sign-In,
  Time-Out, and Sign-Out items embedded in steps 2, 6, and 11.
- **NHS England Never Events Policy and Framework** (2018) — wrong-site
  surgery, wrong implant, retained foreign object.
- **Clavien–Dindo classification of surgical complications** (Ann Surg
  2004; 240:205).
- **NCEPOD Classification of Intervention** (urgency: elective /
  scheduled / urgent / immediate).
- **OPCS-4** procedure coding (NHS Digital).
- **CQC Regulation 17** — good governance, accurate records.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA Software and AI as a Medical Device.
