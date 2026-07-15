// Declarative Medical Certificate of Cause of Death (MCCD) classification rules.
//
// This form is a STATUTORY DOCUMENTATION and VALIDITY-CLASSIFICATION instrument,
// not a scored assessment. This module holds the primitive predicates the grader
// (`grader.js`) and the flag detector (`flags.js`) compose (spec §4):
//
//   - the coroner-referral criteria set (CORONER_REASONS),
//   - the unacceptable "mode of death" list (MODES) and its normaliser,
//   - the Part I sole-cause and downward-sequence predicates,
//   - the underlying-cause derivation (lowest completed Part I line).
//
// Nothing in this file decides that a death should be referred or that a
// certificate is invalid — it only encodes what the UK death-certification
// framework requires so the grader can classify the certificate.

/**
 * @typedef {import('./types.js').DeathCertificate} DeathCertificate
 */

// Wrapped in an IIFE; published via window.MedicalCertificateOfCauseOfDeath.

const nonEmpty = (s) => typeof s === 'string' && s.trim() !== '';

/**
 * The coroner-referral criteria. When `referredToCoroner` is 'yes', or
 * `coronerReason` is any of these, the certificate must be referred and should
 * not be issued until the coroner has considered the case (spec §4).
 */
const CORONER_REASONS = [
  'unnatural',
  'violent',
  'suspicious',
  'unknown-cause',
  'industrial-disease',
  'medical-procedure',
  'custody',
  'no-attending-practitioner'
];

/**
 * Recognised "modes of death" that are unacceptable as the SOLE stated cause,
 * because they describe the manner of dying rather than a disease or injury.
 * Stored normalised (lower-case, trimmed, whitespace-collapsed, trailing
 * punctuation removed). ONS guidance requires an underlying disease be stated.
 */
const MODES = [
  'cardiac arrest',
  'cardiac failure',
  'cardiorespiratory arrest',
  'cardio-respiratory arrest',
  'cardiopulmonary arrest',
  'respiratory arrest',
  'respiratory failure',
  'asystole',
  'ventricular fibrillation',
  'old age',
  'organ failure',
  'multi organ failure',
  'multi-organ failure',
  'multiorgan failure',
  'liver failure',
  'renal failure',
  'kidney failure',
  'heart failure',
  'syncope',
  'coma',
  'shock',
  'brain death',
  'brainstem death',
  'vagal inhibition',
  'uraemia',
  'exhaustion',
  'debility',
  'frailty'
];
const MODE_SET = MODES.reduce((set, m) => { set[m] = true; return set; }, {});

/**
 * Normalise a free-text condition for mode-of-death comparison: lower-case,
 * trim, collapse internal whitespace, and strip trailing punctuation.
 * @param {string} text
 * @returns {string}
 */
function normalise(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.,;:]+$/, '')
    .trim();
}

/**
 * True when a coroner-referral criterion is asserted (spec §4).
 * @param {DeathCertificate} d
 * @returns {boolean}
 */
function coronerReferralIndicated(d) {
  return (
    d.referral.referredToCoroner === 'yes' ||
    CORONER_REASONS.indexOf(d.referral.coronerReason) !== -1
  );
}

/**
 * The single non-empty Part I condition when EXACTLY one Part I line is present
 * and Part II is empty; otherwise ''. This is the "sole cause" tested against
 * the unacceptable-mode list.
 * @param {DeathCertificate} d
 * @returns {string}
 */
function soleCause(d) {
  const lines = [
    d.partI.causeIaCondition,
    d.partI.causeIbCondition,
    d.partI.causeIcCondition
  ].filter(nonEmpty);
  const partIiPresent = nonEmpty(d.partII.partIiConditions);
  if (lines.length === 1 && !partIiPresent) return lines[0];
  return '';
}

/**
 * True when the normalised text is a recognised unacceptable mode of death.
 * @param {string} text
 * @returns {boolean}
 */
function isUnacceptableMode(text) {
  return MODE_SET[normalise(text)] === true;
}

/**
 * True when the only cause given is a recognised mode of death (spec §4).
 * @param {DeathCertificate} d
 * @returns {boolean}
 */
function unacceptableSoleCause(d) {
  const sole = soleCause(d);
  return sole !== '' && isUnacceptableMode(sole);
}

/**
 * True when Part I(a), the required direct cause, is not recorded.
 * @param {DeathCertificate} d
 * @returns {boolean}
 */
function missingPartIa(d) {
  return !nonEmpty(d.partI.causeIaCondition);
}

/**
 * True when the Part I lines are not in a plausible downward causal order: a
 * completed line sits below an empty line above it (spec §4).
 * @param {DeathCertificate} d
 * @returns {boolean}
 */
function illogicalSequence(d) {
  const ia = nonEmpty(d.partI.causeIaCondition);
  const ib = nonEmpty(d.partI.causeIbCondition);
  const ic = nonEmpty(d.partI.causeIcCondition);
  return (ib && !ia) || (ic && !ib);
}

/**
 * The underlying cause: the lowest completed Part I line (I(c) else I(b) else
 * I(a)); '' when Part I is empty (spec §4).
 * @param {DeathCertificate} d
 * @returns {string}
 */
function underlyingCause(d) {
  if (nonEmpty(d.partI.causeIcCondition)) return d.partI.causeIcCondition.trim();
  if (nonEmpty(d.partI.causeIbCondition)) return d.partI.causeIbCondition.trim();
  if (nonEmpty(d.partI.causeIaCondition)) return d.partI.causeIaCondition.trim();
  return '';
}

export { nonEmpty, normalise, CORONER_REASONS, MODES, coronerReferralIndicated, soleCause, isUnacceptableMode, unacceptableSoleCause, missingPartIa, illogicalSequence, underlyingCause };
