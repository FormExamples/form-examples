# Medical Renal Living Donor Request

A generic **histocompatibility request for a living kidney donor**, completed by a transplant clinician. It asks a transplant immunology laboratory for donor crossmatching (full or virtual), match grading, altruistic-donor work-up, day-of-transplant samples, ABO titres or red-cell antibody follow-up, and records donor and recipient identifiers, relationship, transplant centre and ABO groups. It is the donor-side companion of [medical-renal-transplant-recipient-request](../medical-renal-transplant-recipient-request/).

It is jurisdiction-neutral and not tied to any health service, laboratory or region. Locations, units,
identifiers and turnaround targets are free text or configurable local policy.

## Scope and intended users

- **Setting:** transplant centre, living-donor assessment clinic, transplant immunology laboratory.
- **Users:** transplant surgeons and coordinators, nephrologists, independent assessors, phlebotomists, laboratory vetting staff.
- **Patients:** healthy adult living kidney donors (directed, altruistic or paired-exchange). The donor is a volunteer, not a patient with a disease; donor privacy and independence matter.

## Scoring system

Four independent axes. There is **no published score** for this kind of request, so the 1-9 axis is
anchored on laboratory-standard guidance and labelled as such.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | Test choice vs donation pathway and recipient information (1-9, anchored on EFI and BSHI/BTS guidance) | usually-appropriate / may-be-appropriate / usually-not-appropriate |
| **B. Identity / sample safety** | 3 identifiers, form matches sample, hand-labelled tube present, consent confirmed | ok / caution / reject-risk |
| **C. Completeness** | Mandatory fields; donor identity, pathway, tests, sample details weighted highest | 0-100 % |
| **D. Triage** | Day-of-transplant samples, urgent flag | routine / urgent / emergency / stat |

### Requested tests (7) and derived donor samples

| Test | Typical donor samples |
| --- | --- |
| Full crossmatch | 30 mL EDTA + 6 mL EDTA hand-labelled + 6 mL EDTA for potential ABO titres |
| Virtual crossmatch / match grade | 10 mL EDTA + 6 mL hand-labelled EDTA + 6 mL EDTA for potential ABO titres |
| Altruistic donor work-up | 10 mL EDTA + 6 mL hand-labelled EDTA |
| Day-of-transplant samples | 20 mL EDTA |
| ABO titres only | 6 mL EDTA |
| Follow-up red-cell antibody investigation | 6 mL EDTA |

Volumes are common-practice defaults, configurable per laboratory.

## Wizard steps

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Donor | name, previous name, date of birth, sex, identifiers, address |
| 2 | Recipient | same fields; leave blank for an altruistic donor |
| 3 | Pathway and ABO groups | directed / altruistic / paired exchange; relationship; recipient transplant centre; donor and recipient ABO |
| 4 | Tests | 7 tests, urgent flag + reason |
| 5 | Requester | name, role, centre, signature, consent and identity confirmation |
| 6 | Sample collection | collector, date and time, identifier counts, tubes sent |
| 7 | Laboratory use | laboratory identifiers, sample number, received date and time; submit shows the grading, flags and derived samples |

## Safety flags

| Flag | Fires when |
| --- | --- |
| virtual-crossmatch-without-antibody-profile | virtual crossmatch or match grade requested with no recipient antibody information |
| donor-recipient-abo-incompatible | known donor and recipient ABO groups are incompatible and no ABO titres are requested |
| altruistic-donor-with-recipient | pathway is altruistic but a recipient is recorded |
| donor-and-recipient-on-one-form | donor and recipient identified on one form while samples are from one person (see assessment) |
| missing-abo-group | donor ABO group unknown |
| hand-labelled-sample-required | tests need a hand-labelled EDTA tube and none is recorded |
| identity-mismatch-risk | fewer than 3 identifiers or form and sample do not match |
| urgent-without-reason | urgent requested with no reason |

## Output

A vetting report: grades for axes A-D, fired rules, flags with suggested actions and a recommendation (accept / query-referrer / reject).

## Assessment of the source form

See [`doc/assessment.md`](doc/assessment.md): research, assessment and advice.

## Directory structure

See the repo-wide layout in the root `AGENTS.md`. Built so far: `sql/` and its generated representations. Front-ends and the Axum back-end are the next phase.

## Clinical references

See [`doc/clinical-references.md`](doc/clinical-references.md).

## Compliance

Decision support for laboratory request vetting; it does not replace laboratory judgment. MDR/IVDR software classification to be confirmed per MDCG 2019-11 before any clinical deployment.

## Verify

```sh
bin/test-form medical-renal-living-donor-request
bin/test-sql-apply medical-renal-living-donor-request
bin/test-form-namespacing medical-renal-living-donor-request
```
