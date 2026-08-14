# Assessment protocol

## Intended use

A 10-step questionnaire that captures the patient's medical, lifestyle, and
preference profile, applies UKMEC categorization per method, and produces a
shortlist of methods sorted by UKMEC suitability and patient preference.

## Intended users

UK general practitioners, advanced nurse practitioners, practice nurses with
FSRH training, integrated sexual health (ISH) clinic clinicians, and
community sexual health clinic nurses.

## Setting

UK primary care or community contraception clinic. The form is designed to
be completed before or during a consultation, on a clinician workstation or
patient device.

## Step-by-step workflow

1. **Demographics** — name, date of birth, GP, ethnicity, language. Used for
   record-matching.
2. **Reproductive history** — gravidity, parity, planned future pregnancies,
   breastfeeding status. Drives postnatal UKMEC categorization.
3. **Menstrual history** — LMP, cycle pattern, dysmenorrhoea, IMB/PCB,
   menorrhagia. Heavy menstrual bleeding triggers a LNG-IUS suggestion in
   line with NICE CKS HMB.
4. **Current contraception** — method, satisfaction, side-effects, adherence.
5. **Medical history** — UKMEC condition list: CVD, diabetes, hypertension,
   liver disease, gallbladder, IBD, SLE, sickle cell, breast cancer, current
   STI/PID.
6. **Cardiovascular risk** — BP, BMI, smoking, age, family history of
   premature CVD. Drives CHC eligibility.
7. **Lifestyle factors** — smoking pack-years, alcohol, recreational drugs,
   exercise.
8. **Preferences and priorities** — efficacy, hormone preference, fertility
   plans, partner involvement, religious considerations.
9. **Breast & cervical screening** — date and result of last NHS breast
   screening (over 50) and cervical screening, recall status.
10. **Family planning goals** — desired duration before pregnancy, completion
    of family, fertility regret history.

## Output

The engine produces:

- A per-method UKMEC category (1, 2, 3, or 4)
- A flagged-issues list (any condition triggering category 3 or 4)
- A shortlist of methods filtered to UKMEC ≤ 2 and ranked by preference
- A "must discuss with clinician" indicator if any UKMEC 3 condition is
  present
- A "do not prescribe" indicator if any UKMEC 4 condition is present for the
  patient's preferred method

## Safety-net behaviour

- The engine never auto-recommends a method when any UKMEC 3 or 4 flag is
  present; instead, it produces the flag list and instructs the clinician to
  confirm the consultation.
- Blood pressure measurement within the last 12 months is required before
  CHC can be recommended.
- BMI ≥35 kg/m² downgrades CHC to UKMEC 3 per FSRH guidance.
- Postpartum < 21 days excludes CHC entirely.

## Out of scope

- Emergency contraception dosing (see FSRH EC guideline)
- Sterilization counselling
- Termination of pregnancy
- Menopause management (see HRT assessment form)
- Subfertility evaluation (see fertility-assessment form)
