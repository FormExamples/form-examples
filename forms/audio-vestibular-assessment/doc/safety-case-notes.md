# Safety case notes

## Intended use

A combined audiology and vestibular assessment record. It computes WHO
hearing-loss grades from pure-tone audiometry, the DHI handicap score, and
records the bedside vestibular screen.

## Intended user

Audiologist (HCPC-registered), ENT clinician, neuro-otologist, or specialist
vestibular physiotherapist.

## Risk classification (MDCG 2019-11 Rev.1)

- **Class:** Class IIa medical device software (Rule 11).
- **Rationale:** Output drives hearing-aid and cochlear-implant candidacy
  recommendations and may flag stroke or other emergencies via the HINTS
  exam findings. Misuse has foreseeable adverse outcomes.

## Foreseeable misuse

| Misuse | Mitigation |
| --- | --- |
| Acute vestibular syndrome mis-routed to outpatient vestibular rehab when central origin | HINTS exam embedded with explicit "central features" stroke flag |
| Sudden sensorineural hearing loss treated as routine | Onset ≤30 days field triggers AAO-HNS emergency pathway |
| Failure to recognise BPPV | Dix-Hallpike / supine roll test mandated in Step 7 |
| Pure-tone audiometry without calibration | Step 4 requires equipment calibration date entry per BSA recommended procedure |

## Regulatory framework

- EU MDR 2017/745 Rule 11.
- UK Medical Devices Regulations 2002.
- MHRA *Software and AI as a medical device*, 2022.
- ISO 14971:2019.
- IEC 62304:2006+A1:2015.
- BSA Recommended Procedures (pure-tone audiometry, tympanometry,
  Dix-Hallpike).
  <https://www.thebsa.org.uk/resources/>

## Clinical evidence base

- WHO *World Report on Hearing* 2021.
  <https://www.who.int/publications/i/item/9789240020481>
- Jacobson GP, Newman CW. *Arch Otolaryngol Head Neck Surg*
  1990;116:424-427 — DHI development. PMID: 2317323
- Whitney SL et al. *Otol Neurotol* 2004;25:139-43 — DHI bands. PMID: 15021772
- Kattah JC et al. *Stroke* 2009;40:3504-10 — HINTS. PMID: 19762709
- AAO-HNS sudden hearing loss guideline (Chandrasekhar 2019). PMID: 31369359
- AAO-HNS BPPV guideline (Bhattacharyya 2017). PMID: 28248609

## Patient-safety alerts

- HINTS-central findings → immediate stroke pathway.
- Sudden sensorineural hearing loss within 30 days → emergency ENT referral
  and consider oral corticosteroids per AAO-HNS 2019.
- Severe-profound hearing loss in a child → cross-reference to neonatal
  hearing screening and paediatric ENT pathway.

## Data protection

- Audiology results are personal health data; lawful basis Art.9(2)(h).
- Encryption at rest (AES-256) and in transit (TLS 1.3).

## See also

- [grading-rules.md](grading-rules.md)
- [clinical-guideline-alignment.md](clinical-guideline-alignment.md)
- [references.md](references.md)
