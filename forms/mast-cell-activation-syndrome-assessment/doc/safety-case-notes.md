# Safety case notes

## Intended use

A structured-data capture form for suspected mast cell activation syndrome
(MCAS). It computes a cumulative organ-system symptom score, records
laboratory results, and produces a referral recommendation. It does **not**
diagnose MCAS; diagnosis requires laboratory confirmation per Valent 2012/2019
Consensus-1 criteria.

## Intended user

- Allergist, immunologist, haematologist, or general internist with experience
  in mast cell disease.
- Primary care: only the symptom screen and referral recommendation, not the
  diagnostic claim.

## Risk classification (MDCG 2019-11 Rev.1)

- **Class:** Class I medical device software.
- **Rationale:** The output is a triage recommendation, not a diagnostic
  output. Final diagnosis depends on laboratory and bone marrow findings
  outside the form's scope.

## Foreseeable misuse

| Misuse | Mitigation |
| --- | --- |
| Symptom-only score taken as a positive diagnosis | Plain-language disclaimer on Step 1 and on the report PDF |
| Failure to consider differential diagnoses (POTS, hEDS, carcinoid, pheochromocytoma) | Differential-checklist embedded in Step 9 |
| Treatment with multiple H1/H2 antihistamines without specialist input | Hard flag if ≥3 antihistamines on Step 10 |
| Missed mastocytosis | Tryptase >20 ng/mL → escalation flag with haematology referral |

## Regulatory framework

- EU MDR 2017/745 Rule 11.
- UK Medical Devices Regulations 2002.
- MHRA *Software and AI as a medical device*, 2022.
  <https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device>
- ISO 14971:2019 risk management.
- IEC 62304:2006+A1:2015 software life cycle.

## Clinical evidence base

- Valent P et al. *Int Arch Allergy Immunol* 2012;157:215-25. PMID: 22041891
- Valent P et al. *J Allergy Clin Immunol Pract* 2019;7:1125-33. PMID: 30737190
- Akin C et al. *J Allergy Clin Immunol* 2010;126:1099-104. PMID: 21035176
- Afrin LB et al. *Diagnosis (Berl)* 2020;8:137-152. PMID: 32324159
- Lyons JJ et al. *Nature Genetics* 2016;48:1564-9 (HαT). PMID: 27749843

## Patient-safety alerts

- Anaphylaxis cross-reference: if any Step 8 trigger or Step 5 cardiovascular
  symptom is severe, the engine raises an "anaphylaxis risk" flag, recommending
  adrenaline auto-injector prescription per Resuscitation Council UK 2021 and
  cross-referral to the Allergy Assessment form.
- Iodinated contrast / general anaesthetic warning: if the symptom score is
  ≥8 the engine prints a "drug-and-anaesthesia alert card" listing
  prophylactic premedication options per the published mastocytosis
  literature (Bonadonna P et al. *Curr Opin Allergy Clin Immunol*
  2009;9:333-9. PMID: 19641477).

## Data protection

- MCAS symptom data is special-category personal data under UK GDPR Art.9.
- Lawful basis: Art.9(2)(h).
- Encryption at rest (AES-256) and in transit (TLS 1.3).

## See also

- [scoring-rules.md](scoring-rules.md)
- [clinical-guideline-alignment.md](clinical-guideline-alignment.md)
- [references.md](references.md)
