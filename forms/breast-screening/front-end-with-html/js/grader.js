import { deriveEligibility, outcomeRules } from './rules.js';

// Breast-screening grader. Pure functions: take a `ScreeningData` object, derive
// the eligibility status, then walk the ordered `outcomeRules` and take the
// FIRST match to fix the screening outcome and outcome band. This is a
// result-classification, not a numeric score.
//
// Classification algorithm (spec §4):
//   eligibilityStatus = deriveEligibility(d)   // symptomatic → higher-risk → age → eligible
//   For the outcome, in order:
//     symptomatic == 'yes'                          → symptomatic-pathway-referral / referral
//     readingOutcome == 'technical-repeat'          → technical-repeat / repeat
//     readingOutcome == 'normal-routine-recall'     → routine-recall / routine
//     readingOutcome == 'recall-for-assessment':
//       not assessed or classification null         → recall-to-assessment-clinic / assessment
//       classification 1–2                          → routine-recall / routine
//       classification 3                            → short-interval-follow-up / assessment
//       classification 4–5                          → urgent-breast-clinic / urgent
//     otherwise                                     → '' / incomplete
//
// Completeness: the record is `complete` when eligibility inputs, consent, the
// views taken, image adequacy, the reading outcome, and — after a recall — the
// imaging classification are all present; otherwise `incomplete`.

/**
 * @typedef {import('./types.js').ScreeningData} ScreeningData
 * @typedef {import('./types.js').GradingResult} GradingResult
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

/**
 * Determine whether every required input for a final classification is present.
 * @param {ScreeningData} d
 * @returns {boolean}
 */
function isComplete(d) {
  // A symptomatic record is a complete (short-circuit) classification.
  if (d.eligibility.symptomatic === 'yes') return true;

  if (d.eligibility.symptomatic === '') return false;
  if (d.eligibility.consentGiven === '') return false;
  if (d.mammogram.viewsTaken === '') return false;
  if (d.mammogram.imageAdequacy === '') return false;
  if (d.reading.readingOutcome === '') return false;

  // After a recall, a classification is required once assessment is performed.
  if (d.reading.readingOutcome === 'recall-for-assessment') {
    if (d.assessment.assessmentPerformed === 'yes' &&
        d.assessment.imagingClassification === null) {
      return false;
    }
  }
  return true;
}

/**
 * Compute the full breast-screening classification for the supplied data.
 * @param {ScreeningData} data
 * @returns {{ eligibilityStatus: import('./types.js').EligibilityStatus,
 *             readingOutcome: import('./types.js').ReadingOutcome,
 *             imagingClassification: import('./types.js').ImagingClassification,
 *             screeningOutcome: import('./types.js').ScreeningOutcome,
 *             outcomeBand: import('./types.js').OutcomeBand,
 *             status: ('complete'|'incomplete'),
 *             firedRules: FiredRule[] }}
 */
function calculateGrade(data) {
  const eligibilityStatus = deriveEligibility(data);

  /** @type {FiredRule[]} */
  const firedRules = [];

  let screeningOutcome = '';
  /** @type {import('./types.js').OutcomeBand} */
  let outcomeBand = 'incomplete';

  for (const rule of outcomeRules) {
    let matched = false;
    try {
      matched = rule.evaluate(data);
    } catch (e) {
      console.warn(`Breast-screening rule ${rule.id} evaluation failed:`, e);
    }
    if (matched) {
      screeningOutcome = rule.screeningOutcome;
      outcomeBand = rule.outcomeBand;
      firedRules.push({
        id: rule.id,
        category: rule.category,
        description: rule.description
      });
      break; // first-match pathway
    }
  }

  const status = isComplete(data) && screeningOutcome !== ''
    ? 'complete'
    : 'incomplete';

  // Record the derived eligibility decision as an audit row.
  firedRules.unshift({
    id: 'R-ELIGIBILITY-01',
    category: 'eligibility',
    description: `Eligibility status derived as "${eligibilityStatus}"`
  });

  return {
    eligibilityStatus,
    readingOutcome: data.reading.readingOutcome,
    imagingClassification: data.assessment.imagingClassification,
    screeningOutcome,
    outcomeBand,
    status,
    firedRules
  };
}

export { isComplete, calculateGrade };
