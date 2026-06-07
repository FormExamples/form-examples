# Clinical Guideline Alignment

The rheumatology assessment uses DAS28 as the primary scored
instrument. The following authoritative sources informed the field set
and rule catalogue.

## NICE guidance

| Code | Title | URL |
| --- | --- | --- |
| NG100 | Rheumatoid arthritis in adults: management | https://www.nice.org.uk/guidance/ng100 |
| NG65 | Spondyloarthritis in over 16s: diagnosis and management | https://www.nice.org.uk/guidance/ng65 |
| CG177 | Osteoarthritis: care and management | https://www.nice.org.uk/guidance/ng226 (NG226 supersedes CG177) |
| CG79 | Rheumatoid arthritis in adults: management (older) | superseded by NG100 |
| TA | NICE technology appraisals for biologics in RA | https://www.nice.org.uk/guidance/conditions-and-diseases/musculoskeletal-conditions/rheumatoid-arthritis |
| CKS | Clinical Knowledge Summaries — Musculoskeletal | https://cks.nice.org.uk/specialities/musculoskeletal |

## British Society for Rheumatology (BSR)

BSR clinical guidelines: https://www.rheumatology.org.uk/practice-quality/guidelines

Key documents this assessment is compatible with:

- BSR Guideline for the Management of Rheumatoid Arthritis (most recent
  edition).
- BSR Guideline on Methotrexate.
- BSR Guideline on Biologic Therapies.
- BSR Spondyloarthritis (axSpA) guidelines.

## EULAR (European Alliance of Associations for Rheumatology)

- EULAR recommendations for the management of rheumatoid arthritis.
  https://www.eular.org/recommendations
- EULAR recommendations for treat-to-target in RA.

The EULAR T2T paradigm — treating to a target of remission or low
disease activity measured by DAS28 — is the underlying clinical
strategy that this assessment supports.

## American College of Rheumatology (ACR)

ACR guidelines: https://www.rheumatology.org/Practice-Quality/Clinical-Support/Clinical-Practice-Guidelines

Relevant:

- ACR Guideline for the Treatment of Rheumatoid Arthritis (most recent
  edition; updated periodically with EULAR alignment).
- ACR / EULAR 2010 Classification Criteria for RA (Aletaha D et al.,
  Arthritis & Rheumatism 2010; 62(9): 2569-2581. PMID: 20872595). Used
  to confirm the diagnostic basis on Step 4 but not auto-applied as a
  scoring rule.

## What this engine does NOT compute

- We do not compute SDAI (Simplified Disease Activity Index) or CDAI
  (Clinical Disease Activity Index). These are alternative composite
  indices used in some centres; only DAS28 is implemented here.
- We do not compute ASDAS (Ankylosing Spondylitis Disease Activity
  Score) — that is the relevant axial-SpA measure but is not part of
  this RA-focussed form.
- We do not compute the HAQ-DI (Health Assessment Questionnaire
  Disability Index) — Step 9 captures the functional domain at the
  level of an MDHAQ-style screen, not a full HAQ-DI.
- We do not apply ACR / EULAR 2010 classification criteria automatically.

## Patient self-report caveats

The 28-joint count (tender and swollen) is a clinician-examination
field and is **not** a self-report measure. The patient's global
health VAS is self-report. The DAS28 is invalid if the joint counts
are not done by a trained clinician — the report flags this when
self-report joint counts are supplied.
