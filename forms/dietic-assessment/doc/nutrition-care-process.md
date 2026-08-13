# Nutrition Care Process cross-walk

The British Dietetic Association's *Model and Process for Nutrition and
Dietetic Practice* structures a dietetic episode into six stages, of which the
middle four are commonly abbreviated **ADIME**: Assessment, Diagnosis,
Intervention, Monitoring and Evaluation.

This table maps each stage onto the 16 wizard steps in
[`../index.md`](../index.md), so a reviewer can confirm the form covers the
process without reading the field list.

| BDA stage | ADIME | Wizard steps | What the form captures |
| --- | --- | --- | --- |
| Identification of nutritional need | — | 1, 2 | Referral source and reason, presenting condition, appointment type and duration, consent |
| Assessment | **A** | 3–14 | The five assessment domains: medical history; medication and supplements; dietary recall and fluids; lifestyle, environment, activity and behaviour; anthropometry, biochemistry, and the nutrition-focused physical examination |
| Identification of nutrition and dietetic diagnosis | **D** | 15 | MUST, GLIM, NRS-2002, SARC-F, refeeding risk, estimated requirements, PES statement |
| Plan and implement nutrition and dietetic intervention | **I** | 16 | Intervention type, prescribed supplement and dose, SMART goals, education and resources provided |
| Monitor and review | **M** | 16 | Monitoring indicators, review interval and date, onward referrals |
| Evaluate | **E** | 16 | Recommendation, dietitian override and reason, additional notes, electronic signature |

## The five assessment domains

Steps 3–14 are organised around the five domains a dietetic assessment covers.
The wizard's step order follows the shape of a real consultation — history
first, measurements when the patient is comfortable, plan last — rather than
grouping strictly by domain.

| Domain | Steps | Notes |
| --- | --- | --- |
| Medical history review | 3 | Diagnosed conditions, recent surgery, symptoms, family history, pregnancy and lactation |
| Medication and supplement check | 4 | Prescription, over-the-counter, vitamins and minerals, herbal products, oral nutritional supplements already in use, drug–nutrient interactions |
| Dietary recall | 8, 9, 10, 11 | Typical daily intake, meal frequency, portion sizes, fluid consumption, preferences, allergies, intolerances, and gastrointestinal or swallowing factors that shape what can be eaten |
| Lifestyle and environment exploration | 12, 13, 14 | Work pattern, cooking skills and facilities, food budget and insecurity, shopping and transport, physical activity, and readiness to change |
| Physical measurements | 5, 6, 7 | Height, weight, BMI, MUAC, waist and calf circumference, weight history, biochemistry, and the nutrition-focused physical examination |

## PES statement

The nutrition and dietetic diagnosis is recorded as a PES statement on step 15:

> **P**roblem *related to* **E**tiology *as evidenced by* **S**igns and
> symptoms.

The form stores the three components as separate columns
(`pes_problem`, `pes_etiology`, `pes_signs_symptoms`) as well as the assembled
sentence, so the diagnosis is queryable in the dashboard rather than buried in
free text.

## SMART goals

Step 16 records up to three goals, each with a target, a measure, and a review
date, so that the monitoring stage has something concrete to evaluate against.
Goals are recorded in the patient's own words where possible; step 14 captures
the patient's stated goal verbatim for exactly this purpose.

## Reference

British Dietetic Association. *Model and Process for Nutrition and Dietetic
Practice.*
<https://www.bda.uk.com/practice-and-education/professional-guidance.html>
