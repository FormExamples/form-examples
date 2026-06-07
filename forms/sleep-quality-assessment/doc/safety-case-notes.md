# Safety case notes

## Intended use

A structured-data capture form for sleep-quality assessment using the
Pittsburgh Sleep Quality Index (PSQI). It computes the seven PSQI component
scores and the global score, and triggers screening flags for obstructive
sleep apnoea, restless legs syndrome, and chronic insomnia.

## Intended user

GP, sleep physician, respiratory physician, psychiatrist, or specialist
sleep nurse. Suitable for adults ≥18 years.

## Risk classification (MDCG 2019-11 Rev.1)

- **Class:** Class I medical device software.
- **Rationale:** The output is descriptive (sleep quality category) and
  triage-oriented (OSA / insomnia referral flags). It does not directly
  drive pharmacotherapy.

## Foreseeable misuse

| Misuse | Mitigation |
| --- | --- |
| Use to diagnose OSA without polysomnography | STOP-BANG flag explicitly recommends polysomnography per NICE NG202 |
| Long-term hypnotic prescription based on form alone | C6 ≥ 2 raises "review hypnotic" flag |
| Driver excessive sleepiness not flagged | Epworth Sleepiness Scale (cross-ref) and DVLA fitness-to-drive warning |
| Paediatric use without adaptation | Form is restricted to ≥18 years; paediatric PSQI variant not implemented |

## Regulatory framework

- EU MDR 2017/745 Rule 11.
- UK Medical Devices Regulations 2002.
- MHRA *Software and AI as a medical device*, 2022.
- ISO 14971:2019.
- IEC 62304:2006+A1:2015.

## Clinical evidence base

- Buysse DJ et al. *Psychiatry Res* 1989;28:193-213. PMID: 2748771
- NICE NG202 OSA. <https://www.nice.org.uk/guidance/ng202>
- AASM clinical practice guideline for diagnostic testing for adult OSA
  (Kapur VK et al. 2017). PMID: 28162150
- AASM chronic insomnia treatment guideline (Edinger JD et al. 2021).
  PMID: 33164742

## Patient-safety alerts

- Suicidality cross-check: if PSQI item 9 = "very bad" and the patient
  reports active suicidal ideation in the comorbidity step, raise an
  immediate mental health emergency flag and link to the mental-health
  assessment form.
- DVLA disclosure: any "intermediate or high risk OSA" plus excessive
  daytime sleepiness raises a "DVLA notification required" flag for
  commercial drivers.

## Data protection

- Sleep data and DVLA flags are special-category personal data under UK GDPR
  Art.9.
- Lawful basis: Art.9(2)(h).
- Encryption at rest (AES-256) and in transit (TLS 1.3).

## See also

- [psqi-scoring-rules.md](psqi-scoring-rules.md)
- [clinical-guideline-alignment.md](clinical-guideline-alignment.md)
- [references.md](references.md)
