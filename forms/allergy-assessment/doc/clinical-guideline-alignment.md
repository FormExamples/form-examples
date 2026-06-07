# Clinical guideline alignment

This form is designed to align with NICE, BSACI, EAACI, and Resuscitation
Council UK guidance for allergy assessment and anaphylaxis management.

## NICE guidelines

### NICE CG183 — Drug allergy: diagnosis and management
- Published: September 2014.
- URL: <https://www.nice.org.uk/guidance/cg183>
- Form coverage:
  - Step 3 (Drug Allergies) captures the structured drug-allergy history
    elements specified in §1.2 (suspected drug, dose, route, time interval
    between exposure and reaction, signs and symptoms, witnesses).
  - Triggers a referral flag where §1.3 referral criteria are met
    (anaphylaxis, severe non-immediate cutaneous adverse reaction, β-lactam
    allergy with a need for those antibiotics, multiple drug allergies, allergy
    to a general anaesthetic agent).

### NICE NG196 — Anaphylaxis: assessment and referral after emergency treatment
- Published: August 2020 (incorporated into the CG134 successor pathway).
- URL: <https://www.nice.org.uk/guidance/cg134>
- Form coverage:
  - Step 6 captures the post-anaphylaxis referral history required by §1.5.
  - Auto-flags missing two-injector adrenaline auto-injector prescription per
    Medicines and Healthcare products Regulatory Agency (MHRA) Drug Safety
    Update June 2014.

### NICE NG228 — Food allergy in under 19s: assessment and diagnosis
- Replaces parts of CG116; NICE guidance is published at
  <https://www.nice.org.uk/guidance>.
- Form coverage:
  - Step 4 (Food Allergies) captures the IgE-mediated vs non-IgE-mediated
    distinction.
  - Uses the symptom-pattern checklists from NICE CG116 §1.2 (skin, GI,
    respiratory, systemic).

## BSACI guidelines

The British Society for Allergy & Clinical Immunology publishes the
domain-canonical UK allergy guidelines. Index: <https://www.bsaci.org/guidelines/>

| Topic | BSACI document | Journal citation |
| --- | --- | --- |
| Anaphylaxis | BSACI Anaphylaxis Guideline 2021 update | Ewan PW et al. *Clin Exp Allergy* 2021 |
| Drug allergy | BSACI guideline for drug allergy diagnosis | Mirakian R et al. *Clin Exp Allergy* 2009;39:43-61 |
| Penicillin allergy | BSACI guideline for penicillin allergy | Mirakian R et al. *Clin Exp Allergy* 2015;45:300-327 |
| Allergic and non-allergic rhinitis | BSACI rhinitis guideline | Scadding GK et al. *Clin Exp Allergy* 2017;47:856-889 |
| Egg allergy | BSACI egg allergy guideline | Clark AT et al. *Clin Exp Allergy* 2010 |

## EAACI / WAO guidelines

- European Academy of Allergy and Clinical Immunology (EAACI) Food Allergy and
  Anaphylaxis Guidelines 2014, update 2021. Muraro A et al. *Allergy*
  2014;69:1008-1025. PMID: 24909706
- World Allergy Organization (WAO) Anaphylaxis Guidance 2020. Cardona V et al.
  *World Allergy Organ J* 2020;13:100472. PMID: 33204386. DOI:
  10.1016/j.waojou.2020.100472

## Resuscitation Council UK

- *Emergency treatment of anaphylaxis: Guidelines for healthcare providers*.
  Resuscitation Council UK, May 2021.
- URL: <https://www.resus.org.uk/library/additional-guidance/guidance-anaphylaxis>
- Form coverage: Step 6 captures the immediate adrenaline dose and route used,
  per the algorithm; flagged-issue logic mirrors the "consider second dose
  after 5 minutes" rule.

## NHS / SPC

- BNF and NICE BNF Adrenaline (epinephrine) auto-injector entry:
  <https://bnf.nice.org.uk/drugs/adrenaline-epinephrine/>
- MHRA Drug Safety Update on adrenaline auto-injectors, June 2014 and August
  2017 — basis for the "two-pen" auto-injector flag.

## See also

- [grading-rules.md](grading-rules.md)
- [assessment-protocol.md](assessment-protocol.md)
- [safety-case-notes.md](safety-case-notes.md)
