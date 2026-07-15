import { AGE_DECAY_BASE, ALPHA_FEMALE, ALPHA_MALE, BASE_COEFFICIENT, FEMALE_MULTIPLIER, KAPPA_FEMALE, KAPPA_MALE, MAX_EXPONENT, UMOL_PER_MGDL, stageRules } from './rules.js';
import { stageLabel } from './types.js';

// eGFR grader. Pure functions: take an `AssessmentData` object, apply the
// CKD-EPI 2021 creatinine equation (race-free) to the serum creatinine, age, and
// sex, and band the result into a KDIGO 2012 CKD G-stage.
//
// Algorithm (spec §4):
//   Scr_mgdl = serumCreatinine / 88.42                 // umol/L → mg/dL
//   kappa    = sex === 'female' ? 0.7  : 0.9
//   alpha    = sex === 'female' ? -0.241 : -0.302
//   ratio    = Scr_mgdl / kappa
//   eGFR     = 142
//            × min(ratio, 1)^alpha
//            × max(ratio, 1)^(-1.200)
//            × 0.9938^ageYears
//            × (sex === 'female' ? 1.012 : 1.0)
//
// The unrounded eGFR drives banding and every flag threshold; the value is
// rounded to the nearest whole number for display only. When any required input
// (ageYears, sex, serumCreatinine) is missing, the eGFR is null, there is no
// stage, and `flags.js` raises an incomplete-assessment flag separately.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').GStage} GStage
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.EstimatedGlomerularFiltrationRateCalculator.

/** Round to the nearest whole number (returns null unchanged). */
function roundWhole(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return null;
  return Math.round(n);
}

/** Round to three decimal places (returns null unchanged). */
function roundThree(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return null;
  return Math.round(n * 1000) / 1000;
}

/**
 * Compute the CKD-EPI 2021 creatinine eGFR and CKD G-stage for the supplied
 * assessment data.
 * @param {AssessmentData} data
 * @returns {{ serumCreatinineMgDl: number|null, egfr: number|null,
 *             egfrRaw: number|null, egfrStage: GStage, egfrStageLabel: string,
 *             firedRules: FiredRule[] }}
 */
function calculateEgfr(data) {
  const scrUmol = data.creatinine.serumCreatinine;
  const ageYears = data.identification.ageYears;
  const sex = data.identification.sex;

  /** @type {FiredRule[]} */
  const firedRules = [];

  const missing =
    scrUmol === null || scrUmol === undefined ||
    ageYears === null || ageYears === undefined ||
    sex === '' || sex === null || sex === undefined;

  if (missing) {
    firedRules.push({
      id: 'R-EQUATION-INCOMPLETE-01',
      instrument: 'equation',
      band: 'unknown',
      category: 'missing-input',
      description:
        'eGFR not computed — serum creatinine, age, and/or sex is missing'
    });
    return {
      serumCreatinineMgDl: null,
      egfr: null,
      egfrRaw: null,
      egfrStage: null,
      egfrStageLabel: '',
      firedRules
    };
  }

  // ─── umol/L → mg/dL conversion ─────────────────────────────────
  const scrMgdl = scrUmol / UMOL_PER_MGDL;
  firedRules.push({
    id: 'R-CONVERT-01',
    instrument: 'conversion',
    band: 'unknown',
    category: 'conversion',
    description:
      `Serum creatinine ${scrUmol} µmol/L ÷ 88.42 = ${roundThree(scrMgdl)} mg/dL`
  });

  // ─── CKD-EPI 2021 creatinine equation ──────────────────────────
  const isFemale = sex === 'female';
  const kappa = isFemale ? KAPPA_FEMALE : KAPPA_MALE;
  const alpha = isFemale ? ALPHA_FEMALE : ALPHA_MALE;
  const femaleMult = isFemale ? FEMALE_MULTIPLIER : 1.0;
  const ratio = scrMgdl / kappa;

  const egfrRaw =
    BASE_COEFFICIENT *
    Math.pow(Math.min(ratio, 1), alpha) *
    Math.pow(Math.max(ratio, 1), MAX_EXPONENT) *
    Math.pow(AGE_DECAY_BASE, ageYears) *
    femaleMult;

  firedRules.push({
    id: 'R-EQUATION-01',
    instrument: 'equation',
    band: 'unknown',
    category: 'ckd-epi-2021-creatinine',
    description:
      `eGFR = 142 × min(${roundThree(ratio)}, 1)^${alpha} × ` +
      `max(${roundThree(ratio)}, 1)^-1.200 × 0.9938^${ageYears}` +
      `${isFemale ? ' × 1.012' : ''} = ${roundWhole(egfrRaw)} mL/min/1.73 m²`
  });

  // ─── CKD G-stage banding (unrounded eGFR) ──────────────────────
  /** @type {GStage} */
  let egfrStage = null;
  let egfrStageLabel = '';
  for (const rule of stageRules) {
    try {
      if (rule.evaluate(egfrRaw)) {
        egfrStage = /** @type {GStage} */ (rule.band);
        egfrStageLabel = rule.label;
        firedRules.push({
          id: rule.id,
          instrument: rule.instrument,
          band: rule.band,
          category: rule.category,
          description: rule.description
        });
        break;
      }
    } catch (e) {
      console.warn(`eGFR staging rule ${rule.id} evaluation failed:`, e);
    }
  }

  return {
    serumCreatinineMgDl: roundThree(scrMgdl),
    egfr: roundWhole(egfrRaw),
    egfrRaw,
    egfrStage,
    egfrStageLabel,
    firedRules
  };
}

export { roundWhole, roundThree, calculateEgfr };
