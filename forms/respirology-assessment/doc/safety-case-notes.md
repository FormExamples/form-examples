# Safety case notes

## Intended use

A structured-data capture form for a general respiratory consultation. It
records MRC dyspnoea grade, cough impact (LCQ), pulmonary function, and
exposure history; it does not make a specific diagnosis.

## Intended user

Respiratory physician, GP, respiratory nurse specialist, or respiratory
physiotherapist acting within their normal scope of practice.

## Risk classification (MDCG 2019-11 Rev.1)

- **Class:** Class I medical device software.
- **Rationale:** The output is descriptive and triage-oriented (referrals,
  pulmonary-rehab flags); it does not drive specific drug therapy
  escalation in the way the pulmonology-assessment form does.

## Foreseeable misuse

| Misuse | Mitigation |
| --- | --- |
| Use without spirometry context for chronic dyspnoea | Step 6 captures spirometry; clinician sign-off required |
| Missed haemoptysis 2-week-wait referral | Hard flag if haemoptysis + smoker per NICE NG12 |
| MRC grade self-assessed in error | Patient-completed grade is highlighted and clinician-confirmed |

## Regulatory framework

- EU MDR 2017/745 Rule 11.
- UK Medical Devices Regulations 2002.
- MHRA *Software and AI as a medical device*, 2022.
- ISO 14971:2019.
- IEC 62304:2006+A1:2015.

## Clinical evidence base

- Fletcher CM et al. *BMJ* 1959;2:257-66 — original MRC scale. PMID: 13823380
- NICE NG115 COPD. <https://www.nice.org.uk/guidance/ng115>
- NICE NG12 Suspected cancer. <https://www.nice.org.uk/guidance/ng12>
- ERS chronic cough guideline 2020. PMID: 31515408
- Birring SS et al. *Thorax* 2003;58:339-43 — LCQ. PMID: 12668799

## Patient-safety alerts

- Acute haemoptysis: immediate red-flag with 2-week-wait referral and
  resuscitation pathway.
- SpO2 < 88% at rest: clinician review and oxygen assessment.
- Subacute cough >3 weeks in a current smoker over 40: 2-week-wait CXR.

## See also

- [mrc-dyspnoea-scale.md](mrc-dyspnoea-scale.md)
- [clinical-guideline-alignment.md](clinical-guideline-alignment.md)
- [references.md](references.md)
