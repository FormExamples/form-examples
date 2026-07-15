import { symptomDefinitions } from './symptom-rules.js';
import { severityCategory } from './types.js';

// Menstrual Symptom Severity Score grader. Pure functions: take an
// `AssessmentData` object, return the total symptom score (0-30), the
// severity category label, and the list of fired rules.
//
// Severity category cutoffs:
//   0-5   -> Minimal
//   6-10  -> Mild
//   11-20 -> Moderate
//   21-30 -> Severe
//
// The first six symptoms are direct patient ratings (menstrual pain,
// flow heaviness, pelvic pain, abnormal bleeding, discharge, urinary).
// Symptoms 7-10 (impact on daily life, work, relationships, mood) are
// derived as the rounded mean of the six physical scores, capped at 3.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

/** Convert flow heaviness to numeric score (0-3) or null if unanswered. */
function flowHeavinessScore(flow) {
  switch (flow) {
    case 'light': return 0;
    case 'moderate': return 1;
    case 'heavy': return 2;
    case 'very-heavy': return 3;
    default: return null;
  }
}

/**
 * Calculate the Menstrual Symptom Severity Score for the supplied data.
 * @param {AssessmentData} data
 * @returns {{ symptomScore: number, symptomCategoryLabel: string, firedRules: FiredRule[] }}
 */
function calculateSymptomScore(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  const gs = data.gynecologicalSymptoms;
  const mh = data.menstrualHistory;

  /** @type {(number | null)[]} */
  const scores = [
    mh.painSeverity,
    flowHeavinessScore(mh.flowHeaviness),
    gs.pelvicPain,
    gs.abnormalBleeding,
    gs.discharge,
    gs.urinarySymptoms,
    null, // 7 - daily activities (composite)
    null, // 8 - work and school (composite)
    null, // 9 - relationships (composite)
    null  // 10 - emotional wellbeing (composite)
  ];

  // For questions 7-10, derive from the combined burden of symptoms 1-6.
  const symptomBurden = [
    mh.painSeverity ?? 0,
    flowHeavinessScore(mh.flowHeaviness) ?? 0,
    gs.pelvicPain ?? 0,
    gs.abnormalBleeding ?? 0,
    gs.discharge ?? 0,
    gs.urinarySymptoms ?? 0
  ];
  const totalPhysical = symptomBurden.reduce((a, b) => a + b, 0);
  const impactScore = Math.min(3, Math.round(totalPhysical / 6));

  scores[6] = impactScore;
  scores[7] = impactScore;
  scores[8] = impactScore;
  scores[9] = impactScore;

  let symptomScore = 0;

  for (let i = 0; i < scores.length; i++) {
    const score = scores[i];
    if (score !== null && score > 0) {
      const definition = symptomDefinitions[i];
      firedRules.push({
        id: definition.id,
        domain: definition.domain,
        description: definition.text,
        score
      });
      symptomScore += score;
    } else if (score !== null) {
      symptomScore += score;
    }
  }

  const symptomCategoryLabel = severityCategory(symptomScore);

  return { symptomScore, symptomCategoryLabel, firedRules };
}

export { flowHeavinessScore, calculateSymptomScore };
