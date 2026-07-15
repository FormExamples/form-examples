import { cha2ds2VascRules } from './rules.js';

// CHA2DS2-VASc grader. Pure functions: take an `AssessmentData` object,
// evaluate the eight criterion rules in `cha2ds2VascRules`, award their
// weighted points, sum the total (0-9), and derive the risk band, the
// looked-up annual stroke rate, and the anticoagulation recommendation.
//
// Grading algorithm (spec §4):
//   congestiveHeartFailurePoint = congestiveHeartFailure == 'yes'        ? 1 : 0
//   hypertensionPoint           = hypertension == 'yes'                  ? 1 : 0
//   diabetesPoint               = diabetes == 'yes'                      ? 1 : 0
//   strokePoint                 = priorStrokeTiaThromboembolism == 'yes' ? 2 : 0
//   vascularDiseasePoint        = vascularDisease == 'yes'               ? 1 : 0
//   agePoint = ageYears == null ? 0 : ageYears >= 75 ? 2 : ageYears >= 65 ? 1 : 0
//   sexPoint                    = sex == 'female'                        ? 1 : 0
//   cha2ds2VascScore = sum (0..9)
//   riskBand = (male && score==0) low | (female && score==1) low
//            | (male && score==1) intermediate | otherwise high
//   annualStrokeRatePercent = LOOKUP[score]
//
// A missing enum input is treated as absent (0 points); a missing ageYears
// scores 0 for age. `flags.js` raises data-completeness flags separately.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').RiskBand} RiskBand
 * @typedef {import('./types.js').AnticoagulationRecommendation} AnticoagulationRecommendation
 * @typedef {import('./types.js').FiredCriterion} FiredCriterion
 */

// Wrapped in an IIFE; published via
// window.Cha2ds2VascScoreForAtrialFibrillationStrokeRisk.

// Adjusted annual ischaemic-stroke rate (%) indexed by total score 0-9
// (Lip et al., Chest 2010).
const ANNUAL_STROKE_RATE_PERCENT = [0.2, 1.3, 2.2, 3.2, 4.0, 6.7, 9.8, 9.6, 6.7, 15.2];

/**
 * Evaluate the eight criterion rules and collect the ones that fired.
 * @param {AssessmentData} data
 * @returns {FiredCriterion[]}
 */
function evaluateCriteria(data) {
  /** @type {FiredCriterion[]} */
  const fired = [];
  for (const rule of cha2ds2VascRules) {
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
      console.warn(`CHA2DS2-VASc rule ${rule.id} evaluation failed:`, e);
    }
  }
  return fired;
}

/**
 * Compute the age point (mutually-exclusive bands: >= 75 → 2, 65-74 → 1).
 * @param {number | null} ageYears
 * @returns {0 | 1 | 2}
 */
function calculateAgePoint(ageYears) {
  if (ageYears === null || ageYears === undefined) return 0;
  if (ageYears >= 75) return 2;
  if (ageYears >= 65) return 1;
  return 0;
}

/**
 * Compute the full CHA2DS2-VASc grade for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {{ congestiveHeartFailurePoint: 0|1, hypertensionPoint: 0|1,
 *             agePoint: 0|1|2, diabetesPoint: 0|1, strokePoint: 0|2,
 *             vascularDiseasePoint: 0|1, sexPoint: 0|1,
 *             cha2ds2VascScore: number, riskBand: RiskBand,
 *             annualStrokeRatePercent: number,
 *             anticoagulationRecommendation: AnticoagulationRecommendation,
 *             firedCriteria: FiredCriterion[] }}
 */
function calculateCha2ds2VascGrade(data) {
  const firedCriteria = evaluateCriteria(data);

  const congestiveHeartFailurePoint =
    data.cardiac.congestiveHeartFailure === 'yes' ? 1 : 0;
  const hypertensionPoint = data.cardiac.hypertension === 'yes' ? 1 : 0;
  const agePoint = calculateAgePoint(data.identification.ageYears);
  const diabetesPoint = data.metabolic.diabetes === 'yes' ? 1 : 0;
  const strokePoint =
    data.metabolic.priorStrokeTiaThromboembolism === 'yes' ? 2 : 0;
  const vascularDiseasePoint = data.cardiac.vascularDisease === 'yes' ? 1 : 0;
  const sexPoint = data.identification.sex === 'female' ? 1 : 0;

  const cha2ds2VascScore =
    congestiveHeartFailurePoint +
    hypertensionPoint +
    agePoint +
    diabetesPoint +
    strokePoint +
    vascularDiseasePoint +
    sexPoint;

  const sex = data.identification.sex;
  /** @type {RiskBand} */
  let riskBand;
  if (sex === 'male' && cha2ds2VascScore === 0) {
    riskBand = 'low';
  } else if (sex === 'female' && cha2ds2VascScore === 1) {
    riskBand = 'low'; // sex point only
  } else if (sex === 'male' && cha2ds2VascScore === 1) {
    riskBand = 'intermediate';
  } else if (cha2ds2VascScore === 0) {
    riskBand = 'low'; // no risk factors and sex not yet recorded
  } else {
    riskBand = 'high';
  }

  /** @type {AnticoagulationRecommendation} */
  const anticoagulationRecommendation =
    riskBand === 'low' ? 'none' : riskBand === 'intermediate' ? 'consider' : 'recommended';

  const annualStrokeRatePercent =
    ANNUAL_STROKE_RATE_PERCENT[cha2ds2VascScore] ?? 0;

  // Record the derived risk-band decision as a `risk-band` audit row, mirroring
  // the grade_rule table's `risk-band` criterion.
  firedCriteria.push({
    id: 'R-RISK-BAND-01',
    criterion: 'risk-band',
    points: 0,
    category: 'risk-band',
    description:
      `CHA2DS2-VASc ${cha2ds2VascScore} of 9 — ${riskBand} risk; ` +
      `estimated annual stroke rate ${annualStrokeRatePercent}%`
  });

  return {
    congestiveHeartFailurePoint,
    hypertensionPoint,
    agePoint,
    diabetesPoint,
    strokePoint,
    vascularDiseasePoint,
    sexPoint,
    cha2ds2VascScore,
    riskBand,
    annualStrokeRatePercent,
    anticoagulationRecommendation,
    firedCriteria
  };
}

export { evaluateCriteria, calculateAgePoint, calculateCha2ds2VascGrade, ANNUAL_STROKE_RATE_PERCENT };
