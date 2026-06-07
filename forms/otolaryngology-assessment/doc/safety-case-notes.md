# Safety case notes

## Intended use

A structured ENT consultation record that captures presenting complaint,
SNOT-22 score, and standardised examination findings (otoscopy, anterior
rhinoscopy, oropharyngeal exam) to support a clinical impression and ENT
management plan.

## Intended user

ENT (otolaryngology) consultant or registrar, ENT clinical nurse specialist,
or GP with extended role in ENT acting within scope. The patient may
self-complete the SNOT-22 step prior to the consultation.

## Risk classification (MDCG 2019-11 Rev.1)

- **Class:** Class I medical device software.
- **Rationale:** Output drives referral and conservative management; it
  does not directly prescribe drugs or surgery.

## Foreseeable misuse

| Misuse | Mitigation |
| --- | --- |
| Unilateral nasal symptoms misclassified as routine CRS | Explicit "unilateral red-flag" gate in Step 2 — auto-flag for 2WW |
| Missed head and neck cancer (NICE NG12) referral | Hard gate on persistent unilateral symptoms + smoker / alcohol |
| Hearing loss not investigated | Cross-reference to audiology form mandated if SNOT-22 ear/facial domain elevated |
| Over-reliance on SNOT-22 alone | Endoscopy/CT findings recorded separately in Steps 6-9 |

## Regulatory framework

- EU MDR 2017/745 Rule 11.
- UK Medical Devices Regulations 2002.
- MHRA *Software and AI as a medical device*, 2022.
- ISO 14971:2019.
- IEC 62304:2006+A1:2015.

## Clinical evidence base

- Hopkins C et al. *Clin Otolaryngol* 2009;34:447-454 — SNOT-22 development.
  PMID: 19793277
- Fokkens WJ et al. *Rhinology* 2020 Suppl 29:1-464 — EPOS 2020.
  PMID: 32077450
- Rosenfeld RM et al. *Otolaryngol Head Neck Surg* 2015;152:S1-S39 — AAO-HNS
  adult sinusitis update. PMID: 25832968
- BSACI rhinitis guideline (Scadding 2017). PMID: 30239057

## Patient-safety alerts

- 2-week-wait head and neck cancer referral: unilateral nasal symptoms in an
  adult > 40 years with epistaxis or otalgia.
- Sudden sensorineural hearing loss: any patient reporting sudden
  unilateral hearing loss within 30 days → emergency same-week ENT referral
  per ENT-UK guidance.
- Periorbital cellulitis red flags: diplopia, proptosis, reduced eye
  movement → immediate ED referral.

## Data protection

- Sinonasal data is personal health data; lawful basis Art.9(2)(h).
- Encryption at rest (AES-256) and in transit (TLS 1.3).

## See also

- [snot22-scoring-rules.md](snot22-scoring-rules.md)
- [clinical-guideline-alignment.md](clinical-guideline-alignment.md)
- [references.md](references.md)
