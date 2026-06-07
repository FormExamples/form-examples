# Clinical Guideline Alignment — Operation Note

## Royal College of Surgeons of England — Good Surgical Practice

- *Good Surgical Practice* index:
  https://www.rcseng.ac.uk/standards-and-research/standards-and-guidance/good-practice-guides/good-surgical-practice/
- Domain 1 (Knowledge, skills and development), Domain 3 (Communication,
  partnership and teamwork) and Domain 4 (Maintaining trust) define
  expectations for the contemporaneous operative record.

The RCS minimum operation-note dataset informs the wizard step ordering.

| RCS dataset item | Form step |
| --- | --- |
| Date and time of operation | Step 1 patient details / Step 2 procedure details |
| Elective / emergency | Step 2 |
| Names of operating surgeon and assistant | Step 3 surgical team |
| Name of theatre anaesthetist | Step 3 |
| Operative procedure carried out | Step 2 |
| Incision | Step 4 intra-operative findings |
| Operative diagnosis | Step 4 |
| Operative findings | Step 4 |
| Any extra procedure performed and the reason why it was performed | Step 4 |
| Details of tissue removed, added or altered | Step 7 specimens & implants |
| Identification of any prosthesis used, including the serial numbers of prostheses and other implanted materials | Step 7 |
| Details of closure technique | Step 4 |
| Anticipated blood loss | Step 6 EBL & fluid balance |
| Antibiotic prophylaxis (where applicable) | Step 5 anaesthesia summary |
| DVT prophylaxis (where applicable) | Step 10 post-op plan |
| Detailed postoperative care instructions | Step 10 |
| Signature | Step 10 |

## WHO Surgical Safety Checklist

- WHO safe-surgery index:
  https://www.who.int/teams/integrated-health-services/patient-safety/research/safe-surgery
- Reference paper: Haynes AB, Weiser TG, Berry WR, et al. *A surgical safety
  checklist to reduce morbidity and mortality in a global population.* N Engl
  J Med. 2009;360(5):491-499. DOI: 10.1056/NEJMsa0810119.

Sign-out items map to step 4 (counts) and step 8 (specimen labelling, key
concerns for recovery).

## NICE NG45 — Routine preoperative tests

- https://www.nice.org.uk/guidance/ng45 (referenced only by carry-forward
  of pre-operative results; this form does not order tests).

## NICE NG143 / NG51 — Sepsis recognition

- Sepsis guideline index:
  https://www.nice.org.uk/guidance/ng51
- Where intra-operative sepsis is suspected, the form's free-text complication
  field references the NG51 escalation pathway.

## NHS England Never Events framework

- https://www.england.nhs.uk/patient-safety/patient-safety-insight/never-events/
- The current list (e.g., wrong-site surgery, retained foreign object,
  wrong implant/prosthesis) is the source for the form's never-event
  suspicion checkbox.

## Audit standards

- Royal College of Anaesthetists *Raising the Standard* audit recipes
  cover intra-operative anaesthetic events.
  https://rcoa.ac.uk/research/research-bodies/quality-improvement/audit-recipe-book

## Data interoperability

- HL7 FHIR R5 Procedure resource (https://hl7.org/fhir/R5/procedure.html)
  is the export target for the structured op note.
- SNOMED CT UK Clinical Edition for procedure coding (where assigned in
  the parent EHR).
