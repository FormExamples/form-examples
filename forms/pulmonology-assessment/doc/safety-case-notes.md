# Safety case notes

## Intended use

A structured-data capture form for a pulmonology consultation in adults
with suspected or confirmed COPD. It applies the GOLD 2024 grading and A-B-E
group logic and recommends a pharmacotherapy track.

## Intended user

Respiratory physician, GP, advanced respiratory nurse, or respiratory
physiotherapist acting within their normal scope of practice.

## Risk classification (MDCG 2019-11 Rev.1)

- **Class:** Class IIa medical device software (Rule 11).
- **Rationale:** The output is used to drive inhaler treatment escalation,
  pulmonary rehabilitation referral, and long-term oxygen therapy
  consideration; misuse could result in foreseeable harm (under-treatment of
  severe COPD, ICS exposure where not warranted).

## Foreseeable misuse

| Misuse | Mitigation |
| --- | --- |
| GOLD grade applied without confirmed COPD diagnosis | Hard gate: form blocks grading if post-BD FEV1/FVC ≥ 0.70 |
| Spirometry without bronchodilator | Step 3 requires explicit pre/post bronchodilator results |
| Triple therapy escalation without ICS responsiveness check | Flag if eosinophils not recorded |
| Missed α1-antitrypsin deficiency | One-off "α1-AT measured" check across patient lifetime |

## Regulatory framework

- EU MDR 2017/745 Rule 11.
- UK Medical Devices Regulations 2002.
- MHRA *Software and AI as a medical device*, 2022.
- ISO 14971:2019.
- IEC 62304:2006+A1:2015.

## Clinical evidence base

- GOLD 2024 Report. <https://goldcopd.org/2024-gold-report/>
- NICE NG115 COPD. <https://www.nice.org.uk/guidance/ng115>
- BTS Pulmonary Rehabilitation Guideline 2013. *Thorax* 2013;68:ii1-ii30.
  PMID: 23880483

## Patient-safety alerts

- The engine raises an "acute respiratory failure" alert if reported
  SpO2 < 88% on air or recent PaCO2 > 6 kPa with hypoxaemia, triggering
  immediate clinician review.
- The engine raises a "consider LTOT" flag for resting PaO2 ≤ 7.3 kPa.

## Data protection

- Spirometry and inhaler-use data are special-category under UK GDPR Art.9.
- Lawful basis: Art.9(2)(h).
- Encryption at rest (AES-256) and in transit (TLS 1.3).

## See also

- [gold-staging-rules.md](gold-staging-rules.md)
- [clinical-guideline-alignment.md](clinical-guideline-alignment.md)
- [assessment-protocol.md](assessment-protocol.md)
- [references.md](references.md)
