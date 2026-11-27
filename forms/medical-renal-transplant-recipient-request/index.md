# Medical Renal Transplant Recipient Request

A generic, jurisdiction-neutral **histocompatibility and immunogenetics request** that a transplant
or dialysis clinician completes for a **kidney, kidney/pancreas or pancreas transplant recipient**.
It asks a transplant immunology laboratory to perform HLA typing, crossmatching, HLA-antibody
monitoring, rejection investigation, ABO-incompatible transplant monitoring or red-cell antibody
follow-up, and tells the laboratory what it needs to interpret the result: organ required,
sensitization history (transplants, transfusions, pregnancies), clinical information, mode of
dialysis and dialysis unit.

The form is completed by a clinician, not the patient. It then computes a **four-axis grading** and a set
of safety flags that support the laboratory's accept / query / reject decision.

It is modelled on the common content of national transplant-laboratory request forms and is not tied to
any health service, laboratory or region. Locations, units, identifiers and turnaround targets are
free text or configurable policy.

## Scope and intended users

- **Setting:** transplant centre, dialysis unit, nephrology outpatient clinic, transplant immunology
  (histocompatibility) laboratory.
- **Users:** nephrologists, transplant surgeons and coordinators, dialysis nurses, phlebotomists,
  and laboratory staff who receive and vet requests.
- **Patients:** adults and children who are, or are being assessed to become, recipients of a kidney,
  kidney/pancreas or pancreas transplant, or who have a failing transplant.
- **Companion form:** `medical-renal-living-donor-request` covers the donor side of a living-donor transplant.

## Scoring system

Four independent axes. There is **no published score** for histocompatibility test selection, so the
1-9 axis is anchored on laboratory-standard guidance and labelled as such.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Test-selection appropriateness** | Coherence of the tests ticked with recipient context, anchored on EFI standards and BSHI/BTS guidance (1-9 ordinal) | usually-appropriate (7-9) / may-be-appropriate (4-6) / usually-not-appropriate (1-3) |
| **B. Identity / sample safety** | Minimum 3 identifiers on form and sample, form matches sample, hand-labelled tube where required, consent and identity confirmed | ok / caution / reject-risk |
| **C. Request completeness** | Mandatory-field checklist; organ, tests, sensitization history, ABO group and sample details weighted highest | 0-100 % (+ missing fields) |
| **D. Triage priority** | Urgent flag, day-of-transplant tests, rejection investigation | routine / urgent / emergency / stat (+ target timeframe) |

The engine also **derives the sample tubes and volumes** the chosen tests need (e.g. 30 mL EDTA +
6 mL hand-labelled EDTA + 12 mL serum for a deceased-donor full crossmatch) so the requester collects
the right tubes first time. Volumes are common-practice defaults and are configurable per laboratory.

### Requested tests (17)

| Group | Tests |
| --- | --- |
| Transplant list registration | first typing and re-typing; returning to list; other (specify) |
| Deceased donor testing | full crossmatch; day of transplant |
| Living donor testing | full crossmatch; day of transplant; virtual crossmatch; match grade; ABO titres only |
| Autologous | autologous crossmatch |
| Routine HLA-antibody monitoring | transplant list; post-transplant list; post-transfusion |
| Investigation | HLA rejection investigation; ABO-incompatible transplant monitoring (DFPP status); follow-up red-cell antibody investigation |

## Wizard steps

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Recipient | name, previous name, date of birth, sex, ethnicity, national health identifier, medical record number, address |
| 2 | Organ required | kidney / kidney-pancreas / pancreas |
| 3 | Sensitization history | transplants, transfusions, pregnancies: counts and dates |
| 4 | Clinical information | autoimmune disease, virology risk, immunosuppression, free text, recipient ABO group |
| 5 | Dialysis | mode of dialysis, dialysis unit |
| 6 | Tests required | 17 tests, urgent flag + reason, DFPP status, transfusion dates, donor reference |
| 7 | Requester | name, role, contact, transplant centre, signature, consent and identity confirmation |
| 8 | Sample collection | collector, date and time, identifier counts, tubes sent |
| 9 | Laboratory use | laboratory identifiers, sample number, received date and time, identifiers checked by |
| 10 | Review | grading, flags, derived sample requirements |

## Safety flags

| Flag | Fires when |
| --- | --- |
| day-of-transplant-stat | a day-of-transplant crossmatch is requested (stat tier) |
| virtual-crossmatch-without-antibody-profile | virtual crossmatch requested with no HLA-antibody monitoring history indicated |
| sensitised-recipient | previous transplant, transfusion or pregnancy recorded |
| missing-abo-group | recipient ABO group unknown or blank |
| abo-incompatible-without-dfpp-status | ABO-incompatible monitoring ticked without DFPP status |
| hand-labelled-sample-required | the tests need a hand-labelled EDTA tube and none is recorded |
| identity-mismatch-risk | fewer than 3 identifiers or form and sample do not match |
| urgent-without-reason | urgent testing requested with no reason |
| missing-sensitization-history | counts left unanswered |
| post-transfusion-without-dates | post-transfusion monitoring without transfusion dates |

## Output

A vetting report: grades for axes A-D, fired rules, flags with suggested actions, derived sample
requirements and a recommendation (accept / query-referrer / reject).

## Assessment of the source form

See [`doc/assessment.md`](doc/assessment.md) for the research, assessment and recommended improvements
over a typical paper request form.

## Directory structure

See the repo-wide layout in the root `AGENTS.md`. Currently built: `sql/` and its generated
representations (`xml/`, `fhir/r5/`, `protobuf/`, `openapi/`, `examples/`). Front-ends and the
Axum back-end are the next phase.

## Clinical references

See [`doc/clinical-references.md`](doc/clinical-references.md).

## Compliance

Decision support for laboratory request vetting; it does not replace laboratory judgment. Likely MDR/IVDR
software classification is to be confirmed per MDCG 2019-11 before any clinical deployment.

## Verify

```sh
bin/test-form medical-renal-transplant-recipient-request
bin/test-sql-apply medical-renal-transplant-recipient-request
bin/test-form-namespacing medical-renal-transplant-recipient-request
```
