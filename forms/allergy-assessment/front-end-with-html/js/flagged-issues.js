// Flagged-issue detection for the allergy assessment.
//
// Independent of the severity grading, this module raises clinician-facing
// flags for safety-critical findings: anaphylaxis history, anaphylaxis-grade
// drug or food allergies, latex allergy, insect-sting anaphylaxis or severe
// reaction, mast cell disorders, asthma comorbidity, missing action plan or
// auto-injector, multiple food allergies, mental-health impact, and very low
// quality-of-life scores.
//
// Anaphylaxis-related findings escalate to `urgent` priority so the report
// renders them with the most prominent styling.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 */

// Wrapped in an IIFE; published via window.AllergyAssessment.

/**
 * @param {AssessmentData} data
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data) {
  /** @type {AdditionalFlag[]} */
  const flags = [];

  // ─── Anaphylaxis history (URGENT) ───────────────────────────
  if (data.anaphylaxisHistory.hasAnaphylaxisHistory === 'yes') {
    const count = data.anaphylaxisHistory.numberOfEpisodes ?? 0;
    flags.push({
      id: 'FLAG-ANAPH-001',
      category: 'Anaphylaxis',
      message: `History of anaphylaxis (${count} episode${count !== 1 ? 's' : ''}).`,
      priority: 'urgent'
    });
  }

  // ─── No adrenaline auto-injector when indicated (URGENT) ────
  if (
    data.anaphylaxisHistory.hasAnaphylaxisHistory === 'yes' &&
    data.anaphylaxisHistory.adrenalineAutoInjectorPrescribed === 'no'
  ) {
    flags.push({
      id: 'FLAG-ANAPH-002',
      category: 'Anaphylaxis',
      message: 'CRITICAL: anaphylaxis history but NO adrenaline auto-injector prescribed.',
      priority: 'urgent'
    });
  }

  // ─── Drug allergy to commonly-used drugs (HIGH) ─────────────
  const commonAnaesthetics = [
    'penicillin', 'amoxicillin', 'cephalosporin', 'nsaid', 'ibuprofen',
    'aspirin', 'codeine', 'morphine', 'lidocaine', 'latex', 'suxamethonium',
    'propofol', 'thiopental', 'atracurium', 'rocuronium'
  ];
  for (let i = 0; i < data.drugAllergies.drugAllergies.length; i++) {
    const allergy = data.drugAllergies.drugAllergies[i];
    if (
      allergy.allergen &&
      commonAnaesthetics.some((a) => allergy.allergen.toLowerCase().includes(a))
    ) {
      flags.push({
        id: `FLAG-DRUG-${i}`,
        category: 'Drug Allergy',
        message: `Drug allergy: ${allergy.allergen} (${allergy.severity || 'severity unspecified'}) - commonly used drug.`,
        priority: 'high'
      });
    }
  }

  // ─── Anaphylaxis-severity drug allergies (URGENT) ───────────
  for (let i = 0; i < data.drugAllergies.drugAllergies.length; i++) {
    const allergy = data.drugAllergies.drugAllergies[i];
    if (allergy.severity === 'anaphylaxis') {
      flags.push({
        id: `FLAG-DRUG-ANAPH-${i}`,
        category: 'Drug Allergy',
        message: `ANAPHYLAXIS history to drug: ${allergy.allergen || '(allergen not specified)'}.`,
        priority: 'urgent'
      });
    }
  }

  // ─── Latex allergy (HIGH) ───────────────────────────────────
  if (data.environmentalAllergies.latexAllergy === 'yes') {
    flags.push({
      id: 'FLAG-LATEX-001',
      category: 'Environmental',
      message: 'Latex allergy - ensure latex-free environment for all procedures.',
      priority: 'high'
    });
  }

  // ─── Multiple food allergies (MEDIUM) ───────────────────────
  const foodAllergyCount = data.foodAllergies.foodAllergies.filter((a) => a.allergen).length;
  if (foodAllergyCount >= 3) {
    flags.push({
      id: 'FLAG-FOOD-001',
      category: 'Food Allergy',
      message: `Multiple food allergies (${foodAllergyCount}) - nutritional review may be needed.`,
      priority: 'medium'
    });
  }

  // ─── Anaphylaxis-severity food allergies (URGENT) ───────────
  for (let i = 0; i < data.foodAllergies.foodAllergies.length; i++) {
    const allergy = data.foodAllergies.foodAllergies[i];
    if (allergy.severity === 'anaphylaxis') {
      flags.push({
        id: `FLAG-FOOD-ANAPH-${i}`,
        category: 'Food Allergy',
        message: `ANAPHYLAXIS history to food: ${allergy.allergen || '(allergen not specified)'}.`,
        priority: 'urgent'
      });
    }
  }

  // ─── No action plan (MEDIUM) ────────────────────────────────
  if (
    data.anaphylaxisHistory.hasAnaphylaxisHistory === 'yes' &&
    data.anaphylaxisHistory.actionPlanInPlace !== 'yes'
  ) {
    flags.push({
      id: 'FLAG-PLAN-001',
      category: 'Action Plan',
      message: 'Anaphylaxis history but no action plan in place.',
      priority: 'medium'
    });
  }

  if (data.impactActionPlan.emergencyActionPlanStatus === 'not-in-place') {
    flags.push({
      id: 'FLAG-PLAN-002',
      category: 'Action Plan',
      message: 'Emergency action plan is not in place.',
      priority: 'medium'
    });
  }

  if (data.impactActionPlan.emergencyActionPlanStatus === 'needs-update') {
    flags.push({
      id: 'FLAG-PLAN-003',
      category: 'Action Plan',
      message: 'Emergency action plan needs updating.',
      priority: 'medium'
    });
  }

  // ─── Asthma comorbidity (MEDIUM) ────────────────────────────
  if (data.comorbidities.asthma === 'yes') {
    flags.push({
      id: 'FLAG-ASTHMA-001',
      category: 'Comorbidity',
      message: `Asthma comorbidity (${data.comorbidities.asthmaSeverity || 'severity unspecified'}) - increased anaphylaxis risk.`,
      priority: 'medium'
    });
  }

  // ─── Mast cell disorder (HIGH) ──────────────────────────────
  if (data.comorbidities.mastCellDisorders === 'yes') {
    flags.push({
      id: 'FLAG-MAST-001',
      category: 'Comorbidity',
      message: 'Mast cell disorder - heightened risk of severe allergic reactions.',
      priority: 'high'
    });
  }

  // ─── Insect sting allergy (URGENT for anaphylaxis, HIGH for severe) ──
  if (
    data.environmentalAllergies.insectStingAllergy === 'yes' &&
    data.environmentalAllergies.insectStingSeverity === 'anaphylaxis'
  ) {
    flags.push({
      id: 'FLAG-INSECT-001',
      category: 'Environmental',
      message: 'ANAPHYLAXIS history to insect sting - venom immunotherapy may be indicated.',
      priority: 'urgent'
    });
  } else if (
    data.environmentalAllergies.insectStingAllergy === 'yes' &&
    data.environmentalAllergies.insectStingSeverity === 'severe'
  ) {
    flags.push({
      id: 'FLAG-INSECT-002',
      category: 'Environmental',
      message: 'Severe insect sting allergy - venom immunotherapy may be indicated.',
      priority: 'high'
    });
  }

  // ─── Mental health impact (MEDIUM) ──────────────────────────
  if (data.comorbidities.mentalHealthImpact === 'yes') {
    flags.push({
      id: 'FLAG-MENTAL-001',
      category: 'Quality of Life',
      message: 'Mental health impact reported - psychological support may be needed.',
      priority: 'medium'
    });
  }

  // ─── Quality of life severely impacted (MEDIUM) ─────────────
  if (
    data.impactActionPlan.qualityOfLifeScore !== null &&
    data.impactActionPlan.qualityOfLifeScore <= 3
  ) {
    flags.push({
      id: 'FLAG-QOL-001',
      category: 'Quality of Life',
      message: `Very low quality of life score (${data.impactActionPlan.qualityOfLifeScore}/10).`,
      priority: 'medium'
    });
  }

  // Sort: urgent > high > medium > low
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectAdditionalFlags };
