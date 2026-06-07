# Safety case notes

## Intended use

A structured hearing-aid candidacy assessment using the HHIE-S and
companion audiogram and lifestyle data. The output is a hearing-aid trial
recommendation, not a hearing-aid prescription.

## Intended user

HCPC-registered audiologist or hearing-aid dispenser acting within scope.

## Risk classification (MDCG 2019-11 Rev.1)

- **Class:** Class I medical device software.
- **Rationale:** Output is a referral / candidacy recommendation, not a
  prescription. Hearing aid selection and verification (REM) remain the
  responsibility of the audiologist.

## Foreseeable misuse

| Misuse | Mitigation |
| --- | --- |
| Fitting a hearing aid without confirming asymmetric loss workup | Asymmetric loss flag in Step 7 blocks fitting recommendation |
| Fitting without REM verification | NICE NG98 mandates REM; form requires REM completion date |
| Self-administered HHIE-S used to bypass clinician | Plain-language disclaimer; clinician sign-off mandatory in Step 9 |
| Ignoring conductive component (e.g. cerumen) | Step 6 Ear Examination required before fitting |

## Regulatory framework

- EU MDR 2017/745 Rule 11.
- UK Medical Devices Regulations 2002.
- MHRA *Software and AI as a medical device*, 2022.
- ISO 14971:2019.
- IEC 62304:2006+A1:2015.
- BSA Real Ear Measurement Recommended Procedure.
- Hearing aids are themselves Class IIa medical devices regulated under MDR.

## Clinical evidence base

- Ventry IM, Weinstein BE. *Ear Hear* 1982;3:128-34 — HHIE development.
  PMID: 7095321
- Lichtenstein MJ et al. *JAMA* 1988;259:2875-78 — HHIE-S validation.
  PMID: 3367454
- NICE NG98 (2018). <https://www.nice.org.uk/guidance/ng98>
- Cox RM, Alexander GC. *Ear Hear* 1995;16:176-86 — APHAB. PMID: 7789669

## Patient-safety alerts

- Asymmetric loss → MRI IAM before fitting.
- Sudden hearing loss within 30 days → emergency ENT pathway.
- Wax impaction → cerumen removal before fitting (AAO-HNS 2017).

## Data protection

- HHIE-S and audiogram data are personal health data; lawful basis
  Art.9(2)(h).
- Encryption at rest (AES-256) and in transit (TLS 1.3).

## See also

- [hhies-scoring-rules.md](hhies-scoring-rules.md)
- [clinical-guideline-alignment.md](clinical-guideline-alignment.md)
- [references.md](references.md)
