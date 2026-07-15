import { ALBUMIN_FACTOR, NORMAL_HIGH_WITHOUT_K, NORMAL_HIGH_WITH_K, NORMAL_LOW, REF_ALBUMIN, classificationRules } from './rules.js';

// Anion-gap grader. Pure functions: take an `AssessmentData` object, apply the
// anion-gap formula (with or without potassium) to the electrolyte panel,
// derive the albumin-corrected gap when an albumin is present, and classify the
// result against the reference range.
//
// Algorithm (spec §4):
//   includesPotassium = potassium != null
//   anionGap = includesPotassium
//                ? (sodium + potassium) − (chloride + bicarbonate)
//                :  sodium              − (chloride + bicarbonate)
//   correctedAnionGap = albumin != null
//                         ? anionGap + 0.25 × (40 − albumin)
//                         : null
//   normalLow  = 8
//   normalHigh = includesPotassium ? 16 : 12
//   classificationValue = correctedAnionGap != null ? correctedAnionGap : anionGap
//   band = classificationValue >= 20       -> 'very-high'
//        : classificationValue >  normalHigh -> 'high'
//        : classificationValue <  normalLow  -> 'low'
//        : else                              -> 'normal'
//
// The unrounded values drive classification and every flag threshold; values
// are rounded to one decimal place for display only. `anionGap` is null when
// any required electrolyte (sodium, chloride, bicarbonate) is missing; the
// classification is then 'unknown' and `flags.js` raises an incomplete flag.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').Classification} Classification
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

/** True when a numeric value is present (not null/undefined/NaN). */
function present(n) {
  return n !== null && n !== undefined && !Number.isNaN(n);
}

/** Round a number to one decimal place (returns null unchanged). */
function roundOne(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return null;
  return Math.round(n * 10) / 10;
}

/**
 * Compute the anion-gap grade for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {{ includesPotassium: boolean, anionGap: number|null,
 *             anionGapRaw: number|null, correctedAnionGap: number|null,
 *             correctedAnionGapRaw: number|null, normalLow: number,
 *             normalHigh: number, classificationValue: number|null,
 *             classification: Classification, firedRules: FiredRule[] }}
 */
function calculateAnionGap(data) {
  const { sodium, potassium, chloride, bicarbonate } = data.electrolytes;
  const albumin = data.albumin.albumin;

  const includesPotassium = present(potassium);
  const normalLow = NORMAL_LOW;
  const normalHigh = includesPotassium ? NORMAL_HIGH_WITH_K : NORMAL_HIGH_WITHOUT_K;

  /** @type {FiredRule[]} */
  const firedRules = [];

  // ─── Raw anion gap ─────────────────────────────────────────────
  let anionGapRaw = null;
  if (present(sodium) && present(chloride) && present(bicarbonate)) {
    anionGapRaw = includesPotassium
      ? (sodium + potassium) - (chloride + bicarbonate)
      : sodium - (chloride + bicarbonate);
  }

  if (anionGapRaw === null) {
    firedRules.push({
      id: 'R-FORMULA-INCOMPLETE-01',
      instrument: 'formula',
      band: '',
      category: 'missing-input',
      description:
        'Anion gap not computed — sodium, chloride and/or bicarbonate is missing'
    });
    return {
      includesPotassium,
      anionGap: null,
      anionGapRaw: null,
      correctedAnionGap: null,
      correctedAnionGapRaw: null,
      normalLow,
      normalHigh,
      classificationValue: null,
      classification: 'unknown',
      firedRules
    };
  }

  firedRules.push({
    id: includesPotassium ? 'R-FORMULA-WITH-K-01' : 'R-FORMULA-WITHOUT-K-01',
    instrument: 'formula',
    band: '',
    category: 'formula',
    description: includesPotassium
      ? `Anion gap = (${sodium} + ${potassium}) − (${chloride} + ${bicarbonate}) = ` +
        `${roundOne(anionGapRaw)} mmol/L (potassium-inclusive; normal 8–16)`
      : `Anion gap = ${sodium} − (${chloride} + ${bicarbonate}) = ` +
        `${roundOne(anionGapRaw)} mmol/L (potassium-exclusive; normal 8–12)`
  });

  // ─── Albumin correction ────────────────────────────────────────
  let correctedAnionGapRaw = null;
  if (present(albumin)) {
    correctedAnionGapRaw = anionGapRaw + ALBUMIN_FACTOR * (REF_ALBUMIN - albumin);
    firedRules.push({
      id: 'R-CORRECTION-01',
      instrument: 'correction',
      band: '',
      category: 'albumin-correction',
      description:
        `Corrected anion gap = ${roundOne(anionGapRaw)} + 0.25 × (40 − ${albumin}) = ` +
        `${roundOne(correctedAnionGapRaw)} mmol/L`
    });
  }

  // ─── Classification ────────────────────────────────────────────
  const classificationValue = correctedAnionGapRaw !== null
    ? correctedAnionGapRaw
    : anionGapRaw;

  /** @type {Classification} */
  let classification = 'unknown';
  for (const rule of classificationRules) {
    try {
      if (rule.evaluate(classificationValue, normalLow, normalHigh)) {
        classification = /** @type {Classification} */ (rule.band);
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
      console.warn(`Anion-gap rule ${rule.id} evaluation failed:`, e);
    }
  }

  return {
    includesPotassium,
    anionGap: roundOne(anionGapRaw),
    anionGapRaw,
    correctedAnionGap: roundOne(correctedAnionGapRaw),
    correctedAnionGapRaw,
    normalLow,
    normalHigh,
    classificationValue,
    classification,
    firedRules
  };
}

export { present, roundOne, calculateAnionGap };
