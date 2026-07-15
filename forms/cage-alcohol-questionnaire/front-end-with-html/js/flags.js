// Flagged-issue detection (red flags). Independent of the total CAGE score
// (which the grader produces), this module raises clinician-facing safety flags
// per spec §5:
//
//   - Positive screen (high)         — cageScore >= 2
//   - Eye-opener positive (high)     — eyeOpener == 'yes' (dependence marker)
//   - Sub-threshold positive (medium)— cageScore == 1
//   - Incomplete assessment (low)    — any of the four items unanswered
//
// Rows here mirror the `cage_alcohol_questionnaire_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

/**
 * @param {AssessmentData} data
 * @param {number} cageScore  - total 0-4 from the grader
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, cageScore) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  const { cutDown, annoyed, guilty, eyeOpener } = data.criteria;

  // ─── Positive screen (HIGH) ─────────────────────────────────
  if (cageScore >= 2) {
    flags.push({
      id: 'F-POSITIVE-SCREEN-001',
      category: 'positive-screen',
      priority: 'high',
      description: `Positive CAGE screen (score ${cageScore} of 4) — clinically significant, suggesting problematic use or dependence`,
      suggestedAction:
        'Undertake a fuller assessment of consumption, dependence, and harm, and consider a brief intervention or referral.'
    });
  }

  // ─── Eye-opener positive (HIGH) ─────────────────────────────
  if (eyeOpener === 'yes') {
    flags.push({
      id: 'F-EYE-OPENER-DEPENDENCE-001',
      category: 'eye-opener-dependence-marker',
      priority: 'high',
      description:
        'Morning drinking to steady nerves or relieve a hangover (eye-opener) — a marker of physical dependence',
      suggestedAction:
        'Attend to this even when the total is below 2: assess for withdrawal and physical dependence.'
    });
  }

  // ─── Sub-threshold positive (MEDIUM) ────────────────────────
  if (cageScore === 1) {
    flags.push({
      id: 'F-FURTHER-ASSESSMENT-001',
      category: 'further-assessment',
      priority: 'medium',
      description:
        'One positive item (CAGE 1 of 4) — below the standard cut-off but not reassuring',
      suggestedAction:
        'Make further inquiry into drinking patterns; consider AUDIT-C for earlier at-risk detection.'
    });
  }

  // ─── Incomplete assessment (LOW) ────────────────────────────
  const missing = [];
  if (cutDown === '') missing.push('cut down');
  if (annoyed === '') missing.push('annoyed');
  if (guilty === '') missing.push('guilty');
  if (eyeOpener === '') missing.push('eye-opener');
  if (missing.length > 0) {
    flags.push({
      id: 'F-INCOMPLETE-001',
      category: 'incomplete',
      priority: 'low',
      description: `Unanswered item(s): ${missing.join(', ')} — the score may understate risk`,
      suggestedAction:
        'Complete the questionnaire and re-score.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlaggedIssues };
