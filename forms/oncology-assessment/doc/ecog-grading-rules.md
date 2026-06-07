# ECOG Performance Status Rules

The Eastern Cooperative Oncology Group (ECOG) Performance Status, also
known as the Zubrod Score or WHO Performance Status, is a 6-point
clinician-rated scale describing how a patient's disease affects daily
living abilities. It is the most widely used performance-status
instrument in oncology, used internationally for treatment eligibility,
clinical trial entry, and prognosis.

- Original publication: Oken MM, Creech RH, Tormey DC, Horton J, Davis
  TE, McFadden ET, Carbone PP. *Toxicity and response criteria of the
  Eastern Cooperative Oncology Group.* American Journal of Clinical
  Oncology 1982; 5(6): 649-655. PMID: 7165009.
- ECOG-ACRIN web page describing the scale.
  https://ecog-acrin.org/resources/ecog-performance-status/

## Scale (verbatim)

| Grade | Description |
| --- | --- |
| 0 | Fully active, able to carry on all pre-disease performance without restriction |
| 1 | Restricted in physically strenuous activity but ambulatory and able to carry out work of a light or sedentary nature, e.g. light house work, office work |
| 2 | Ambulatory and capable of all selfcare but unable to carry out any work activities; up and about more than 50 % of waking hours |
| 3 | Capable of only limited selfcare; confined to bed or chair more than 50 % of waking hours |
| 4 | Completely disabled; cannot carry on any selfcare; totally confined to bed or chair |
| 5 | Dead |

The wording above is taken verbatim from the ECOG-ACRIN site and Oken
1982. The phrasing is not modified by this engine.

## Karnofsky equivalence (informative)

The Karnofsky Performance Status (KPS) is an older 0-100 instrument
used in similar settings. The approximate equivalence used in
oncology literature is:

| ECOG | KPS approx |
| --- | --- |
| 0 | 90-100 |
| 1 | 70-80 |
| 2 | 50-60 |
| 3 | 30-40 |
| 4 | 10-20 |
| 5 | 0 |

This mapping is informative only — the two scales are not
inter-convertible at the individual-patient level and the engine does
not auto-convert between them.

## Use in treatment decisions

ECOG ≥ 2 is widely used as a cut-off for systemic chemotherapy
eligibility in many tumour-specific guidelines (NICE, NCCN, ESMO).
ECOG ≥ 3 strongly suggests symptom-focused / palliative care rather than
disease-modifying treatment.

The engine emits informational flags:

| Rule ID | Condition | Flag |
| --- | --- | --- |
| R-ECOG-3 | ECOG ≥ 3 | Consider palliative-care referral |
| R-ECOG-4 | ECOG = 4 | Urgent palliative-care review |
| R-ECOG-DECLINE | ECOG worsened by ≥ 2 grades vs prior recorded | Disease deterioration alert |

The engine does not auto-recommend a specific systemic therapy or a
treatment line. Those decisions remain with the oncology MDT.

## Symptom screening (CTCAE alignment)

Symptom and toxicity fields on Steps 5 and 6 are aligned to the
National Cancer Institute *Common Terminology Criteria for Adverse
Events (CTCAE)* version 5.0 grading conventions where applicable
(Grade 1 mild → Grade 5 death). Source:
https://ctep.cancer.gov/protocolDevelopment/electronic_applications/ctc.htm

CTCAE-graded fields are clinician-completed (not patient self-report)
and the engine surfaces any Grade 3+ toxicity as a high-priority flag
for MDT review.
