// Prioritised flag detection for the NREMT EMT Psychomotor Skills
// Examination report.
//
// Independent of the pass/fail outcome (which the grader computes), this
// module surfaces flags for examiner attention:
//
//   high   - any critical-criterion failure (with reason),
//            multiple non-critical deficiencies clustered in one domain,
//            primary survey skipped (general impression / mental status),
//            transport-priority decision missing
//   medium - several non-critical deficiencies overall,
//            slow / incomplete primary survey,
//            missed reassessment block (no repeat vitals / focused exam),
//            point total below pass threshold even with no critical fail
//   low    - single improvement areas, debrief notes captured,
//            examiner notes captured

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

(function () {
'use strict';
window.EmergencyMedicalTechnicianPsychomotorExamination =
  window.EmergencyMedicalTechnicianPsychomotorExamination || {};

const NS = window.EmergencyMedicalTechnicianPsychomotorExamination;
const { PASS_PERCENT_THRESHOLD } = NS;

/** Threshold for "multiple non-critical deficiencies overall". */
const MULTI_DEF_THRESHOLD = 3;

/** Threshold for "primary survey appears slow / incomplete". */
const PRIMARY_SURVEY_INCOMPLETE_THRESHOLD = 2;

/**
 * Build the prioritised list of flagged issues for the examiner report.
 *
 * @param {AssessmentData} data
 * @param {{
 *   criticalFailures: FiredRule[],
 *   firedRules: FiredRule[],
 *   percent: number,
 *   points: number,
 *   maxPoints: number
 * }} grading
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data, grading) {
  /** @type {AdditionalFlag[]} */
  const flags = [];

  // Non-critical deficiencies (status === 'no' AND not critical).
  const nonCriticalDeficiencies = grading.firedRules.filter(
    (r) => r.status === 'no' && !r.critical
  );

  // ─── High: each critical-criterion failure with the specific reason ───
  for (const rule of grading.criticalFailures) {
    flags.push({
      id: `FLAG-CRIT-${rule.id}`,
      category: `Critical criterion — ${rule.category}`,
      message: `Critical-criterion failure: ${rule.description}`,
      priority: 'high'
    });
  }

  // ─── High: domain weakness (>=2 non-critical deficiencies in one cat) ─
  /** @type {Record<string, FiredRule[]>} */
  const byCategory = {};
  for (const rule of nonCriticalDeficiencies) {
    if (!byCategory[rule.category]) byCategory[rule.category] = [];
    byCategory[rule.category].push(rule);
  }
  for (const [category, rules] of Object.entries(byCategory)) {
    if (rules.length >= 2) {
      flags.push({
        id: `FLAG-DOMAIN-${category.replace(/\s+/g, '-').toUpperCase()}`,
        category: `Domain weakness — ${category}`,
        message: `${rules.length} deficiencies clustered in ${category}; targeted remediation suggested.`,
        priority: 'high'
      });
    }
  }

  // ─── High: primary survey skipped (impression or mental status) ───────
  const psImpression = grading.firedRules.find((r) => r.id === 'EMT-PS-IMPRESSION');
  const psMental = grading.firedRules.find((r) => r.id === 'EMT-PS-MENTAL');
  if (psImpression && psImpression.status === 'no') {
    flags.push({
      id: 'FLAG-PS-IMPRESSION',
      category: 'Primary Survey',
      message: 'No general impression verbalized — coach candidate to "size up" the patient before approaching.',
      priority: 'high'
    });
  }
  if (psMental && psMental.status === 'no') {
    flags.push({
      id: 'FLAG-PS-MENTAL',
      category: 'Primary Survey',
      message: 'Mental status (AVPU) not assessed — must be performed early in the primary survey.',
      priority: 'high'
    });
  }

  // ─── Medium: primary survey slow / incomplete (>=2 non-crit deficiencies in PS) ─
  const psDeficits = nonCriticalDeficiencies.filter((r) => r.step === 3);
  if (psDeficits.length >= PRIMARY_SURVEY_INCOMPLETE_THRESHOLD) {
    flags.push({
      id: 'FLAG-PS-INCOMPLETE',
      category: 'Primary Survey',
      message: `Primary survey appears incomplete: ${psDeficits.length} deficiencies in this section.`,
      priority: 'medium'
    });
  }

  // ─── Medium: missed reassessment block ────────────────────────────────
  const repeatVitals = grading.firedRules.find((r) => r.id === 'EMT-RA-VITALS');
  const repeatFocused = grading.firedRules.find((r) => r.id === 'EMT-RA-FOCUSED');
  const reaDeficits = nonCriticalDeficiencies.filter((r) => r.step === 5);
  if (
    (repeatVitals && repeatVitals.status === 'no') &&
    (repeatFocused && repeatFocused.status === 'no')
  ) {
    flags.push({
      id: 'FLAG-RA-MISSED',
      category: 'Reassessment',
      message: 'Both reassessment of vitals and focused exam were missed — practice ongoing reassessment cadence.',
      priority: 'medium'
    });
  } else if (reaDeficits.length >= 3) {
    flags.push({
      id: 'FLAG-RA-WEAK',
      category: 'Reassessment',
      message: `${reaDeficits.length} reassessment deficiencies — coach candidate to reassess every 5 minutes en route.`,
      priority: 'medium'
    });
  }

  // ─── Medium: total non-critical deficiencies overall ──────────────────
  if (nonCriticalDeficiencies.length >= MULTI_DEF_THRESHOLD) {
    flags.push({
      id: 'FLAG-MULTI-DEF',
      category: 'Performance',
      message: `${nonCriticalDeficiencies.length} non-critical deficiencies recorded — overall performance below station standard.`,
      priority: 'medium'
    });
  }

  // ─── Medium: below pass threshold even though no critical failure ─────
  if (
    grading.criticalFailures.length === 0 &&
    grading.maxPoints > 0 &&
    grading.percent < PASS_PERCENT_THRESHOLD
  ) {
    flags.push({
      id: 'FLAG-BELOW-THRESHOLD',
      category: 'Score',
      message: `${grading.points} of ${grading.maxPoints} points (${grading.percent.toFixed(0)}%) — below the ${PASS_PERCENT_THRESHOLD}% pass threshold.`,
      priority: 'medium'
    });
  }

  // ─── Low: single non-critical deficiency = improvement area ───────────
  if (nonCriticalDeficiencies.length === 1) {
    flags.push({
      id: `FLAG-IMPROVE-${nonCriticalDeficiencies[0].id}`,
      category: `Improvement area — ${nonCriticalDeficiencies[0].category}`,
      message: `Room for improvement: ${nonCriticalDeficiencies[0].description}`,
      priority: 'low'
    });
  }

  // ─── Low: low-count non-critical deficiency list (2 items) ────────────
  if (nonCriticalDeficiencies.length === 2) {
    flags.push({
      id: 'FLAG-IMPROVE-PAIR',
      category: 'Improvement areas',
      message: 'Two non-critical deficiencies — review with candidate during debrief.',
      priority: 'low'
    });
  }

  // ─── Low: examiner / debrief notes captured for the record ────────────
  const ccr = data.criticalCriteriaReview;
  if (ccr.examinerNotes && ccr.examinerNotes.trim() !== '') {
    flags.push({
      id: 'FLAG-NOTE-EXAMINER',
      category: 'Debrief',
      message: 'Examiner notes recorded — review with candidate during debrief.',
      priority: 'low'
    });
  }
  if (ccr.debriefNotes && ccr.debriefNotes.trim() !== '') {
    flags.push({
      id: 'FLAG-NOTE-DEBRIEF',
      category: 'Debrief',
      message: 'Debrief notes captured — incorporate into improvement plan.',
      priority: 'low'
    });
  }

  // Sort: high > medium > low
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

Object.assign(NS, {
  detectAdditionalFlags,
  MULTI_DEF_THRESHOLD,
  PRIMARY_SURVEY_INCOMPLETE_THRESHOLD
});
})();
