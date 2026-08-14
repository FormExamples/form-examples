# Allergy severity grading rules

The Allergy Assessment uses a four-level categorical severity model (Low /
Moderate / High / Critical). It does not implement a published numeric scale;
instead, the categories are derived from the reaction-pattern phenotypes
described in the World Allergy Organization (WAO) Anaphylaxis Guidance and the
BSACI clinical guidelines for drug allergy, food allergy and anaphylaxis.

## Category definitions

### Low — mild localized reaction
- Symptoms confined to a single organ system (most commonly skin).
- Typical phenotypes: localized urticaria, mild rhinoconjunctivitis, contact
  dermatitis, oral allergy syndrome confined to the mouth and pharynx.
- No systemic or respiratory compromise; no history of adrenaline use.

### Moderate — systemic but non-life-threatening
- Two or more organ systems involved (e.g. cutaneous + gastrointestinal).
- No airway compromise, no hypotension, no impaired consciousness.
- Mapped to **Ring & Messmer grade II** systemic reactions (generalized
  urticaria, angioedema, mild bronchospasm, vomiting). See Ring J, Behrendt H,
  de Weck A. *History and classification of anaphylaxis*. Chem Immunol Allergy
  2010;95:1-11. PubMed PMID: 20519878.

### High — severe reaction or multi-allergen sensitization
- Severe bronchospasm, recurrent generalized urticaria with respiratory
  symptoms, or significant gastrointestinal involvement.
- Multiple allergen categories (drug + food + environmental) with a history of
  repeated reactions.
- Mapped to **Ring & Messmer grade III** (life-threatening but not fatal
  reactions: shock, severe bronchospasm, loss of consciousness).
- Aligned with **BSACI severe-asthma + food allergy comorbidity flag** —
  patients with severe asthma and food allergy carry an elevated anaphylaxis
  risk; see BSACI food allergy guideline (Clinical & Experimental Allergy 2014;
  44:642-672).

### Critical — anaphylaxis or life-threatening
- Any documented anaphylactic episode meeting NIAID/FAAN criteria (Sampson et
  al. 2006).
- Prior adrenaline auto-injector use, prior emergency intubation, or
  prior cardiorespiratory arrest.
- Mapped to **Ring & Messmer grade IV** (cardiac/respiratory arrest).
- Auto-flag for emergency adrenaline-auto-injector prescription and a written
  personalized Anaphylaxis Action Plan per Resuscitation Council UK 2021.

## Reference instruments used in scoring

| Component | Instrument | Source |
| --- | --- | --- |
| Anaphylaxis diagnosis | NIAID/FAAN second symposium criteria | Sampson HA et al. *J Allergy Clin Immunol* 2006;117:391-7. PMID: 16461139 |
| Reaction grading | Ring & Messmer four-grade scale | Ring J & Messmer K. *Lancet* 1977;1:466-9. PMID: 65572 |
| Drug allergy phenotype | Gell & Coombs hypersensitivity types I-IV | Coombs RRA & Gell PGH (1963), summarized in BSACI drug allergy guideline 2009 |
| Food allergy diagnosis | EAACI Food Allergy and Anaphylaxis Guidelines | Muraro A et al. *Allergy* 2014;69:1008-1025. PMID: 24909706 |

## Flagged-issue triggers

The engine raises a flagged issue when any of the following hold:

- Any answer in Step 6 (Anaphylaxis History) indicates a prior anaphylactic
  episode → escalate to Critical and trigger an Anaphylaxis Action Plan flag.
- Patient is on a beta-blocker or ACE inhibitor and has a history of
  anaphylaxis → flag for medication review (per BSACI anaphylaxis guideline
  2021).
- Multiple drug allergies (≥3) → flag for drug-allergy specialist referral and
  de-labelling assessment (per NICE CG183 drug allergy).
- Food allergy with comorbid asthma → flag for asthma review and joint
  management plan.

## See also

- [clinical-guideline-alignment.md](clinical-guideline-alignment.md)
- [assessment-protocol.md](assessment-protocol.md)
- [safety-case-notes.md](safety-case-notes.md)
- [references.md](references.md)
