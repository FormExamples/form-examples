# Safety case notes

## Intended use

A structured audiology evaluation record. It computes hearing-loss grade
(ASHA + WHO crosswalk) from pure-tone audiometry and captures speech,
tinnitus, vestibular, and communication-impact data to inform hearing-aid
and rehabilitation planning.

## Intended user

HCPC-registered audiologist, ENT clinician, or auditory verbal therapist
acting within scope.

## Risk classification (MDCG 2019-11 Rev.1)

- **Class:** Class IIa medical device software (Rule 11).
- **Rationale:** Output drives hearing-aid candidacy, cochlear implant
  referral, and asymmetric hearing loss MRI workup; misclassification has
  foreseeable harm.

## Foreseeable misuse

| Misuse | Mitigation |
| --- | --- |
| Sudden hearing loss treated as routine | "Onset ≤30 days" gating field triggers AAO-HNS 2019 emergency pathway |
| Asymmetric hearing loss not investigated | Hard flag for ≥15 dB asymmetry at ≥2 frequencies |
| Pure-tone audiometry without calibration | BSA recommended procedure calibration date required |
| Tinnitus without underlying-cause workup | Tinnitus + asymmetric loss → MRI flag |

## Regulatory framework

- EU MDR 2017/745 Rule 11.
- UK Medical Devices Regulations 2002.
- MHRA *Software and AI as a medical device*, 2022.
- ISO 14971:2019.
- IEC 62304:2006+A1:2015.
- BSA Recommended Procedures.

## Clinical evidence base

- ASHA hearing-loss classification.
  <https://www.asha.org/public/hearing/Degree-of-Hearing-Loss/>
- WHO *World Report on Hearing* 2021.
- NICE NG98 (2018), TA566.
- AAO-HNS sudden hearing loss guideline (Chandrasekhar SS et al. 2019).
  PMID: 31369359
- Tinnitus Handicap Inventory (Newman CW et al. 1996). PMID: 8630207

## Patient-safety alerts

- Sudden sensorineural hearing loss within 30 days → emergency ENT.
- Asymmetric sensorineural loss → MRI IAM.
- Severe-profound bilateral loss → cochlear implant referral.
- Persistent tinnitus + suicidal ideation → mental health emergency.

## Data protection

- Audiology data is personal health data; lawful basis Art.9(2)(h).
- Encryption at rest (AES-256) and in transit (TLS 1.3).

## See also

- [grading-rules.md](grading-rules.md)
- [clinical-guideline-alignment.md](clinical-guideline-alignment.md)
- [references.md](references.md)
