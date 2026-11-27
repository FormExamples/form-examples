# Medical Human Leukocyte and Disease Association Request

A generic **HLA typing request for disease association or drug-hypersensitivity screening**, completed by a consultant or general practitioner. It asks a laboratory to type specific HLA alleles linked to a condition (HLA-A29, B27, B51, B*57:01, DR15/DQ6, DQ2/DQ8, DQA1*05, or another named association), with free-text clinical details, report destination and a high-risk-sample flag.

It is jurisdiction-neutral and not tied to any health service, laboratory or region. Locations, units,
identifiers and turnaround targets are free text or configurable local policy.

## Scope and intended users

- **Setting:** rheumatology, ophthalmology, gastroenterology, neurology, HIV / infectious-disease and primary-care practices; transplant immunology laboratory.
- **Users:** consultants, general practitioners, specialist nurses, pharmacists, phlebotomists, laboratory vetting staff.
- **Patients:** any patient with a suspected HLA-associated condition, or about to start a drug with an HLA-linked hypersensitivity risk.

## Scoring system

Four independent axes. There is **no published score** for this kind of request, so the 1-9 axis is
anchored on laboratory-standard guidance and labelled as such.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | Test vs clinical details and indication category; duplicate of a known result; pre-treatment testing (1-9, anchored on guideline use of each HLA test) | usually-appropriate / may-be-appropriate / usually-not-appropriate |
| **B. Identity / sample safety** | 3 identifiers, form matches sample, 5-10 mL EDTA, high-risk sample labelled, consent (including genetic) confirmed | ok / caution / reject-risk |
| **C. Completeness** | Clinical details, indication, report destination, sample details weighted highest | 0-100 % |
| **D. Triage** | Pre-treatment drug-hypersensitivity testing, urgent flag | routine / urgent / emergency / stat |

### Requested tests (8)

| Test | Typical use |
| --- | --- |
| HLA-A29 | birdshot chorioretinopathy |
| HLA-B27 | ankylosing spondylitis, uveitis |
| HLA-B51 | Behcet disease |
| HLA-B*57:01 | abacavir hypersensitivity (pre-prescribing safety test) |
| HLA-DR15/DQ6 | narcolepsy |
| HLA-DQ2/DQ8 | coeliac disease (strong negative predictive value) |
| HLA-DQA1*05 | anti-TNF treatment response in Crohn disease (emerging; evidence limited) |
| Other HLA-disease association | specify the allele or antigen |

Sample: 5-10 mL EDTA for every test.

## Wizard steps

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Patient | name, previous name, date of birth, sex, ethnicity, identifiers, address |
| 2 | Referrer and report | name, role, department, organization, report email, copy-to |
| 3 | Tests | 8 tests, other-HLA specification |
| 4 | Clinical details | indication category, free text, planned drug, previous HLA typing |
| 5 | Urgency and risk | urgent flag and reason, high-risk sample and description |
| 6 | Requester and consent | signature, consent confirmation |
| 7 | Sample collection | collector, date and time, identifier counts, match, volume |
| 8 | Laboratory use | sample number, received date and time, identifiers checked by |

The report page after submit is the review: grades for axes A-D, fired rules, flags and the recommendation.

## Safety flags

| Flag | Fires when |
| --- | --- |
| no-clinical-details | clinical details blank |
| abacavir-start-pending | HLA-B*57:01 with a planned drug: treat as time-critical pre-prescribing test |
| previous-hla-result-possible-duplicate | patient already HLA typed: HLA type is lifelong |
| high-risk-sample | sample flagged high risk: laboratory handling precautions |
| identity-mismatch-risk | fewer than 3 identifiers or form and sample do not match |
| report-destination-missing | no report email or copy-to |

## Output

A vetting report: grades for axes A-D, fired rules, flags with suggested actions and a recommendation (accept / query-referrer / reject).

## Assessment of the source form

See [`doc/assessment.md`](doc/assessment.md): research, assessment and advice.

## Directory structure

See the repo-wide layout in the root `AGENTS.md`. Built: `sql/` and its generated representations, the HTML front-end (`front-end-with-html/`) and the SvelteKit front-end (`front-end-with-svelte/`). The Axum back-end is the next phase.

## Clinical references

See [`doc/clinical-references.md`](doc/clinical-references.md).

## Compliance

Decision support for laboratory request vetting; it does not replace laboratory judgment. MDR/IVDR software classification to be confirmed per MDCG 2019-11 before any clinical deployment.

## Verify

```sh
bin/test-form medical-human-leukocyte-and-disease-association-request
bin/test-sql-apply medical-human-leukocyte-and-disease-association-request
bin/test-form-namespacing medical-human-leukocyte-and-disease-association-request
```
