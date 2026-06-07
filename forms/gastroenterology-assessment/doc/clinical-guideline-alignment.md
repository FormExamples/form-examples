# Clinical Guideline Alignment

The gastroenterology assessment is grounded in UK and US authoritative
GI guidance. The following sources informed which structured fields are
collected and which rules are applied.

## NICE guidance

| Code | Title | URL |
| --- | --- | --- |
| NG12 | Suspected cancer: recognition and referral | https://www.nice.org.uk/guidance/ng12 |
| DG30 | Quantitative faecal immunochemical tests to guide referral for colorectal cancer in primary care | https://www.nice.org.uk/guidance/dg30 |
| CG184 | Gastro-oesophageal reflux disease and dyspepsia in adults | https://www.nice.org.uk/guidance/cg184 |
| NG61 | Irritable bowel syndrome in adults: diagnosis and management | https://www.nice.org.uk/guidance/cg61 (CG61, reissued) |
| NG114 | Cirrhosis in over 16s: assessment and management | https://www.nice.org.uk/guidance/ng50 (NG50, plus update) |
| QS104 | Coeliac disease quality standard | https://www.nice.org.uk/guidance/qs134 |
| NG20 | Coeliac disease: recognition, assessment and management | https://www.nice.org.uk/guidance/ng20 |
| CKS | Clinical Knowledge Summaries — Gastrointestinal topics | https://cks.nice.org.uk/specialities/gastrointestinal-conditions |

The exact NICE codes evolve over time. Where a guideline has been
re-issued under a new code (for example NG143 supersedes CG141 on
gastrointestinal bleeding), this engine maps to the **current published
version** at the parent index URL above; field semantics do not change
between revisions for the rules this engine fires.

## British Society of Gastroenterology (BSG)

- BSG clinical guidelines index. https://www.bsg.org.uk/clinical-resource/clinical-guidelines/
- BSG / Association of Coloproctology of GB and Ireland joint guidance
  on FIT in symptomatic patients.
- BSG / British Association for the Study of the Liver (BASL) joint
  guidance on cirrhosis and decompensated chronic liver disease.

## American College of Gastroenterology (ACG)

- ACG clinical guidelines index.
  https://gi.org/guidelines/
- ACG clinical guideline on dyspepsia (joint with Canadian Association
  of Gastroenterology).
- ACG clinical guideline on the management of GERD.
- ACG / AGA / ASGE joint guideline on colorectal cancer screening.

## Rome IV criteria (functional GI disorders)

Functional bowel symptoms are interpreted against the Rome IV criteria
(2016) published by the Rome Foundation:

- Drossman DA et al. *Rome IV — Functional GI Disorders: Disorders of
  Gut-Brain Interaction.* Gastroenterology 2016; 150(6).
- Rome Foundation site. https://theromefoundation.org

These are not auto-scored by this engine. Step 4 captures whether the
symptom pattern is consistent with IBS per Rome IV (clinician judgement).

## What this engine does NOT score

- We do not compute IBS-SSS (Francis et al. 1997).
- We do not compute the GerdQ score.
- We do not compute the Harvey-Bradshaw Index (HBI) or partial Mayo /
  SCCAI for ulcerative colitis.
- We do not compute Child-Pugh or MELD scores for cirrhosis severity —
  these need laboratory values that are clinician-only fields and would
  belong in a dedicated hepatology form.
- We do not give treatment recommendations.

Future extensions could add condition-specific scoring sub-forms; the
SQL schema supports adding instrument tables without breaking the
core assessment.
