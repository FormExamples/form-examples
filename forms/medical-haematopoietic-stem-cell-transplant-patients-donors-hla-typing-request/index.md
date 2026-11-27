# Medical Haematopoietic Stem Cell Transplant Patients/Donors HLA Typing Request

A generic **HLA typing request for haematopoietic stem cell transplant (HSCT) patients and potential donors**, completed by a haematology or transplant clinician. One form is completed per person sampled: either the recipient, or a relative who may donate. For a relative, the recipient details and relationship are given so the laboratory can pair the samples.

It is jurisdiction-neutral and not tied to any health service, laboratory or region. Locations, units,
identifiers and turnaround targets are free text or configurable local policy.

## Scope and intended users

- **Setting:** haematology and bone-marrow-transplant units, transplant immunology laboratory.
- **Users:** haematologists, transplant physicians and coordinators, nurses, phlebotomists, laboratory vetting staff.
- **Patients:** HSCT recipients and potential related or unrelated donors.

## Scoring system

Four independent axes. There is **no published score** for this kind of request, so the 1-9 axis is
anchored on laboratory-standard guidance and labelled as such.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | Role, donor type and clinical details coherent; linked recipient present for a relative (1-9, anchored on EFI and BSHI/BTS guidance) | usually-appropriate / may-be-appropriate / usually-not-appropriate |
| **B. Identity / sample safety** | 3 identifiers, form matches sample, right tubes and volumes for the role, consent confirmed | ok / caution / reject-risk |
| **C. Completeness** | Mandatory fields (name, record number, identifier, sex, ethnicity, date of birth) weighted highest | 0-100 % |
| **D. Triage** | Urgent flag | routine / urgent / emergency / stat |

### Derived sample requirements

| Role | Samples |
| --- | --- |
| HSCT recipient | 18 mL EDTA (purple) + 6 mL EDTA (pink, hand-labelled) + 6 mL clotted (red) |
| Potential donor (relative) | 10 mL EDTA (purple) + 6 mL EDTA (pink, hand-labelled) |

Volumes are common-practice defaults, configurable per laboratory. The source form has no test menu: the test is HLA typing; resolution is an optional addition here.

## Wizard steps

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Person sampled | role, name, previous name, date of birth, sex, ethnicity, identifiers, address |
| 2 | Referrer and report | name, role, department, organization, report email, copy-to |
| 3 | Clinical details | disease and indication, donor type, resolution |
| 4 | Linked recipient | for a relative: recipient name, record number, date of birth, relationship |
| 5 | Urgency | urgent flag and reason |
| 6 | Requester and consent | signature, consent confirmation |
| 7 | Sample collection | collector, date and time, identifier counts, match, volumes |
| 8 | Laboratory use | recipient and donor identifiers, sample number, received date and time |

The report page after submit is the review: grades for axes A-D, fired rules, flags, derived samples and the recommendation.

## Safety flags

| Flag | Fires when |
| --- | --- |
| donor-without-recipient-details | potential donor with no linked recipient |
| sample-volume-insufficient | volumes below the role requirement |
| identity-mismatch-risk | fewer than 3 identifiers or form and sample do not match |
| urgent-without-reason | urgent requested with no reason |
| missing-ethnicity | ethnicity blank (mandatory on source) |
| no-clinical-details | clinical details blank |

## Output

A vetting report: grades for axes A-D, fired rules, flags with suggested actions and a recommendation (accept / query-referrer / reject).

## Assessment of the source form

See [`doc/assessment.md`](doc/assessment.md): research, assessment and advice.

## Directory structure

See the repo-wide layout in the root `AGENTS.md`. Built: `sql/` and its generated representations, the HTML front-end (`front-end-with-html/`) and the SvelteKit front-end (`front-end-with-svelte/`). The Axum back-end (`back-end-with-axum/`) is built.

## Clinical references

See [`doc/clinical-references.md`](doc/clinical-references.md).

## Compliance

Decision support for laboratory request vetting; it does not replace laboratory judgment. MDR/IVDR software classification to be confirmed per MDCG 2019-11 before any clinical deployment.

## Verify

```sh
bin/test-form medical-haematopoietic-stem-cell-transplant-patients-donors-hla-typing-request
bin/test-sql-apply medical-haematopoietic-stem-cell-transplant-patients-donors-hla-typing-request
bin/test-form-namespacing medical-haematopoietic-stem-cell-transplant-patients-donors-hla-typing-request
```
