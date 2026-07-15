import { mrsRules } from './mrs-rules.js';
import { calculateAge } from './types.js';

// MRS (Menopause Rating Scale) grader and HRT risk classifier.
//
// Pure functions: take an AssessmentData object, return the total MRS
// score, the per-subscale breakdown (somatic / psychological /
// urogenital), the severity label, the list of fired rules, and the
// HRT risk-benefit classification (Favourable / Acceptable / Cautious /
// Contraindicated).
//
// MRS Severity bands (total 0-44):
//   0-4   -> No / Minimal
//   5-8   -> Mild
//   9-15  -> Moderate
//   16-44 -> Severe

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').MRSResult} MRSResult
 * @typedef {import('./types.js').MRSSeverity} MRSSeverity
 * @typedef {import('./types.js').MRSSubscaleResult} MRSSubscaleResult
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').HRTRiskClassification} HRTRiskClassification
 */

/**
 * Map a numeric total MRS score to a severity band.
 * @param {number} totalScore
 * @returns {MRSSeverity}
 */
function getMRSSeverity(totalScore) {
  if (totalScore <= 4) return 'No/Minimal';
  if (totalScore <= 8) return 'Mild';
  if (totalScore <= 15) return 'Moderate';
  return 'Severe';
}

/**
 * Evaluate all 11 MRS rules against patient data.
 *
 * @param {AssessmentData} data
 * @returns {{ mrsResult: MRSResult, firedRules: FiredRule[] }}
 */
function calculateMRS(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  /** @type {MRSSubscaleResult} */
  const subscales = { somatic: 0, psychological: 0, urogenital: 0 };

  for (const rule of mrsRules) {
    try {
      const score = rule.getScore(data);
      if (score !== null && score !== undefined && score > 0) {
        firedRules.push({
          id: rule.id,
          system: rule.system,
          description: rule.description,
          score
        });
        subscales[rule.subscale] += score;
      }
    } catch (e) {
      console.warn(`MRS rule ${rule.id} evaluation failed:`, e);
    }
  }

  const totalScore =
    subscales.somatic + subscales.psychological + subscales.urogenital;
  const severity = getMRSSeverity(totalScore);

  return {
    mrsResult: { totalScore, severity, subscales },
    firedRules
  };
}

/**
 * Classify HRT risk-benefit based on contraindications and patient history.
 *
 * Contraindicated: any absolute contraindication present.
 *   - Active/recent breast cancer history
 *   - Undiagnosed vaginal bleeding
 *   - Pregnancy
 *   - Active cardiovascular disease (stroke, MI, VTE)
 *   - Active liver disease
 *
 * Cautious: 2 or more relative-risk factors.
 *   - VTE history
 *   - BRCA positive
 *   - Family history of breast cancer
 *   - Family history of ovarian cancer
 *   - >10 years post-menopause start
 *   - High cardiovascular risk (QRISK > 10%)
 *
 * Acceptable: exactly 1 relative-risk factor.
 *
 * Favourable: no contraindications and no relative-risk factors.
 *
 * @param {AssessmentData} data
 * @returns {HRTRiskClassification}
 */
function classifyHRTRisk(data) {
  const ci = data.contraindicationsScreen;

  // ─── Absolute contraindications → Contraindicated ────────
  if (ci.breastCancerHistory === 'yes') return 'Contraindicated';
  if (ci.undiagnosedVaginalBleeding === 'yes') return 'Contraindicated';
  if (ci.pregnancy === 'yes') return 'Contraindicated';
  if (ci.activeCardiovascularDisease === 'yes') return 'Contraindicated';
  if (ci.liverDisease === 'yes') return 'Contraindicated';

  // ─── Relative contraindications → Cautious / Acceptable ───
  let cautionFactors = 0;

  if (ci.vteHistory === 'yes') cautionFactors++;
  if (data.breastHealth.brcaStatus === 'positive') cautionFactors++;
  if (data.breastHealth.familyHistoryBreastCancer === 'yes') cautionFactors++;
  if (data.breastHealth.familyHistoryOvarianCancer === 'yes') cautionFactors++;

  // >10 years post-menopause
  if (
    data.menopauseStatus.ageAtMenopause !== null &&
    data.demographics.dateOfBirth
  ) {
    const age = calculateAge(data.demographics.dateOfBirth);
    if (age !== null && data.menopauseStatus.ageAtMenopause > 0) {
      const yearsSinceMenopause = age - data.menopauseStatus.ageAtMenopause;
      if (yearsSinceMenopause > 10) cautionFactors++;
    }
  }

  // High QRISK score
  if (
    data.cardiovascularRisk.qriskScore !== null &&
    data.cardiovascularRisk.qriskScore > 10
  ) {
    cautionFactors++;
  }

  if (cautionFactors >= 2) return 'Cautious';
  if (cautionFactors === 1) return 'Acceptable';
  return 'Favourable';
}

export { getMRSSeverity, calculateMRS, classifyHRTRisk };
