import { classifyDiseaseActivity } from './types.js';

// Flagged-issue detection. Independent of the DAS28 score (which the
// grader computes) but uses the same DAS28 formula to detect "high
// disease activity" status. Raises clinician-facing flags for cervical
// spine risk, immunosuppression + infection risk, ILD, uveitis,
// cardiovascular involvement, drug allergy / anaphylaxis, latex allergy,
// renal impairment, liver function, osteoporosis on steroids,
// vaccination / TB-screening gaps for biologics, and severe disability.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 */

// Wrapped in an IIFE; published via window.RheumatologyAssessment.

/**
 * @param {AssessmentData} data
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data) {
  /** @type {AdditionalFlag[]} */
  const flags = [];

  // ─── High disease activity ──────────────────────────────
  const tjc = data.jointAssessment.tenderJointCount28;
  const sjc = data.jointAssessment.swollenJointCount28;
  const esr = data.laboratoryResults.esr;
  const vas = data.jointAssessment.patientGlobalVAS;
  if (tjc !== null && sjc !== null && esr !== null && vas !== null) {
    const esrClamped = Math.max(esr, 1);
    const das28 =
      0.56 * Math.sqrt(tjc) +
      0.28 * Math.sqrt(sjc) +
      0.70 * Math.log(esrClamped) +
      0.014 * vas;
    const rounded = Math.round(das28 * 100) / 100;
    const activity = classifyDiseaseActivity(rounded);
    if (activity === 'high') {
      flags.push({
        id: 'FLAG-DAS28-001',
        category: 'Disease Activity',
        message: `High disease activity (DAS28 ${rounded.toFixed(2)}) - consider treatment escalation`,
        priority: 'high'
      });
    }
  }

  // ─── Cervical spine involvement ─────────────────────────
  if (
    data.diseaseHistory.primaryDiagnosis === 'rheumatoid-arthritis' &&
    data.diseaseHistory.diseaseDurationYears !== null &&
    data.diseaseHistory.diseaseDurationYears > 5
  ) {
    flags.push({
      id: 'FLAG-CSPINE-001',
      category: 'Cervical Spine',
      message: 'Long-standing RA - assess cervical spine stability (atlanto-axial subluxation risk)',
      priority: 'high'
    });
  }

  // ─── Immunosuppression + infection risk ─────────────────
  if (data.comorbiditiesSocial.recentInfections === 'yes') {
    const hasBiologics = data.currentMedications.biologics.length > 0;
    const hasDmards = data.currentMedications.dmards.length > 0;
    if (hasBiologics || hasDmards) {
      flags.push({
        id: 'FLAG-INFECT-001',
        category: 'Infection Risk',
        message: `Recent infection on immunosuppression (${hasBiologics ? 'biologics' : 'DMARDs'}) - assess infection control`,
        priority: 'high'
      });
    }
  }

  // ─── Interstitial lung disease ──────────────────────────
  if (data.extraArticularFeatures.interstitialLungDisease === 'yes') {
    flags.push({
      id: 'FLAG-ILD-001',
      category: 'Pulmonary',
      message: `Interstitial lung disease - ${data.extraArticularFeatures.ildDetails || 'monitor pulmonary function'}`,
      priority: 'high'
    });
  }

  // ─── Uveitis ────────────────────────────────────────────
  if (data.extraArticularFeatures.uveitis === 'yes') {
    flags.push({
      id: 'FLAG-UVEITIS-001',
      category: 'Ophthalmological',
      message: `Uveitis - ${data.extraArticularFeatures.uveitisDetails || 'ophthalmology review recommended'}`,
      priority: 'medium'
    });
  }

  // ─── Cardiovascular involvement ─────────────────────────
  if (data.extraArticularFeatures.cardiovascularInvolvement === 'yes') {
    flags.push({
      id: 'FLAG-CV-001',
      category: 'Cardiovascular',
      message: `Cardiovascular involvement - ${data.extraArticularFeatures.cardiovascularDetails || 'assess cardiac risk'}`,
      priority: 'high'
    });
  }

  // ─── Allergy alerts ─────────────────────────────────────
  for (let i = 0; i < data.allergies.drugAllergies.length; i++) {
    const allergy = data.allergies.drugAllergies[i];
    if (allergy && allergy.severity === 'anaphylaxis') {
      flags.push({
        id: `FLAG-ALLERGY-ANAPH-${i}`,
        category: 'Allergy',
        message: `ANAPHYLAXIS history: ${allergy.allergen || '(allergen not specified)'}`,
        priority: 'high'
      });
    }
  }

  if (data.allergies.drugAllergies.length > 0) {
    flags.push({
      id: 'FLAG-ALLERGY-001',
      category: 'Allergy',
      message: `${data.allergies.drugAllergies.length} drug allergy/allergies documented`,
      priority: 'medium'
    });
  }

  if (data.allergies.latexAllergy === 'yes') {
    flags.push({
      id: 'FLAG-LATEX-001',
      category: 'Allergy',
      message: 'Latex allergy - use latex-free equipment',
      priority: 'high'
    });
  }

  // ─── Renal impairment ───────────────────────────────────
  if (
    data.laboratoryResults.egfr !== null &&
    data.laboratoryResults.egfr < 60
  ) {
    flags.push({
      id: 'FLAG-RENAL-001',
      category: 'Renal',
      message: `Impaired renal function (eGFR ${data.laboratoryResults.egfr}) - adjust medication doses`,
      priority: 'medium'
    });
  }

  // ─── Liver function ─────────────────────────────────────
  if (
    data.laboratoryResults.alt !== null &&
    data.laboratoryResults.alt > 40
  ) {
    flags.push({
      id: 'FLAG-LIVER-001',
      category: 'Hepatic',
      message: `Elevated liver enzymes (ALT ${data.laboratoryResults.alt}) - review hepatotoxic medications`,
      priority: 'medium'
    });
  }

  // ─── Osteoporosis on steroids ───────────────────────────
  if (
    data.comorbiditiesSocial.osteoporosis === 'yes' &&
    data.currentMedications.steroids.length > 0
  ) {
    flags.push({
      id: 'FLAG-OSTEO-001',
      category: 'Musculoskeletal',
      message: 'Osteoporosis on steroids - fracture risk, review bone protection',
      priority: 'medium'
    });
  }

  // ─── Vaccination status on biologics ────────────────────
  if (
    data.comorbiditiesSocial.vaccinationStatusUpToDate === 'no' &&
    data.currentMedications.biologics.length > 0
  ) {
    flags.push({
      id: 'FLAG-VACC-001',
      category: 'Infection Risk',
      message: 'Vaccinations not up to date on biologic therapy - review immunisation schedule',
      priority: 'medium'
    });
  }

  // ─── TB screening before biologics ──────────────────────
  if (
    data.comorbiditiesSocial.tuberculosisScreening === 'no' &&
    data.currentMedications.biologics.length > 0
  ) {
    flags.push({
      id: 'FLAG-TB-001',
      category: 'Infection Risk',
      message: 'TB screening not performed - required before biologic therapy',
      priority: 'high'
    });
  }

  // ─── Severe disability ──────────────────────────────────
  if (
    data.functionalAssessment.walkingAbility === 'bedbound' ||
    (data.functionalAssessment.haqDiScore !== null &&
      data.functionalAssessment.haqDiScore > 2.5)
  ) {
    flags.push({
      id: 'FLAG-DISAB-001',
      category: 'Functional',
      message: 'Severe functional disability - consider multidisciplinary rehabilitation',
      priority: 'medium'
    });
  }

  // Sort: high > medium > low
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectAdditionalFlags };
