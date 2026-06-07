# Clinical protocol

Operational protocol the diabetes assessment form encodes — modelled on
the annual diabetes review specified by NICE NG28 / NG17 and the Diabetes
UK 15 Healthcare Essentials.

## Indications

- Annual structured diabetes review for any adult with type 1 or type 2
  diabetes registered on the GP diabetes register or attending secondary
  care.
- Treatment-change visit (statin initiation, SGLT2i or GLP-1RA
  initiation).
- Post-discharge review after diabetes-related admission (DKA, severe
  hypoglycaemia).

## Preconditions

- HbA1c within previous 3 months (point-of-care or laboratory).
- Lipid profile within previous 12 months.
- eGFR and urine ACR within previous 12 months.
- Retinal screening result within previous 12 months (NHS Diabetic Eye
  Screening Programme in England).
- Foot examination within previous 12 months.

## Step-by-step

1. **Demographics.** Patient identifiers; date of last review.
2. **Diabetes History.** Type (1 / 2 / other), age at diagnosis, duration,
   prior diabetic emergencies (DKA, HHS, severe hypoglycaemia).
3. **Glycaemic Control.** Current HbA1c; individualised target (48–53
   mmol/mol per NG28). Continuous-glucose-monitoring metrics if relevant
   (time-in-range 3.9–10.0 mmol/L, ATTD 2019 consensus).
4. **Medications.** Metformin, SGLT2i, GLP-1RA, DPP-4i, sulphonylurea,
   pioglitazone, insulin; statin; antihypertensive.
5. **Complications Screening.** Retinopathy stage, neuropathy
   (10 g monofilament, vibration), nephropathy (eGFR, ACR), peripheral
   arterial disease.
6. **Cardiovascular Risk.** BP, lipid profile; QRISK3 or SCORE2-Diabetes
   computation; statin status.
7. **Self-Care & Lifestyle.** Structured-education completion (DESMOND
   for T2D, DAFNE for T1D), smoking, alcohol (AUDIT-C), physical activity.
8. **Psychological Wellbeing.** PHQ-9 / GAD-7 screening; diabetes
   distress (PAID-5).
9. **Foot Assessment.** NICE NG19 risk-stratification: low, moderate,
   high, active foot problem.
10. **Review & Care Plan.** Individualised care plan; onward referrals;
    education review; next-review date.

## Scoring engine output

The engine outputs a composite category — Controlled / Suboptimal / Poorly
Controlled — based on:

- HbA1c relative to individualised target.
- Presence of macrovascular or microvascular complications.
- Self-care quality (education, lifestyle, foot care).
- Psychological distress.

The engine output is advisory; the clinician's documented plan
overrides the computed category in the PDF report.

## Onward referrals

- Diabetes specialist nurse / consultant: HbA1c persistently > 75 mmol/mol
  despite triple therapy; recurrent severe hypoglycaemia.
- Renal team: eGFR < 30 mL/min/1.73 m² or ACR > 70 mg/mmol (NG203).
- Diabetic foot service: active foot problem (NG19).
- Cardiology: established CVD, HF, or atrial fibrillation.
- Psychology / psychiatry: PHQ-9 ≥ 15 or active suicidality.
- Bariatric: BMI ≥ 40 with T2D, or BMI ≥ 35 with significant comorbidity
  (NICE CG189 and NG7).

## Continuous glucose monitoring

NICE NG17 §1.6 (T1D) and NG28 §1.6 (T2D) define CGM eligibility. The form
records sensor type, time-in-range, time-below-range, and coefficient of
variation per the ATTD international consensus (Battelino T et al.
Diabetes Care 2019;42(8):1593-1603. DOI: 10.2337/dci19-0028).

## References

- NICE NG28 (2022). <https://www.nice.org.uk/guidance/ng28>
- NICE NG17 (2022). <https://www.nice.org.uk/guidance/ng17>
- NICE NG19 (2019). <https://www.nice.org.uk/guidance/ng19>
- NICE NG203 (2021). <https://www.nice.org.uk/guidance/ng203>
- Battelino T et al. *Clinical targets for continuous glucose monitoring
  data interpretation.* Diabetes Care 2019;42(8):1593-1603.
  DOI: 10.2337/dci19-0028.
