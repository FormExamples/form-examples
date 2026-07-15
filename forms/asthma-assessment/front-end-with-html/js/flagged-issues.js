// Flagged-issue detection. Independent of ACT score (which the grader
// computes), this module raises clinician-facing flags for high-risk
// exacerbation history, oral steroid dependence, poor adherence, low FEV1
// or peak flow, drug allergy / anaphylaxis, smoking, vaping, occupational
// triggers, and a panel of comorbidities.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 */

/**
 * @param {AssessmentData} data
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data) {
  /** @type {AdditionalFlag[]} */
  const flags = [];

  // ─── Exacerbation alerts ───────────────────────────────────
  if (data.exacerbationHistory.icuAdmissions === 'yes') {
    flags.push({
      id: 'FLAG-EXAC-001',
      category: 'Exacerbation History',
      message: `Previous ICU admission for asthma (${data.exacerbationHistory.icuAdmissionCount ?? '?'} times).`,
      priority: 'high'
    });
  }

  if (data.exacerbationHistory.intubationHistory === 'yes') {
    flags.push({
      id: 'FLAG-EXAC-002',
      category: 'Exacerbation History',
      message: 'Previous intubation for asthma - near-fatal asthma history.',
      priority: 'high'
    });
  }

  if (
    data.exacerbationHistory.hospitalisationsLastYear !== null &&
    data.exacerbationHistory.hospitalisationsLastYear >= 2
  ) {
    flags.push({
      id: 'FLAG-EXAC-003',
      category: 'Exacerbation History',
      message: `${data.exacerbationHistory.hospitalisationsLastYear} hospitalisations in the last year - high exacerbation risk.`,
      priority: 'high'
    });
  }

  if (
    data.exacerbationHistory.edVisitsLastYear !== null &&
    data.exacerbationHistory.edVisitsLastYear >= 3
  ) {
    flags.push({
      id: 'FLAG-EXAC-004',
      category: 'Exacerbation History',
      message: `${data.exacerbationHistory.edVisitsLastYear} ED visits in the last year.`,
      priority: 'high'
    });
  }

  if (
    data.exacerbationHistory.oralSteroidCoursesLastYear !== null &&
    data.exacerbationHistory.oralSteroidCoursesLastYear >= 2
  ) {
    flags.push({
      id: 'FLAG-EXAC-005',
      category: 'Exacerbation History',
      message: `${data.exacerbationHistory.oralSteroidCoursesLastYear} oral steroid courses in the last year - consider step-up therapy.`,
      priority: 'high'
    });
  }

  if (
    data.exacerbationHistory.exacerbationsLastYear !== null &&
    data.exacerbationHistory.exacerbationsLastYear >= 3
  ) {
    flags.push({
      id: 'FLAG-FREQ-001',
      category: 'Exacerbation Risk',
      message: `${data.exacerbationHistory.exacerbationsLastYear} exacerbations in the last year - frequent exacerbator phenotype.`,
      priority: 'high'
    });
  }

  // ─── Oral steroid dependence ──────────────────────────────
  if (data.currentMedications.oralSteroids === 'yes') {
    flags.push({
      id: 'FLAG-MEDS-001',
      category: 'Medications',
      message: 'Currently on oral corticosteroids - assess for steroid dependence and side effects.',
      priority: 'high'
    });
  }

  // ─── Poor medication adherence ────────────────────────────
  if (data.currentMedications.medicationAdherence === 'poor') {
    flags.push({
      id: 'FLAG-MEDS-002',
      category: 'Medications',
      message: 'Poor medication adherence reported - may explain poor control.',
      priority: 'medium'
    });
  }

  // ─── Inhaler technique ────────────────────────────────────
  if (data.currentMedications.inhalerTechniqueReviewed === 'no') {
    flags.push({
      id: 'FLAG-MEDS-003',
      category: 'Medications',
      message: 'Inhaler technique not recently reviewed - technique assessment recommended.',
      priority: 'medium'
    });
  }

  // ─── Lung function alerts ─────────────────────────────────
  if (
    data.lungFunction.fev1Percent !== null &&
    data.lungFunction.fev1Percent < 60
  ) {
    flags.push({
      id: 'FLAG-LUNG-001',
      category: 'Lung Function',
      message: `FEV1 ${data.lungFunction.fev1Percent}% predicted - significant airway obstruction.`,
      priority: 'high'
    });
  } else if (
    data.lungFunction.fev1Percent !== null &&
    data.lungFunction.fev1Percent < 80
  ) {
    flags.push({
      id: 'FLAG-LUNG-002',
      category: 'Lung Function',
      message: `FEV1 ${data.lungFunction.fev1Percent}% predicted - mild airway obstruction.`,
      priority: 'medium'
    });
  }

  if (
    data.lungFunction.peakFlowPercent !== null &&
    data.lungFunction.peakFlowPercent < 60
  ) {
    flags.push({
      id: 'FLAG-LUNG-003',
      category: 'Lung Function',
      message: `Peak flow ${data.lungFunction.peakFlowPercent}% of personal best - significant variability.`,
      priority: 'high'
    });
  }

  // ─── Allergy alerts ───────────────────────────────────────
  for (let i = 0; i < data.allergies.drugAllergies.length; i++) {
    const allergy = data.allergies.drugAllergies[i];
    if (allergy && allergy.severity === 'anaphylaxis') {
      flags.push({
        id: `FLAG-ALLERGY-ANAPH-${i}`,
        category: 'Allergy',
        message: `ANAPHYLAXIS history: ${allergy.allergen || '(allergen not specified)'}.`,
        priority: 'urgent'
      });
    }
  }

  if (data.allergies.drugAllergies.length > 0) {
    flags.push({
      id: 'FLAG-ALLERGY-001',
      category: 'Allergy',
      message: `${data.allergies.drugAllergies.length} drug allergy/allergies documented.`,
      priority: 'medium'
    });
  }

  // ─── Smoking / vaping alerts ──────────────────────────────
  if (data.socialHistory.smoking === 'current') {
    flags.push({
      id: 'FLAG-SMOKE-001',
      category: 'Social History',
      message: 'Active smoker - smoking cessation critical for asthma control.',
      priority: 'high'
    });
  }

  if (data.socialHistory.vaping === 'current') {
    flags.push({
      id: 'FLAG-VAPE-001',
      category: 'Social History',
      message: 'Active vaper - vaping may worsen asthma symptoms.',
      priority: 'medium'
    });
  }

  // ─── Occupational asthma ──────────────────────────────────
  if (data.triggers.occupational === 'yes') {
    flags.push({
      id: 'FLAG-OCCUP-001',
      category: 'Triggers',
      message: `Occupational triggers identified: ${data.triggers.occupationalDetails || 'details not specified'}.`,
      priority: 'high'
    });
  }

  // ─── Comorbidity alerts ───────────────────────────────────
  if (data.comorbidities.gord === 'yes') {
    flags.push({
      id: 'FLAG-COMOR-001',
      category: 'Comorbidities',
      message: 'GORD present - may contribute to poorly controlled asthma.',
      priority: 'medium'
    });
  }

  if (data.comorbidities.obesity === 'yes') {
    flags.push({
      id: 'FLAG-COMOR-002',
      category: 'Comorbidities',
      message: 'Obesity present - weight management may improve asthma control.',
      priority: 'medium'
    });
  }

  if (
    data.comorbidities.anxiety === 'yes' ||
    data.comorbidities.depression === 'yes'
  ) {
    flags.push({
      id: 'FLAG-COMOR-003',
      category: 'Comorbidities',
      message: 'Anxiety/depression present - may affect asthma perception and adherence.',
      priority: 'medium'
    });
  }

  if (data.comorbidities.allergicRhinitis === 'yes') {
    flags.push({
      id: 'FLAG-COMOR-004',
      category: 'Comorbidities',
      message: 'Allergic rhinitis present - treat upper airway disease to improve asthma control.',
      priority: 'low'
    });
  }

  if (data.comorbidities.vocalCordDysfunction === 'yes') {
    flags.push({
      id: 'FLAG-COMOR-005',
      category: 'Comorbidities',
      message: 'Vocal cord dysfunction - may mimic or co-exist with asthma.',
      priority: 'medium'
    });
  }

  // ─── Environmental alerts ─────────────────────────────────
  if (data.socialHistory.occupationalExposures === 'yes') {
    flags.push({
      id: 'FLAG-ENV-001',
      category: 'Environment',
      message: `Occupational exposures: ${data.socialHistory.occupationalExposureDetails || 'details not specified'}.`,
      priority: 'medium'
    });
  }

  if (data.socialHistory.moldExposure === 'yes') {
    flags.push({
      id: 'FLAG-ENV-002',
      category: 'Environment',
      message: 'Mold exposure in home - environmental remediation recommended.',
      priority: 'medium'
    });
  }

  // Sort: urgent > high > medium > low
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectAdditionalFlags };
