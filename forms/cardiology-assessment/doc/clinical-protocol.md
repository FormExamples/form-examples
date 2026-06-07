# Clinical protocol

Operational protocol the cardiology assessment form encodes.

## Indications

Recommended at first cardiology outpatient encounter for any of:

- New-onset chest pain suspected to be of cardiac origin (NICE CG95).
- Symptoms or signs of heart failure (NICE NG106).
- New atrial fibrillation, palpitations, syncope or pre-syncope.
- Cardiovascular risk-factor review for patients without established
  disease (NICE CG181 / QS167).

## Preconditions

- Resting 12-lead ECG performed within 30 days prior to the encounter (NICE
  CG95 §1.3.1).
- Lipid profile (total cholesterol, HDL-C, non-HDL-C, triglycerides) and
  HbA1c within 12 months (NICE CG181 §1.1).
- BNP or NT-proBNP for any patient with suspected heart failure (NICE NG106
  §1.1.2).

## Step-by-step protocol

1. **Demographics.** Confirm identifiers; record self-reported ethnicity
   per the ONS 2021 census categories (matches QRISK3 inputs).
2. **Chest Pain / Angina.** Use the CCS 4-class scale; record SOCRATES
   features (Site, Onset, Character, Radiation, Associations, Time course,
   Exacerbating/relieving factors, Severity).
3. **Heart Failure Symptoms.** NYHA class; orthopnoea, paroxysmal nocturnal
   dyspnoea, peripheral oedema, weight gain (>2 kg/week).
4. **Cardiac History.** Prior MI, PCI, CABG, valve surgery, congenital
   disease, cardiomyopathy, structural heart disease.
5. **Arrhythmia & Conduction.** AF/atrial flutter, supraventricular and
   ventricular tachycardia, AV block, pacemaker/ICD history.
6. **Risk Factors.** Hypertension, dyslipidaemia, diabetes, smoking, family
   history of premature CVD (<60 y in first-degree relative).
7. **Diagnostic Results.** ECG, echocardiogram (LVEF, structural
   abnormalities), troponin, BNP/NT-proBNP, lipid panel, HbA1c.
8. **Current Medications.** Antiplatelets, anticoagulants, statins,
   antihypertensives, antiarrhythmics, heart-failure GDMT (ACEi/ARB/ARNI,
   beta-blocker, MRA, SGLT2 inhibitor).
9. **Allergies.** Drug allergies with reaction type and severity
   (NICE CG183).
10. **Social & Functional.** Occupation, exercise tolerance (NYHA),
    cardiac-rehabilitation referral, lifestyle counselling.

## Onward referral triggers

- LVEF <40 % → heart-failure clinic.
- CHA2DS2-VASc ≥ 2 in non-valvular AF → anticoagulation review.
- CCS class III–IV angina → urgent coronary angiography pathway.
- Suspected aortic stenosis (gradient or syncope) → valve clinic.
- Premature CHD family history → lipid clinic / FH genetic testing
  (NICE CG71).

## Safe handover

- PDF report contains the CCS grade, NYHA class, key investigations, and a
  bulleted onward-care plan.
- FHIR R5 Bundle is generated for transmission to the GP (Observation,
  Condition, MedicationStatement, CarePlan resources).
