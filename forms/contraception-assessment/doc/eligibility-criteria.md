# UKMEC eligibility criteria

The contraception-assessment form mirrors UKMEC 2016 (amended September 2019)
across the 11 contraceptive methods listed in the FSRH publication. UKMEC is
maintained by the Faculty of Sexual & Reproductive Healthcare (FSRH) of the
Royal College of Obstetricians and Gynaecologists.

Landing page:
<https://www.fsrh.org/standards-and-guidance/uk-medical-eligibility-criteria/>

## Category framework

| Category | Definition |
| -------- | ---------- |
| UKMEC 1  | No restriction on use. |
| UKMEC 2  | Advantages of use generally outweigh theoretical or proven risks. |
| UKMEC 3  | Theoretical or proven risks usually outweigh advantages; requires expert clinical judgement or specialist referral. |
| UKMEC 4  | Unacceptable health risk if method is used. |

Categories may be split into "initiation" (I) and "continuation" (C) where
the same condition has different implications at the two points (for example
migraine with aura).

## Methods scored

| # | Method | Category source |
| - | ------ | --------------- |
| 1 | Combined hormonal contraception (CHC: pill, patch, ring) | UKMEC 2016 §CHC |
| 2 | Progestogen-only pill (POP) | UKMEC 2016 §POP |
| 3 | Progestogen-only injectable (DMPA) | UKMEC 2016 §POI |
| 4 | Progestogen-only implant (IMP) | UKMEC 2016 §IMP |
| 5 | Levonorgestrel intrauterine system (LNG-IUS) | UKMEC 2016 §LNG-IUS |
| 6 | Copper intrauterine device (Cu-IUD) | UKMEC 2016 §Cu-IUD |
| 7 | Diaphragm / cervical cap | UKMEC 2016 §Barrier |
| 8 | Male condom | UKMEC 2016 §Barrier |
| 9 | Fertility awareness methods | UKMEC 2016 §FAM |
| 10 | Lactational amenorrhoea method (LAM) | UKMEC 2016 §LAM |
| 11 | Emergency contraception (separate dosing guideline applies) | UKMEC 2016 §EC |

Methods relying on permanent surgical sterilization (tubal occlusion,
vasectomy) are out of scope for the current questionnaire.

## Selected category 3 / 4 triggers

The form's `ukmec-grader.ts` engine triggers a category 3 or 4 flag for at
least the following conditions, taken directly from UKMEC 2016. Refer to the
FSRH document for the complete list.

- Smoking ≥15 cigarettes/day at age ≥35 — UKMEC 4 for CHC
- Migraine with aura at any age — UKMEC 4 for CHC initiation; 3 for
  continuation; 2 for POP/POI/IMP
- Stroke (history) — UKMEC 4 for CHC initiation; 3 for POP continuation; 3
  for IMP and LNG-IUS continuation
- Current or history of ischaemic heart disease — UKMEC 4 for CHC; 3 for
  most progestogen-only methods
- Systolic BP ≥160 or diastolic ≥100 — UKMEC 4 for CHC
- BMI ≥35 kg/m² — UKMEC 3 for CHC
- Current or past VTE — UKMEC 4 for CHC; 2 for progestogen-only methods
- Known thrombogenic mutation — UKMEC 4 for CHC
- Breast cancer current — UKMEC 4 for all hormonal methods
- Breast cancer past and disease-free 5 years — UKMEC 3
- Cirrhosis (severe decompensated) — UKMEC 4 for CHC and hormonal methods
- Liver tumour (hepatocellular adenoma or carcinoma) — UKMEC 4 for CHC and
  hormonal methods
- SLE with positive antiphospholipid antibodies — UKMEC 4 for CHC

## Quick reference

The FSRH Quick Reference Guide is the canonical condensed lookup table
referenced by the engine. It is available at the UKMEC landing page above.

## Out-of-scope clinical decisions

The form does not advise on:

- Bridging contraception during surgical procedures
- Emergency contraception choice or dosing (UPA vs LNG vs Cu-IUD)
- Termination of pregnancy pathways
- Sterilization counselling
- Contraception in patients aged < 16 (separate Fraser-competence assessment
  required)
