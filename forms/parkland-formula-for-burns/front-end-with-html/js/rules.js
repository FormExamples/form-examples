// Declarative Parkland-formula constants and thresholds.
//
// Unlike an additive score, the Parkland formula is a *calculation*: the total
// 24-hour volume is computed once (see `grader.js`) from body weight and %TBSA,
// split 50/50 into the first-8-hour and next-16-hour phases (measured from the
// time of injury), and an infusion rate is derived for each phase. The constants
// below carry the coefficient, the mandated phase hours, the urine-output
// titration factors, and the major-burn referral thresholds. The grader emits an
// audit row for each computation step; the values mirror the
// `parkland_formula_for_burns_grade_rule` SQL table (rule_id, instrument, band,
// category, description).

// ─── Parkland constants (spec §4) ───────────────────────────────
/** Parkland (Baxter) coefficient in mL per kg per %TBSA. */
const PARKLAND_COEFFICIENT = 4;
/** Duration in hours of the first (rapid) resuscitation phase, from injury. */
const FIRST_PHASE_HOURS = 8;
/** Duration in hours of the second resuscitation phase. */
const SECOND_PHASE_HOURS = 16;

// ─── Titration constants (urine-output band derived from weight) ─
/** Low end of the adult urine-output target, mL/kg/h. */
const URINE_LOW_FACTOR = 0.5;
/** High end of the adult urine-output target, mL/kg/h. */
const URINE_HIGH_FACTOR = 1.0;

// ─── Major-burn referral thresholds (%TBSA) ─────────────────────
/** Adult major-burn referral threshold: %TBSA at or above triggers referral. */
const REFERRAL_TBSA_ADULT = 15;
/** Child major-burn referral threshold: %TBSA at or above triggers referral. */
const REFERRAL_TBSA_CHILD = 10;

/**
 * Return the major-burn referral %TBSA threshold for the supplied age band.
 * Children have a lower threshold (10%); adults and unspecified default to 15%.
 * @param {string} ageBand - 'adult' | 'child' | ''
 * @returns {number}
 */
function referralThreshold(ageBand) {
  return ageBand === 'child' ? REFERRAL_TBSA_CHILD : REFERRAL_TBSA_ADULT;
}

export { PARKLAND_COEFFICIENT, FIRST_PHASE_HOURS, SECOND_PHASE_HOURS, URINE_LOW_FACTOR, URINE_HIGH_FACTOR, REFERRAL_TBSA_ADULT, REFERRAL_TBSA_CHILD, referralThreshold };
