// Flagged-issue detection. Independent of MUST score (which the grader
// computes), this module raises clinician-facing flags for severe
// underweight, significant weight loss, swallowing difficulty / choking,
// poor intake, GI symptoms, food allergies / anaphylaxis, dehydration,
// dependence on parenteral nutrition, and missing dietician review.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 */

// Wrapped in an IIFE; published via window.NutritionAssessment.

/**
 * @param {AssessmentData} data
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data) {
  /** @type {AdditionalFlag[]} */
  const flags = [];

  const anthro = data.anthropometricMeasurements;
  const screen = data.nutritionalScreening;
  const diet = data.dietaryHistory;
  const swal = data.swallowingOralHealth;
  const gi = data.gastrointestinalFunction;
  const allergies = data.foodAllergiesIntolerances;
  const support = data.currentNutritionalSupport;

  // ─── BMI alerts ───────────────────────────────────────────
  if (anthro.bmi !== null && anthro.bmi < 16) {
    flags.push({
      id: 'FLAG-BMI-001',
      category: 'Anthropometrics',
      message: `BMI ${anthro.bmi} - severe underweight (<16); urgent dietetic review recommended.`,
      priority: 'urgent'
    });
  } else if (anthro.bmi !== null && anthro.bmi < 18.5) {
    flags.push({
      id: 'FLAG-BMI-002',
      category: 'Anthropometrics',
      message: `BMI ${anthro.bmi} - underweight (<18.5).`,
      priority: 'high'
    });
  } else if (anthro.bmi !== null && anthro.bmi >= 40) {
    flags.push({
      id: 'FLAG-BMI-003',
      category: 'Anthropometrics',
      message: `BMI ${anthro.bmi} - obese class III.`,
      priority: 'medium'
    });
  }

  // ─── Weight-loss alerts ───────────────────────────────────
  if (anthro.weightLossPercent !== null && anthro.weightLossPercent > 15) {
    flags.push({
      id: 'FLAG-WL-001',
      category: 'Weight Loss',
      message: `${anthro.weightLossPercent}% unplanned weight loss - severe loss; urgent assessment recommended.`,
      priority: 'urgent'
    });
  } else if (anthro.weightLossPercent !== null && anthro.weightLossPercent > 10) {
    flags.push({
      id: 'FLAG-WL-002',
      category: 'Weight Loss',
      message: `${anthro.weightLossPercent}% unplanned weight loss in the past 3-6 months.`,
      priority: 'high'
    });
  } else if (anthro.weightLossPercent !== null && anthro.weightLossPercent >= 5) {
    flags.push({
      id: 'FLAG-WL-003',
      category: 'Weight Loss',
      message: `${anthro.weightLossPercent}% unplanned weight loss in the past 3-6 months.`,
      priority: 'medium'
    });
  }

  // ─── MUST acute disease ───────────────────────────────────
  if (screen.acuteDisease === 'acutely-ill-no-intake-5d') {
    flags.push({
      id: 'FLAG-ACUTE-001',
      category: 'Acute Illness',
      message: 'Acutely ill with no nutritional intake for >5 days - immediate intervention indicated.',
      priority: 'urgent'
    });
  }

  // ─── Reduced intake / poor appetite ───────────────────────
  if (diet.appetiteDecreased === 'yes') {
    flags.push({
      id: 'FLAG-INTAKE-001',
      category: 'Dietary Intake',
      message: 'Decreased appetite reported.',
      priority: 'medium'
    });
  }
  if (
    diet.foodIntakeReduced === 'yes' &&
    diet.reducedIntakeDays !== null &&
    diet.reducedIntakeDays > 5
  ) {
    flags.push({
      id: 'FLAG-INTAKE-002',
      category: 'Dietary Intake',
      message: `Reduced food intake for ${diet.reducedIntakeDays} days - escalating concern.`,
      priority: 'high'
    });
  } else if (diet.foodIntakeReduced === 'yes') {
    flags.push({
      id: 'FLAG-INTAKE-003',
      category: 'Dietary Intake',
      message: 'Reduced food intake reported.',
      priority: 'medium'
    });
  }

  // ─── Hydration ────────────────────────────────────────────
  if (diet.fluidIntakeAdequate === 'no') {
    flags.push({
      id: 'FLAG-HYDR-001',
      category: 'Hydration',
      message: 'Inadequate fluid intake reported - dehydration risk.',
      priority: 'medium'
    });
  }

  // ─── Swallowing alerts ────────────────────────────────────
  if (swal.chokingEpisodes === 'yes') {
    flags.push({
      id: 'FLAG-SWAL-001',
      category: 'Swallowing',
      message: 'Choking episodes reported - urgent SLT (speech and language therapy) referral.',
      priority: 'urgent'
    });
  }
  if (swal.swallowingDifficulty === 'yes') {
    flags.push({
      id: 'FLAG-SWAL-002',
      category: 'Swallowing',
      message: 'Difficulty swallowing - assess dysphagia and texture-modified diet need.',
      priority: 'high'
    });
  }
  if (swal.coughingWhileEating === 'yes') {
    flags.push({
      id: 'FLAG-SWAL-003',
      category: 'Swallowing',
      message: 'Coughing while eating - possible aspiration risk.',
      priority: 'high'
    });
  }
  if (swal.dentureUse === 'yes' && swal.denturesFitWell === 'no') {
    flags.push({
      id: 'FLAG-ORAL-001',
      category: 'Oral Health',
      message: 'Ill-fitting dentures - may compromise food intake.',
      priority: 'medium'
    });
  }
  if (swal.mouthSores === 'yes') {
    flags.push({
      id: 'FLAG-ORAL-002',
      category: 'Oral Health',
      message: 'Mouth sores reported - may limit oral intake.',
      priority: 'medium'
    });
  }

  // ─── GI symptom alerts ────────────────────────────────────
  if (gi.vomiting === 'yes') {
    flags.push({
      id: 'FLAG-GI-001',
      category: 'Gastrointestinal',
      message: 'Vomiting reported - assess hydration and intake.',
      priority: 'high'
    });
  }
  if (gi.diarrhea === 'yes') {
    flags.push({
      id: 'FLAG-GI-002',
      category: 'Gastrointestinal',
      message: 'Diarrhoea reported - hydration and electrolyte risk.',
      priority: 'high'
    });
  }
  if (gi.nausea === 'yes') {
    flags.push({
      id: 'FLAG-GI-003',
      category: 'Gastrointestinal',
      message: 'Nausea reported - may limit oral intake.',
      priority: 'medium'
    });
  }
  if (gi.constipation === 'yes') {
    flags.push({
      id: 'FLAG-GI-004',
      category: 'Gastrointestinal',
      message: 'Constipation reported - review fluid and fibre intake.',
      priority: 'low'
    });
  }
  if (gi.earlysatiety === 'yes') {
    flags.push({
      id: 'FLAG-GI-005',
      category: 'Gastrointestinal',
      message: 'Early satiety reported - may limit total daily intake.',
      priority: 'medium'
    });
  }

  // ─── Allergy alerts ───────────────────────────────────────
  for (let i = 0; i < allergies.foodAllergies.length; i++) {
    const a = allergies.foodAllergies[i];
    if (a && a.severity === 'anaphylaxis') {
      flags.push({
        id: `FLAG-ALLERGY-ANAPH-${i}`,
        category: 'Food Allergy',
        message: `ANAPHYLAXIS history: ${a.allergen || '(allergen not specified)'}.`,
        priority: 'urgent'
      });
    }
  }
  if (allergies.foodAllergies.length > 0) {
    flags.push({
      id: 'FLAG-ALLERGY-001',
      category: 'Food Allergy',
      message: `${allergies.foodAllergies.length} food allergy/allergies documented.`,
      priority: 'medium'
    });
  }

  // ─── Nutritional support alerts ───────────────────────────
  if (support.parenteralNutrition === 'yes') {
    flags.push({
      id: 'FLAG-SUPP-001',
      category: 'Nutritional Support',
      message: 'Currently receiving parenteral nutrition - close monitoring required.',
      priority: 'high'
    });
  }
  if (support.enteralFeeding === 'yes') {
    flags.push({
      id: 'FLAG-SUPP-002',
      category: 'Nutritional Support',
      message: `Currently on enteral feeding (${support.enteralRoute || 'route not specified'}).`,
      priority: 'medium'
    });
  }
  if (support.dieticianInvolvement === 'no') {
    flags.push({
      id: 'FLAG-SUPP-003',
      category: 'Nutritional Support',
      message: 'No current dietician involvement - referral may be indicated.',
      priority: 'low'
    });
  }

  // ─── Alcohol alerts ───────────────────────────────────────
  if (
    diet.alcoholUse === 'yes' &&
    diet.alcoholUnitsPerWeek !== null &&
    diet.alcoholUnitsPerWeek > 14
  ) {
    flags.push({
      id: 'FLAG-ALC-001',
      category: 'Lifestyle',
      message: `Alcohol intake ${diet.alcoholUnitsPerWeek} units/week - exceeds low-risk guidance (14 units/week).`,
      priority: 'medium'
    });
  }

  // Sort: urgent > high > medium > low
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectAdditionalFlags };
