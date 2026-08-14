# GOLD staging rules

## Instrument

The **Global Initiative for Chronic Obstructive Lung Disease (GOLD)** report
defines the spirometric severity of airflow limitation in COPD using
post-bronchodilator FEV1 as a percentage of the predicted value, applied
**only to patients with confirmed COPD** (post-bronchodilator FEV1/FVC <
0.70).

The form implements the GOLD 1-4 spirometric severity grading **and** the
GOLD A-B-E group assessment introduced in the GOLD 2023 report.

- Global Initiative for Chronic Obstructive Lung Disease. *Global Strategy for
  the Diagnosis, Management, and Prevention of Chronic Obstructive Pulmonary
  Disease, 2024 Report*. <https://goldcopd.org/2024-gold-report/>

## Diagnostic gate

A GOLD stage is **not** assigned unless the patient has:

- Persistent respiratory symptoms (dyspnoea, chronic cough, sputum,
  exacerbations).
- Post-bronchodilator FEV1/FVC < 0.70.

If FEV1/FVC ≥ 0.70 the form returns "not COPD by GOLD" and recommends
alternative diagnoses (asthma, bronchiectasis, interstitial lung disease).

## Severity grade by FEV1 % predicted

| GOLD grade | Post-bronchodilator FEV1 % predicted | Severity |
| --- | --- | --- |
| GOLD 1 | ≥ 80% | Mild |
| GOLD 2 | 50% ≤ FEV1 < 80% | Moderate |
| GOLD 3 | 30% ≤ FEV1 < 50% | Severe |
| GOLD 4 | < 30% | Very severe |

## GOLD A-B-E group (2023+)

Combines symptom burden and exacerbation history.

| Group | Symptoms | Exacerbation history |
| --- | --- | --- |
| A | Low (mMRC 0-1 or CAT < 10) | 0 or 1 moderate, **not** hospitalized |
| B | High (mMRC ≥ 2 or CAT ≥ 10) | 0 or 1 moderate, **not** hospitalized |
| E | Any | ≥ 2 moderate **or** ≥ 1 hospitalization |

mMRC = modified Medical Research Council Dyspnoea Scale.
CAT = COPD Assessment Test (Jones PW et al. *Eur Respir J* 2009;34:648-54.
PMID: 19720809).

## Symptom instruments

### mMRC Dyspnoea Scale
| Grade | Description |
| --- | --- |
| 0 | Breathless only with strenuous exercise |
| 1 | Short of breath when hurrying or walking up a slight hill |
| 2 | Walks slower than people of the same age, or stops for breath |
| 3 | Stops for breath after walking 100 m or after a few minutes on level ground |
| 4 | Too breathless to leave the house or breathless when dressing |

### CAT
8 items × 0-5 each; total 0-40. Cut-points: <10 low impact, 10-20 medium,
21-30 high, >30 very high.

## Exacerbation history

Per GOLD, a **moderate exacerbation** is one requiring antibiotics and/or
oral corticosteroids; a **severe exacerbation** is one requiring
hospitalization or A&E visit. The frequent-exacerbator phenotype (≥ 2/year)
predicts ≥ 2 in the following year and triggers escalation per Hurst JR et
al. *N Engl J Med* 2010;363:1128-38. PMID: 20843247.

## Flagged-issue triggers

- GOLD 3 or 4 (FEV1 < 50%) → respiratory specialist referral.
- GOLD group E → triple therapy (ICS + LABA + LAMA) per GOLD 2024 Track 2.
- BMI < 21 + FEV1 < 50% → flag for cachexia / pulmonary rehab (BODE index
  risk).
- Current smoker → mandatory smoking cessation referral.
- Eosinophil count ≥ 300 cells/µL → ICS likely beneficial per GOLD.
- α1-antitrypsin not measured → flag (recommended once per patient per GOLD).

## See also

- [clinical-guideline-alignment.md](clinical-guideline-alignment.md)
- [assessment-protocol.md](assessment-protocol.md)
- [safety-case-notes.md](safety-case-notes.md)
- [references.md](references.md)
