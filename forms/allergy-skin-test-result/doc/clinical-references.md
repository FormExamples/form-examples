# Allergy Skin Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
allergy skin tests and specific-IgE testing. These sources anchor the four-axis
interpretation grade, the positive-reaction thresholds, the
sensitization-versus-clinical-allergy distinction, and the critical-result
alerting rules used by this form.

## Interpretation thresholds

### Positive weal threshold

A skin-prick test reaction is conventionally **positive when the weal is ≥3 mm
greater than the negative control**, read at 15–20 minutes; some guidance uses a
2 mm cut-off in infants and young children. Results may be corrected for skin
reactivity by reference to the positive **histamine control**, which must
produce an adequate weal for the test to be valid. This threshold underpins the
form's `positive_reactions` flag and the per-allergen `wheal_sizes` field.

- The skin prick test — European standards (EAACI), *Clinical and Translational
  Allergy*. <https://pmc.ncbi.nlm.nih.gov/articles/PMC3565910/>
- Measurement and interpretation of skin prick test results, *Clinical and
  Translational Allergy*. <https://pmc.ncbi.nlm.nih.gov/articles/PMC4763448/>

### Sensitization versus clinically relevant allergy

Skin-prick and specific-IgE tests have a **good negative predictive value but a
positive predictive value that can be as low as ~50 %**. A positive test
therefore demonstrates **sensitization**, not necessarily clinical allergy: it
must be interpreted against a convincing clinical history. This distinction is
the core of the form's `interpretation` field, the `sensitisation_confirmed`
flag, and the Axis A *abnormal* classification — only **clinically relevant**
sensitization is graded abnormal.

- Skin Prick Tests and specific IgE tests, BSACI.
  <https://www.bsaci.org/resources/allergy-management/food-allergy/investigations/skin-prick-tests-and-specific-ige-tests/>

## Test validity controls

Antihistamines (and tricyclic antidepressants) **suppress the weal-and-flare
response** and must be withheld for an adequate washout before skin testing; an
absent positive histamine control or active skin disease (dermographism, eczema)
renders the test **invalid / non-interpretable**. These drive the form's
`antihistamines_withheld` and `positive_control_valid` controls, the
`test_invalid` flag, and the Axis A *inconclusive* classification.

- BSACI Standard Operating Procedure for skin-prick testing (washout of
  antihistamines before testing).
  <https://www.bsaci.org/wp-content/uploads/2019/12/paedSPTnew.pdf>

## Safety: reactions during testing

Systemic and anaphylactic reactions, although rare, can occur during skin
testing (especially intradermal testing and drug-provocation challenge);
resuscitation readiness is mandatory. A systemic reaction during testing is a
**critical safety event** — it drives the form's `anaphylaxis_during_test` flag,
the Axis A *critical* classification, the Axis D *critical-alert* auto-escalation,
and the `critical-result-alert` safety flag.

- EAACI Guideline: Anaphylaxis (2021 update).
  <https://onlinelibrary.wiley.com/doi/10.1111/all.15032>
- WAO — Risk and safety requirements for diagnostic and therapeutic procedures
  in allergology (resuscitation readiness during testing).
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC5062928/>

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| EAACI ≥3 mm positive weal threshold | `wheal_sizes`, `positive_reactions` |
| Positive histamine control validity | `positive_control_valid`, `test_invalid` |
| BSACI antihistamine washout | `antihistamines_withheld`, `test_invalid` |
| Sensitization vs clinical allergy (PPV) | `interpretation`, `sensitisation_confirmed`, Axis A abnormal |
| Specific-IgE testing | `specific_ige_results`, `sensitised_allergens` |
| EAACI / WAO anaphylaxis-during-test | `anaphylaxis_during_test`, `critical-result-alert` flag, Axis D critical-alert |
