# Assessment protocol

## Purpose

This protocol describes how a clinician (allergist, GP with allergy interest,
specialist nurse) should complete the ten-step Allergy Assessment in clinic
or at home, and how the engine output should be used to drive the management
plan.

## Setting

- Allergy/immunology outpatient clinic, GP with extended role in allergy,
  emergency department follow-up clinic, or remote teleconsultation.
- Suitable for adults and (with paediatric step variants) children ≥1 year.
- Not a substitute for in vivo testing (skin prick, intradermal, drug
  provocation) which remains the diagnostic gold standard per BSACI guidelines.

## Step-by-step protocol

### Step 1 — Demographics
Capture identifiers, NHS number (UK), date of birth, and ethnicity (used for
genetic predisposition stratification per HLA-B*57:01 abacavir, HLA-B*15:02
carbamazepine in Han Chinese, etc.).

### Step 2 — Allergy history
Onset age, family history of atopy (parent/sibling), and prior allergy
investigations. Family atopy increases pre-test probability per the
hygiene-hypothesis literature (Strachan DP, *BMJ* 1989;299:1259-60).

### Step 3 — Drug allergies
Use the NICE CG183 structured-history template:
- Suspected drug, dose, route, formulation.
- Time interval from administration to reaction (immediate <1h, accelerated
  1-72h, delayed >72h).
- Signs/symptoms, witnesses, treatment given, outcome.
- Drug allergy passport entry (per MHRA 2014 guidance).

### Step 4 — Food allergies
- IgE-mediated symptoms (urticaria, angioedema, anaphylaxis within 2h).
- Non-IgE-mediated symptoms (FPIES, eosinophilic oesophagitis, atopic
  dermatitis flare).
- Cofactors (exercise, NSAID, alcohol) per EAACI WDEIA guidance.

### Step 5 — Environmental allergies
- Aeroallergens: tree, grass, weed pollen with seasonal pattern; house dust
  mite (HDM); animal dander; mould.
- Cross-link with rhinitis (BSACI Scadding 2017) and asthma (BTS/SIGN/NICE
  NG80) histories.

### Step 6 — Anaphylaxis history
For each episode, capture:
- Trigger, time to onset, signs/symptoms by system.
- Adrenaline given (dose, route, repeated?), other treatments.
- Hospital admission, ITU admission, biphasic reaction.
- Whether a personalised written Anaphylaxis Action Plan exists.

### Step 7 — Testing results
- Skin prick test results (wheal diameter, control comparison).
- Specific IgE results (kU/L) with Phadia/ImmunoCAP cut-points.
- Component-resolved diagnostics (e.g. Ara h 2 for peanut, Pru p 3 for peach
  LTP syndrome).
- Drug provocation test results if available.
- Tryptase (baseline and peak) for mast cell / anaphylaxis workup.

### Step 8 — Current management
- Avoidance plan, adrenaline auto-injectors carried (and expiry date),
  controller meds (antihistamine, intranasal steroid, asthma inhalers).
- Allergen immunotherapy (SCIT / SLIT) status.

### Step 9 — Comorbidities
- Asthma (ACT or Asthma Control Questionnaire), atopic dermatitis (EASI or
  POEM), rhinitis (TNSS).
- Eosinophilic oesophagitis, mast cell disorders, hereditary angioedema.

### Step 10 — Impact and action plan
- Quality-of-life impact (Food Allergy Quality of Life Questionnaire FAQLQ
  for food allergy; RQLQ for rhinitis).
- Generate written allergy action plan and adrenaline-injector prescription
  per Resuscitation Council UK 2021.

## Output

The engine produces:

- A severity category (Low/Moderate/High/Critical).
- A list of flagged issues with referral and prescribing recommendations.
- A printable PDF allergy action plan.

## Quality controls

- Reaction grade (Ring & Messmer) is recorded for each anaphylactic
  episode to support pharmacovigilance reporting (Yellow Card Scheme).
- Drug allergy entries map cleanly to the **Allergy Status** section of an
  international patient summary (HL7 FHIR `AllergyIntolerance` resource).

## See also

- [grading-rules.md](grading-rules.md)
- [clinical-guideline-alignment.md](clinical-guideline-alignment.md)
- [safety-case-notes.md](safety-case-notes.md)
