import { curb65Rules } from './rules.js';

// CURB-65 grader. Pure functions: take an `AssessmentData` object, evaluate the
// five criterion rules in `curb65Rules`, award 0 or 1 point each, sum the total,
// and derive the mortality-risk band and recommended site-of-care disposition.
//
// Grading algorithm (spec §4):
//   confusionScore        = confusionPresent === 'yes'                    ? 1 : 0
//   ureaScore             = ureaMeasured && ureaMmolL   > 7               ? 1 : 0
//   respiratoryRateScore  = respiratoryRate            >= 30              ? 1 : 0
//   bloodPressureScore    = (systolicBp < 90) || (diastolicBp <= 60)      ? 1 : 0
//   ageScore              = ageYears                   >= 65              ? 1 : 0
//   curb65Score = C + U + R + B + A65 (0-5)
//   riskBand    = curb65Score 0-1 low, 2 intermediate, 3-5 high
//
// CRB-65 fallback: when serum urea was NOT measured (ureaMeasured !== 'yes'),
// the urea criterion is dropped and the four-criterion CRB-65 total (0-4) is
// computed and banded on its own scale (0 low, 1-2 intermediate, 3-4 high). In
// that case `curb65Score` is left partial and `crb65Score` is the primary
// result; `totalScore` / `scoreVariant` reflect whichever variant applies.
//
// A missing numeric/enum input contributes 0 points for that criterion (absent,
// not positive); `flags.js` raises a data-completeness flag separately.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').RiskBand} RiskBand
 * @typedef {import('./types.js').ScoreVariant} ScoreVariant
 * @typedef {import('./types.js').Disposition} Disposition
 * @typedef {import('./types.js').FiredCriterion} FiredCriterion
 */

/**
 * Evaluate the five CURB-65 criterion rules and collect the ones that fired.
 * @param {AssessmentData} data
 * @returns {FiredCriterion[]}
 */
function evaluateCriteria(data) {
  /** @type {FiredCriterion[]} */
  const fired = [];
  for (const rule of curb65Rules) {
    try {
      if (rule.evaluate(data)) {
        fired.push({
          id: rule.id,
          criterion: rule.criterion,
          points: rule.points,
          category: rule.category,
          description: rule.description
        });
      }
    } catch (e) {
      console.warn(`CURB-65 rule ${rule.id} evaluation failed:`, e);
    }
  }
  return fired;
}

/** Recommended-setting prose for a band. */
function recommendedSettingFor(band) {
  switch (band) {
    case 'low':
      return 'Consider treatment at home / outpatient management.';
    case 'intermediate':
      return 'Consider short-stay inpatient care or hospital-supervised outpatient treatment.';
    case 'high':
      return 'Hospitalise and manage as severe community-acquired pneumonia; for scores 4-5 assess for intensive-care / HDU admission.';
    default:
      return '';
  }
}

/** @returns {Disposition} */
function dispositionFor(band) {
  switch (band) {
    case 'low': return 'home-outpatient';
    case 'intermediate': return 'short-stay-supervised';
    case 'high': return 'hospital-admission';
    default: return 'home-outpatient';
  }
}

/** Band a CURB-65 total (0-5): 0-1 low, 2 intermediate, 3-5 high. */
function bandCurb65(score) {
  if (score >= 3) return 'high';
  if (score === 2) return 'intermediate';
  return 'low';
}

/** Band a CRB-65 total (0-4): 0 low, 1-2 intermediate, 3-4 high. */
function bandCrb65(score) {
  if (score >= 3) return 'high';
  if (score >= 1) return 'intermediate';
  return 'low';
}

/**
 * Compute the full CURB-65 (or CRB-65 fallback) grade for the supplied data.
 * @param {AssessmentData} data
 * @returns {{ confusionScore: 0|1, ureaScore: 0|1, respiratoryRateScore: 0|1,
 *             bloodPressureScore: 0|1, ageScore: 0|1,
 *             curb65Score: number, crb65Score: number|null,
 *             totalScore: number, scoreVariant: ScoreVariant,
 *             riskBand: RiskBand, recommendedDisposition: Disposition,
 *             recommendedSetting: string,
 *             criteria: {confusion: boolean, urea: boolean, respiratoryRate: boolean, bloodPressure: boolean, ageOver65: boolean},
 *             firedCriteria: FiredCriterion[] }}
 */
function calculateCurb65Grade(data) {
  const firedCriteria = evaluateCriteria(data);
  const has = (criterion) =>
    firedCriteria.some((f) => f.criterion === criterion);

  const confusionScore = has('confusion') ? 1 : 0;
  const ureaScore = has('urea') ? 1 : 0;
  const respiratoryRateScore = has('respiratory-rate') ? 1 : 0;
  const bloodPressureScore = has('blood-pressure') ? 1 : 0;
  const ageScore = has('age') ? 1 : 0;

  const ureaMeasured = data.urea.ureaMeasured === 'yes';

  // CURB-65 (five criteria) and CRB-65 (four criteria, no urea).
  const crb65Sum =
    confusionScore + respiratoryRateScore + bloodPressureScore + ageScore;
  const curb65Score = crb65Sum + ureaScore;

  /** @type {ScoreVariant} */
  const scoreVariant = ureaMeasured ? 'curb-65' : 'crb-65';
  const crb65Score = ureaMeasured ? null : crb65Sum;
  const totalScore = ureaMeasured ? curb65Score : crb65Sum;

  /** @type {RiskBand} */
  const riskBand = ureaMeasured ? bandCurb65(curb65Score) : bandCrb65(crb65Sum);
  const recommendedSetting = recommendedSettingFor(riskBand);
  const recommendedDisposition = dispositionFor(riskBand);

  // Record the derived risk-band decision as a `band` audit row, mirroring the
  // grade_rule table's `band` criterion.
  const variantLabel = ureaMeasured ? 'CURB-65' : 'CRB-65';
  firedCriteria.push({
    id: 'R-BAND-01',
    criterion: 'band',
    points: 0,
    category: 'risk-band',
    description:
      `${variantLabel} score ${totalScore} — ${riskBand} risk band`
  });

  return {
    confusionScore,
    ureaScore,
    respiratoryRateScore,
    bloodPressureScore,
    ageScore,
    curb65Score,
    crb65Score,
    totalScore,
    scoreVariant,
    riskBand,
    recommendedDisposition,
    recommendedSetting,
    criteria: {
      confusion: confusionScore === 1,
      urea: ureaScore === 1,
      respiratoryRate: respiratoryRateScore === 1,
      bloodPressure: bloodPressureScore === 1,
      ageOver65: ageScore === 1
    },
    firedCriteria
  };
}

export { evaluateCriteria, calculateCurb65Grade };
