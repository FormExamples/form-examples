# MCAS symptom scoring rules

## Background

Mast Cell Activation Syndrome (MCAS) is a heterogeneous disorder defined by
the combination of:

1. Recurrent symptoms consistent with mast cell mediator release affecting
   ≥2 organ systems.
2. Objective biochemical evidence of mast cell activation (transient rise in
   serum tryptase above baseline).
3. Response to mast-cell-directed therapy (H1/H2 antihistamines, cromolyn,
   leukotriene receptor antagonists, anti-IgE).

Two diagnostic frameworks are in widespread use:

- **Consensus-1 (Valent et al. 2012, 2019)** — restrictive WHO-aligned
  criteria; requires a tryptase rise of ≥(1.2 × baseline + 2 ng/mL) during a
  symptomatic episode.
- **Consensus-2 (Akin et al. 2010; expanded by Afrin and Molderings 2020)** —
  broader symptom-based criteria suitable for primary care screening.

The form implements a hybrid symptom score that supports the Consensus-2
phenotype assessment; final diagnosis still requires laboratory and treatment
response confirmation per Consensus-1.

## References

- Valent P, Akin C, Arock M, et al. *Definitions, criteria and global
  classification of mast cell disorders with special reference to mast cell
  activation syndromes: a consensus proposal*. Int Arch Allergy Immunol
  2012;157:215-25. PMID: 22041891
- Valent P, Akin C, Bonadonna P, et al. *Proposed Diagnostic Algorithm for
  Patients with Suspected Mast Cell Activation Syndrome*. J Allergy Clin
  Immunol Pract 2019;7:1125-1133.e1. PMID: 30737190
- Akin C, Valent P, Metcalfe DD. *Mast cell activation syndrome: Proposed
  diagnostic criteria*. J Allergy Clin Immunol 2010;126:1099-104.e4.
  PMID: 21035176
- Afrin LB, Ackerley MB, Bluestein LS, et al. *Diagnosis of mast cell
  activation syndrome: a global "consensus-2"*. Diagnosis (Berl) 2020;8:137-152.
  PMID: 32324159

## Organ-system symptom score

Each of the five organ systems is scored 0-3 by frequency and severity.

| Score | Frequency | Functional impact |
| --- | --- | --- |
| 0 | None | None |
| 1 | <1×/week | None or trivial |
| 2 | Several times/week | Some functional limitation |
| 3 | Daily or near-daily | Marked functional limitation |

Cumulative range: **0-15** across the five organ systems.

### Dermatological symptoms (Step 3)
Flushing, urticaria, pruritus, angioedema, dermatographism.

### Gastrointestinal symptoms (Step 4)
Abdominal pain, bloating, diarrhoea, nausea, vomiting, reflux, eosinophilic
oesophagitis-like swallowing difficulty.

### Cardiovascular symptoms (Step 5)
Lightheadedness, presyncope, syncope, palpitations, postural hypotension,
postural orthostatic tachycardia syndrome (POTS) overlap.

### Respiratory symptoms (Step 6)
Bronchospasm, dyspnoea, throat tightness, chronic rhinitis, post-nasal drip.

### Neurological symptoms (Step 7)
Headache, "brain fog", paraesthesia, anxiety, sleep disturbance.

## Category cut-points (symptom score only)

- **0-3**: Minimal / unlikely MCAS — consider alternative diagnoses.
- **4-7**: Possible MCAS — proceed to tryptase and 24h urinary mediator
  testing.
- **8-11**: Probable MCAS — refer to allergist / haematologist;
  laboratory workup mandatory.
- **12-15**: High likelihood — refer urgently and start empirical
  mast-cell-directed therapy per Akin et al. 2010.

These cut-points are not a published validated cutoff. They are an internal
operational scheme to triage referrals; a published numeric MCAS scale does
not exist in the peer-reviewed literature, hence the Consensus criteria are
qualitative.

## Trigger pattern analysis (Step 8)

Common triggers are recorded as a checklist:

- Heat, cold, friction, exercise.
- Foods (alcohol, aged cheese, fermented foods, scombroid fish, shellfish).
- Medications (NSAIDs, opioids, vancomycin, iodinated contrast,
  neuromuscular blocking agents).
- Stress, hormonal cycle.
- Hymenoptera venom (also screen for `KIT D816V` somatic mutation per
  Lyons JJ et al. *J Allergy Clin Immunol Pract* 2019).

## Laboratory results (Step 9)

The engine records but does not score:

- Baseline serum tryptase (ng/mL). Hereditary alpha-tryptasemia (HαT) is
  defined by baseline tryptase >8 ng/mL and confirmed by `TPSAB1`
  copy-number testing (Lyons JJ et al. *Nat Genet* 2016;48:1564-9.
  PMID: 27749843).
- Acute tryptase during symptomatic episode (must be ≥20% + 2 ng/mL above
  baseline per Valent 2012 to satisfy Consensus-1 criterion 2).
- 24h urine N-methylhistamine, 11β-prostaglandin F2α, leukotriene E4.
- Serum chromogranin A, plasma histamine.

## Flagged-issue triggers

- Score ≥8 → refer for allergist/haematologist evaluation.
- Tryptase >20 ng/mL → suspect systemic mastocytosis; refer for bone marrow
  biopsy per WHO criteria.
- History of anaphylaxis with Hymenoptera trigger and elevated baseline
  tryptase → flag for clonal mast cell disease workup (`KIT D816V`).
- Severe cutaneous flushing or unexplained syncope + high score → flag for
  inpatient observation if first presentation.

## See also

- [clinical-guideline-alignment.md](clinical-guideline-alignment.md)
- [safety-case-notes.md](safety-case-notes.md)
- [references.md](references.md)
