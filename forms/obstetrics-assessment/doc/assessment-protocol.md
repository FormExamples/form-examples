# Assessment protocol

## Intended use

A booking and ongoing antenatal questionnaire that captures the woman's
history, current pregnancy, and screening status; applies NICE NG201
risk-stratification logic; and recommends the appropriate care pathway
(midwifery-led, joint, or consultant-led).

## Intended users

- Community midwives (booking and ongoing antenatal visits)
- GP antenatal clinics
- Hospital antenatal clinic clinicians (obstetricians, fetal medicine
  consultants, specialist midwives)

## Setting

UK community midwifery service or hospital antenatal clinic.

## Workflow

1. **Maternal demographics** — name, DOB, address, GP, ethnicity, language,
   country of birth, asylum/refugee status, employment, social support.
   Captures NICE NG201 §1.4 vulnerable-group indicators.
2. **Obstetric history** — gravidity, parity, prior outcomes including
   mode of delivery, gestation, birth weight, complications (pre-eclampsia,
   GDM, PPH, shoulder dystocia, perineal trauma), miscarriages, terminations,
   stillbirth, neonatal loss.
3. **Medical history** — cardiac, renal, hypertension, diabetes,
   thyroid, autoimmune (SLE, APS), thrombophilia, mental health, HIV/HBV/HCV,
   surgical history, anaesthetic history.
4. **Current pregnancy details** — LMP, EDD calculation, dating scan
   confirmation, planned/unplanned, IVF conception, twin / triplet, prior
   booking elsewhere.
5. **Lifestyle and social** — smoking, alcohol, recreational drugs, BMI,
   diet, exercise, domestic abuse routine enquiry per NG201 §1.4.
6. **Screening results** — combined test, NIPT, anomaly scan, GTT,
   anaemia, blood group/antibodies, infectious disease screen, sickle/thal.
7. **Mental health assessment** — Whooley 2-question and GAD-2 with
   onward EPDS or PHQ-9 if positive.
8. **Fetal assessment** — symphysis-fundal height, growth scan results,
   placental position, presentation, fetal movements, CTG findings.
9. **Birth preferences** — planned place of birth, pain relief preference,
   birth partner, religious or cultural considerations.
10. **Care plan and follow-up** — engine outputs the recommended pathway
    and the next appointment schedule per NICE NG201 §1.5.

## Output

- Risk band (Low / Moderate / High) and care-pathway recommendation
- A flagged-issues list (specific triggers identified)
- A scheduled-appointments grid per NICE NG201 schedule
- A safety-net text for the patient covering reduced fetal movements,
  pre-eclampsia warning signs, and bleeding
- A structured PDF for the maternity record

## Safety-net behaviour

- Reduced fetal movements after 28 weeks → immediate same-day assessment
- BP ≥ 140/90 with proteinuria or symptoms → urgent referral
- Severe headache, visual disturbance, epigastric pain → urgent referral
- Bleeding in any trimester → urgent assessment
- Suspected SGA on SFH measurement → growth scan referral
- Booking BMI ≥ 40 → consultant-led care plus anaesthetic referral
- Previous severe mental illness → perinatal mental health team referral

## Out of scope

- Intrapartum care (NICE NG121, NG192, NG235 etc.)
- Postnatal care after hospital discharge (NICE NG194)
- Detailed fetal medicine ultrasound reporting
- Cytogenetic interpretation of NIPT / amniocentesis results
