# Scoring rules

The diabetes assessment categorizes the patient as Controlled /
Suboptimal / Poorly Controlled using a transparent rule set anchored on
NICE NG28 / NG17 individualized targets.

## Inputs

- Diabetes type (1, 2, other).
- Current HbA1c (mmol/mol).
- Individualized HbA1c target (mmol/mol).
- Hypoglycaemia-risk medication flag (sulphonylurea, insulin).
- Frailty / age-related factors that relax the target.
- Presence of acute complications (DKA, severe hypoglycaemia in past
  year).
- Presence of chronic complications (retinopathy, neuropathy, nephropathy,
  PAD, CVD).
- Self-care indicators (structured education completed, smoking, AUDIT-C).
- Psychological-distress markers (PHQ-9, PAID-5).
- Foot risk band per NICE NG19.

## Categorization

### Poorly Controlled (Red)

Any one of:

- HbA1c > target + 11 mmol/mol (1.0 % above target).
- Severe hypoglycaemia event in past 12 months (BMJ definition: third-party
  assistance required).
- DKA or HHS event in past 12 months.
- Active diabetic foot problem (ulcer, gangrene, suspected Charcot).
- eGFR < 30 mL/min/1.73 m² and ACR > 30 mg/mmol with progressive decline.
- PHQ-9 ≥ 15 with active suicidality.

### Suboptimal (Amber)

Any one of (in absence of red criteria):

- HbA1c above individualized target by ≤ 11 mmol/mol.
- New or progressive complication (retinopathy progression, neuropathy
  diagnosis, ACR rising).
- BP not at target (≥ 140/80; ≥ 130/80 if albuminuria) on dual therapy.
- LDL-C ≥ 1.8 mmol/L on statin (CG181, high risk threshold).
- Structured education not completed.
- Active smoking.
- AUDIT-C ≥ 5 in men or ≥ 4 in women.
- PHQ-9 ≥ 10 or PAID-5 ≥ 8.

### Controlled (Green)

- HbA1c at or below individualized target without severe hypoglycaemia.
- No new or progressive complications.
- BP and LDL-C at target.
- Structured education completed; lifestyle factors optimal.
- Psychological wellbeing acceptable.

## Individualized target reasoning

NICE NG28 §1.6 sets the default HbA1c target as 48 mmol/mol on diet /
metformin, 53 mmol/mol on agents with hypoglycaemia risk. Targets are
relaxed when:

- Severe hypoglycaemia events.
- Recurrent hypoglycaemia despite glycaemic targets.
- Limited life expectancy.
- Significant frailty or cognitive impairment.

The form records the individualized target as a clinician input.

## Flagged issues

The engine emits flags for downstream UI and PDF rendering, including:

- HbA1c above target by > 11 mmol/mol.
- Active diabetic foot problem.
- Severe hypoglycaemia in past 12 months.
- ACR > 30 mg/mmol (microalbuminuria) or > 70 mg/mmol (macroalbuminuria).
- Smoker.
- AUDIT-C above threshold.
- PHQ-9 ≥ 10 or active suicidality.
- Structured education not completed.

## References

- NICE NG28 *Type 2 diabetes in adults.* <https://www.nice.org.uk/guidance/ng28>
- NICE NG17 *Type 1 diabetes in adults.* <https://www.nice.org.uk/guidance/ng17>
- NICE NG19 *Diabetic foot problems.* <https://www.nice.org.uk/guidance/ng19>
- NICE NG203 *Chronic kidney disease.* <https://www.nice.org.uk/guidance/ng203>
- NICE CG181 *Cardiovascular disease: risk assessment.*
  <https://www.nice.org.uk/guidance/cg181>
- International Hypoglycaemia Study Group. *Glucose Concentrations of Less
  Than 3.0 mmol/L (54 mg/dL) Should Be Reported in Clinical Trials.*
  Diabetes Care 2017;40(1):155-157. DOI: 10.2337/dc16-2215.
