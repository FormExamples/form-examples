import { activeItemNumbers, ratingValue } from './rules.js';

// Flagged-issue detection (red flags). Independent of the burden band, this
// module raises clinician-facing flags per spec §5:
//
//   - Severe burden (HIGH)            — ZBI-22 total >= 61, or ZBI-12 total >= 17
//   - Moderate-to-severe burden (HIGH)— ZBI-22 total in 41-60
//   - Carer mental-health screen (HIGH)— high/severe burden, or item22 == 4
//   - High global burden (MEDIUM)     — item22 >= 3
//   - Incomplete assessment (LOW)     — any active item rating missing
//
// Rows here mirror the `zarit_burden_interview_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action). Flags are
// computed from the grade (total, band, instrument form) and the raw item-22
// rating; the incomplete-assessment flag inspects only the active item set for
// the selected instrument form.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

/**
 * @param {AssessmentData} data
 * @param {{ totalScore: number, maxScore: number, burdenBand: string }} grade
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, grade) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  const { totalScore } = grade;
  const instrumentForm = data.context.instrumentForm === 'zbi12'
    ? 'zbi12'
    : 'zbi22';
  const item22 = ratingValue(data.items.item22);

  // Severity thresholds by instrument form.
  const severeBurden = instrumentForm === 'zbi12'
    ? totalScore >= 17
    : totalScore >= 61;
  const moderateToSevere = instrumentForm === 'zbi22'
    && totalScore >= 41 && totalScore <= 60;

  // ─── Severe burden (HIGH) ───────────────────────────────────
  if (severeBurden) {
    flags.push({
      id: 'F-SEVERE-BURDEN-001',
      category: 'severe-burden',
      priority: 'high',
      description:
        instrumentForm === 'zbi12'
          ? `ZBI-12 total ${totalScore} of 48 is at or above the high-burden cut-off (>= 17) — severe carer burden`
          : `ZBI-22 total ${totalScore} of 88 is in the severe-burden band (>= 61)`,
      suggestedAction:
        'Arrange urgent carer support and respite; screen and refer for carer mental-health support; consider the risk to the caring arrangement.'
    });
  }

  // ─── Moderate-to-severe burden (HIGH) ───────────────────────
  // ZBI-22 only; the severe flag covers >= 61.
  if (moderateToSevere) {
    flags.push({
      id: 'F-MODERATE-TO-SEVERE-BURDEN-001',
      category: 'moderate-to-severe-burden',
      priority: 'high',
      description:
        `ZBI-22 total ${totalScore} of 88 is in the moderate-to-severe-burden band (41-60)`,
      suggestedAction:
        'Arrange a carer-support assessment and respite; screen for depression and anxiety; review the care package.'
    });
  }

  // ─── Carer mental-health screen (HIGH) ──────────────────────
  const globalMaximal = item22 !== null && item22 === 4;
  if (severeBurden || moderateToSevere || globalMaximal) {
    flags.push({
      id: 'F-CARER-MENTAL-HEALTH-SCREEN-001',
      category: 'carer-mental-health-screen',
      priority: 'high',
      description:
        globalMaximal
          ? 'The carer rates their overall burden as "Nearly always" (item 22 = 4) — screen for carer depression and anxiety'
          : 'Elevated carer burden — screen the carer for depression and anxiety',
      suggestedAction:
        'Screen the carer for depression and anxiety (for example PHQ-9 / GAD-7) and refer for carer mental-health support per the local pathway.'
    });
  }

  // ─── High global burden (MEDIUM) ────────────────────────────
  if (item22 !== null && item22 >= 3) {
    flags.push({
      id: 'F-HIGH-GLOBAL-BURDEN-001',
      category: 'high-global-burden',
      priority: 'medium',
      description:
        `The carer rates their overall (global) burden as ${item22 === 4 ? '"Nearly always"' : '"Quite frequently"'} (item 22 = ${item22} of 4)`,
      suggestedAction:
        'Explore the drivers of the high global burden and offer carer information, support, and signposting to respite and peer support.'
    });
  }

  // ─── Incomplete assessment (LOW) ────────────────────────────
  const active = activeItemNumbers(instrumentForm);
  const missing = [];
  for (const n of active) {
    const v = ratingValue(data.items[`item${n}`]);
    if (v === null) missing.push(String(n));
  }
  if (missing.length > 0) {
    flags.push({
      id: 'F-INCOMPLETE-ASSESSMENT-001',
      category: 'incomplete',
      priority: 'low',
      description:
        `Missing rating(s) for active item(s): ${missing.join(', ')} — the total may understate burden`,
      suggestedAction:
        'Re-administer the outstanding item(s) and re-score.'
    });
  }

  // Sort: urgent > high > medium > low.
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlaggedIssues };
