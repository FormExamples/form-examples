// Additional safety-flag detection. Mirrors the SvelteKit
// `src/lib/engine/flagged-issues.ts`. Pure function — same output shape and
// flag IDs as the canonical engine.

/**
 * Local copy of the Fried Frailty Phenotype scorer also defined in
 * `composite-grader.js`. Duplicated (rather than imported) to avoid a
 * circular import, since `composite-grader.js` imports
 * `detectAdditionalFlags` from this module.
 */
function friedPhenotypeCategory(data) {
  const fc = data.functionalCapacity;
  const criteria = [
    fc.friedWeakness,
    fc.friedSlowness,
    fc.friedLowPhysicalActivity,
    fc.friedExhaustion,
    fc.friedUnintentionalWeightLoss
  ];
  if (criteria.every((c) => c === '')) return '';
  const score = criteria.filter((c) => c === 'yes').length;
  return score === 0 ? 'robust' : score <= 2 ? 'pre-frail' : 'frail';
}

function detectAdditionalFlags(data) {
  const flags = [];

  if (
    data.airway.mallampatiClass === 'III' ||
    data.airway.mallampatiClass === 'IV'
  ) {
    flags.push({
      flagId: 'F-DIFFICULT-AIRWAY',
      category: 'difficult-airway',
      priority: 'high',
      description: `Mallampati class ${data.airway.mallampatiClass} — predicts difficult intubation`,
      suggestedAction: 'Prepare difficult-airway trolley; consider awake fibreoptic intubation.'
    });
  }
  if (data.airway.priorDifficultIntubation === 'yes') {
    flags.push({
      flagId: 'F-DIFFICULT-AIRWAY-HISTORY',
      category: 'difficult-airway',
      priority: 'high',
      description: 'Documented prior difficult intubation',
      suggestedAction: 'Senior anaesthetist review; airway alert on record.'
    });
  }
  if (
    data.cardiovascular.echoEfPercent !== null &&
    data.cardiovascular.echoEfPercent < 40
  ) {
    flags.push({
      flagId: 'F-SEVERE-CARDIAC',
      category: 'severe-cardiac',
      priority: 'high',
      description: `Ejection fraction ${data.cardiovascular.echoEfPercent}%`,
      suggestedAction: 'Cardiology review; consider invasive monitoring and HDU disposition.'
    });
  }
  if (
    data.vitals.spo2Percent !== null &&
    data.vitals.spo2Percent < 92 &&
    data.vitals.onRoomAir === 'yes'
  ) {
    flags.push({
      flagId: 'F-SEVERE-RESPIRATORY',
      category: 'severe-respiratory',
      priority: 'high',
      description: `SpO2 ${data.vitals.spo2Percent}% on room air`,
      suggestedAction: 'Respiratory review; consider optimisation before surgery.'
    });
  }
  if (
    data.haematology.inr !== null &&
    data.haematology.inr > 1.5 &&
    data.haematology.onAnticoagulant !== 'yes'
  ) {
    flags.push({
      flagId: 'F-COAGULOPATHY',
      category: 'coagulopathy',
      priority: 'high',
      description: `INR ${data.haematology.inr} off anticoagulants`,
      suggestedAction: 'Haematology review; correct before surgery.'
    });
  }
  if (data.haematology.hbGL !== null && data.haematology.hbGL < 80) {
    flags.push({
      flagId: 'F-SEVERE-ANAEMIA',
      category: 'severe-anaemia',
      priority: 'high',
      description: `Hb ${data.haematology.hbGL} g/L`,
      suggestedAction: 'Investigate and treat; consider iron / transfusion pre-op.'
    });
  }
  if (
    data.endocrine.hba1cMmolMol !== null &&
    data.endocrine.hba1cMmolMol > 75
  ) {
    flags.push({
      flagId: 'F-UNCONTROLLED-DIABETES',
      category: 'uncontrolled-diabetes',
      priority: 'high',
      description: `HbA1c ${data.endocrine.hba1cMmolMol} mmol/mol`,
      suggestedAction: 'Diabetes team review; defer elective surgery if possible.'
    });
  }
  if (
    data.renalHepatic.egfrMlMin173m2 !== null &&
    data.renalHepatic.egfrMlMin173m2 < 30
  ) {
    flags.push({
      flagId: 'F-SEVERE-RENAL',
      category: 'severe-renal',
      priority: 'high',
      description: `eGFR ${data.renalHepatic.egfrMlMin173m2}`,
      suggestedAction: 'Nephrology review; adjust anaesthetic drug dosing.'
    });
  }
  if (
    data.renalHepatic.bilirubinUmolL !== null &&
    data.renalHepatic.bilirubinUmolL > 50
  ) {
    flags.push({
      flagId: 'F-SEVERE-HEPATIC',
      category: 'severe-hepatic',
      priority: 'high',
      description: `Bilirubin ${data.renalHepatic.bilirubinUmolL} µmol/L`,
      suggestedAction: 'Hepatology review; avoid hepatotoxic agents.'
    });
  }
  if (
    data.functionalCapacity.clinicalFrailtyScale !== null &&
    data.functionalCapacity.clinicalFrailtyScale >= 7
  ) {
    flags.push({
      flagId: 'F-SEVERE-FRAILTY',
      category: 'severe-frailty',
      priority: 'high',
      description: `CFS ${data.functionalCapacity.clinicalFrailtyScale}`,
      suggestedAction: 'Comprehensive Geriatric Assessment; shared-decision-making conversation.'
    });
  }
  if (
    data.respiratory.covidHistory === 'recent' &&
    data.respiratory.daysSinceCovid !== null &&
    data.respiratory.daysSinceCovid < 49
  ) {
    flags.push({
      flagId: 'F-RECENT-COVID',
      category: 'recent-covid-19',
      priority: 'high',
      description: `COVID-19 within ${data.respiratory.daysSinceCovid} days`,
      suggestedAction: 'Consider deferring elective surgery until 7 weeks post-infection (CPOC 2021).'
    });
  }
  if (
    data.gastrointestinal.fastingConfirmed === 'no' &&
    data.surgery.urgency === 'elective'
  ) {
    flags.push({
      flagId: 'F-FASTING-VIOLATION',
      category: 'fasting-violation',
      priority: 'high',
      description: 'Fasting requirements not confirmed',
      suggestedAction: 'Reschedule or perform rapid-sequence induction with informed consent.'
    });
  }
  if (
    (data.surgery.anticipatedBloodLossMl ?? 0) >= 500 &&
    data.haematology.groupAndSave !== 'valid'
  ) {
    flags.push({
      flagId: 'F-MISSING-CROSSMATCH',
      category: 'missing-crossmatch',
      priority: 'medium',
      description: 'Anticipated high blood loss without valid group & save',
      suggestedAction: 'Order group & save / crossmatch before surgery.'
    });
  }
  if (data.neurological.capacityConcern === 'yes') {
    flags.push({
      flagId: 'F-CAPACITY',
      category: 'capacity-concern',
      priority: 'medium',
      description: 'Clinician concern about capacity for consent',
      suggestedAction: 'Mental Capacity Act 2005 assessment; involve family / advocate.'
    });
  }
  if (
    Array.isArray(data.allergies) &&
    data.allergies.some(
      (a) =>
        a.category === 'latex' &&
        a.reactionSeverity !== 'mild' &&
        a.reactionSeverity !== ''
    )
  ) {
    flags.push({
      flagId: 'F-LATEX',
      category: 'latex-allergy',
      priority: 'high',
      description: 'Latex allergy',
      suggestedAction: 'Latex-free theatre environment required.'
    });
  }
  if (data.functionalCapacity.malnutritionRisk === 'high') {
    flags.push({
      flagId: 'F-MALNUTRITION',
      category: 'malnutrition-risk',
      priority: 'medium',
      description: 'High malnutrition risk',
      suggestedAction: 'Dietitian referral; consider oral nutritional supplements pre-op.'
    });
  }

  // --- GLP-1 receptor agonist and frailty-intersection flags ---

  const glp1 = data.glp1Management;
  const onGlp1 = glp1.onGlp1ReceptorAgonist === 'yes';
  const glp1NotHeldOrConfirmed =
    glp1.glp1HeldPerGuideline !== 'yes' && glp1.glp1ExtendedClearFluidsConfirmed !== 'yes';
  const cfs = data.functionalCapacity.clinicalFrailtyScale;
  const friedCategory = friedPhenotypeCategory(data);
  const isFrail = friedCategory === 'frail' || (cfs !== null && cfs >= 5);

  if (onGlp1 && (glp1.glp1GiSymptoms === 'yes' || glp1NotHeldOrConfirmed)) {
    flags.push({
      flagId: 'F-GLP1-ASPIRATION-RISK',
      category: 'glp1-aspiration-risk',
      priority: 'high',
      description:
        glp1.glp1GiSymptoms === 'yes'
          ? 'GLP-1 receptor agonist with active GI symptoms — delayed gastric emptying raises aspiration risk'
          : 'GLP-1 receptor agonist not held per guideline and extended clear-fluid fast not confirmed',
      suggestedAction:
        'Apply full-stomach precautions: rapid-sequence induction, consider gastric ultrasound, prefer regional anaesthesia where feasible, or consider delaying surgery.'
    });
  }
  if (cfs !== null && cfs >= 5 && data.functionalCapacity.miniCogPerformed !== 'yes') {
    flags.push({
      flagId: 'F-COGNITIVE-ASSESSMENT-INDICATED',
      category: 'cognitive-assessment-indicated',
      priority: 'medium',
      description: `Clinical Frailty Scale ${cfs} — Mini-Cog not yet performed`,
      suggestedAction: 'Perform Mini-Cog and consider a Comprehensive Geriatric Assessment before surgery.'
    });
  }
  if (onGlp1 && isFrail) {
    flags.push({
      flagId: 'F-SARCOPENIA-RISK',
      category: 'sarcopenia-risk',
      priority: 'medium',
      description: 'Frail patient on a GLP-1 receptor agonist — risk of accelerated sarcopenia from combined muscle and fat loss',
      suggestedAction: 'Refer for protein supplementation and resistance-exercise prehabilitation before surgery.'
    });
  }
  if (onGlp1 && glp1.glp1GiSymptoms === 'yes' && isFrail) {
    flags.push({
      flagId: 'F-DEHYDRATION-AKI-RISK',
      category: 'dehydration-aki-risk',
      priority: 'high',
      description: 'Frail patient with GLP-1-related GI symptoms plus fasting — elevated risk of dehydration, acute kidney injury, and delirium',
      suggestedAction: 'Consider pre-admission IV fluids, minimise fasting duration, and monitor renal function and cognition closely.'
    });
  }
  if (
    onGlp1 &&
    (glp1.glp1HeldPerGuideline === 'yes' || glp1.glp1ExtendedClearFluidsConfirmed === 'yes') &&
    data.endocrine.diabetesOnInsulin === 'yes'
  ) {
    flags.push({
      flagId: 'F-REBOUND-GLYCAEMIC-RISK',
      category: 'rebound-glycaemic-risk',
      priority: 'medium',
      description: 'GLP-1 receptor agonist held or fasting extended in a patient on insulin — risk of rebound hyperglycaemia or hypoglycaemia',
      suggestedAction: 'Agree a perioperative glycaemic monitoring and insulin-adjustment plan with the diabetes team.'
    });
  }

  return flags;
}

export { detectAdditionalFlags };
