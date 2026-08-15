// Composite grader for the Hernia Diagnostic Evaluation.
//
// Plain-JavaScript port of
// ../front-end-with-svelte/src/lib/engine/grader.ts — same public entry
// point, same output shape, same rule / flag IDs.
//
// Composes the classification, reducibility, and red-flag rules, and the
// safety flags, into a single pure, deterministic grading result. The public
// entry point is `calculateHerniaEvaluation(data)`.
//
// Algorithm: red-flag-first. Any positive red flag from step 8 forces the
// urgency band to `emergency`; this cannot be diluted by an otherwise
// reassuring examination, mirroring how `perioperative-optimization`'s
// `insufficient-time` domain forces `defer-surgery`.

import {
  assessReducibility,
  classifyHernia,
  computeUrgency,
  screenRedFlags
} from './classification-rules.js';
import { detectFlags } from './flagged-issues.js';
import { ageInYears } from './utils.js';

const URGENCY_ORDER = ['routine', 'soon', 'urgent', 'emergency'];

/**
 * Derive the overall recommendation from the urgency band, following the
 * management-plan options offered on step 13.
 * @param {import('./types.js').UrgencyBand} urgency
 * @returns {import('./types.js').ManagementPlan}
 */
function deriveRecommendation(urgency) {
  switch (urgency) {
    case 'emergency':
      return 'emergency-referral';
    case 'urgent':
      return 'urgent-referral';
    case 'soon':
      return 'elective-repair-referral';
    case 'routine':
      return 'watchful-waiting';
    default:
      return '';
  }
}

/**
 * Public entry point. Pure and deterministic: no I/O, no clock. The caller
 * supplies the assessment date via `data.clinician.assessmentDate`, so age is
 * computed from recorded data rather than from `Date.now()`.
 *
 * @param {import('./types.js').HerniaDiagnosticEvaluation} data
 * @returns {import('./types.js').GradingResult}
 */
function calculateHerniaEvaluation(data) {
  const firedRules = [];

  const age = ageInYears(data.patient.birthDate, data.clinician.assessmentDate);

  // --- Classification (step 9) ---------------------------------------------
  const classification = classifyHernia(data);
  firedRules.push(...classification.firedRules);

  // --- Reducibility (step 7) -------------------------------------------------
  const reducibility = assessReducibility(data);
  firedRules.push(...reducibility.firedRules);

  // --- Red-flag screen (step 8) -----------------------------------------------
  const redFlag = screenRedFlags(data);
  firedRules.push(...redFlag.firedRules);

  // --- Urgency band (red-flag-first) ------------------------------------------
  const urgencyResult = computeUrgency(data, reducibility, redFlag);
  firedRules.push(...urgencyResult.firedRules);
  const computedUrgency = urgencyResult.urgency;

  // --- Clinician override ------------------------------------------------------
  // The override changes the urgency band only. Safety flags are computed
  // independently below and are always reported.
  const override = data.summary.overrideUrgency;
  const finalUrgency =
    override && URGENCY_ORDER.includes(override) ? override : computedUrgency;
  const overrideReason = finalUrgency !== computedUrgency ? data.summary.overrideReason : '';

  const flags = detectFlags(data, { reducibility, redFlag, age });

  return {
    herniaType: classification.herniaType,
    herniaSubtype: classification.herniaSubtype,
    ehsClassification: classification.ehsClassification,
    ehsSizeGrade: classification.ehsSizeGrade,
    reducibilityStatus: reducibility.status,
    anyRedFlag: redFlag.anyRedFlag,
    computedUrgency,
    finalUrgency,
    overrideReason,
    recommendation: deriveRecommendation(finalUrgency),
    firedRules,
    flags
  };
}

/** Display labels for the urgency bands. */
const URGENCY_LABELS = {
  routine: 'Routine',
  soon: 'Soon (elective referral)',
  urgent: 'Urgent',
  emergency: 'Emergency',
  '': 'Not yet computed'
};

/** Display labels for the overall recommendation. */
const RECOMMENDATION_LABELS = {
  'watchful-waiting': 'Watchful waiting',
  'elective-repair-referral': 'Elective repair referral',
  'urgent-referral': 'Urgent referral',
  'emergency-referral': 'Emergency referral',
  conservative: 'Conservative management'
};

export { calculateHerniaEvaluation, deriveRecommendation, URGENCY_ORDER, URGENCY_LABELS, RECOMMENDATION_LABELS };
