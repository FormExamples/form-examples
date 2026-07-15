// Flagged-issue detection (red flags). Independent of the total AUDIT-C score
// (which the grader produces), this module raises clinician-facing safety flags
// per spec §5 (plus the higher-risk escalation prompt from index.md's band
// table):
//
//   - Positive screen / brief intervention (high) — auditcScore >= 5
//   - Escalate full AUDIT (high)                   — auditcScore >= 8
//   - Possible dependence (high)                   — auditcScore >= 11
//   - Heavy episodic drinking (medium)             — heavyEpisodeFrequency >= 3
//   - Sex-specific low-cut positive (low)          — sex == 'female' && auditcScore == 4
//   - Incomplete assessment (low)                  — any of the three items missing
//
// Rows here mirror the `audit_c_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

/** Is an item value unanswered? */
function isMissing(v) {
  return v === null || v === undefined || v === '';
}

/**
 * @param {AssessmentData} data
 * @param {number} auditcScore  - total 0-12 from the grader
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, auditcScore) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  const { frequencyOfDrinking, typicalQuantity, heavyEpisodeFrequency } =
    data.items;
  const sex = data.identification.sex;
  const heavyPoint = isMissing(heavyEpisodeFrequency)
    ? 0
    : Number(heavyEpisodeFrequency);

  // ─── Positive screen / brief intervention (HIGH) ────────────
  if (auditcScore >= 5) {
    flags.push({
      id: 'F-BRIEF-INTERVENTION-001',
      category: 'brief-intervention',
      priority: 'high',
      description: `Positive AUDIT-C screen (score ${auditcScore} of 12, >= 5) — increasing- or higher-risk drinking`,
      suggestedAction:
        'Deliver a brief structured intervention on reducing consumption and complete the full 10-item AUDIT to characterise risk.'
    });
  }

  // ─── Escalate to full AUDIT (HIGH) ──────────────────────────
  if (auditcScore >= 8) {
    flags.push({
      id: 'F-ESCALATE-FULL-AUDIT-001',
      category: 'escalate-full-audit',
      priority: 'high',
      description: `Higher-risk consumption (AUDIT-C ${auditcScore} of 12, >= 8) — high-consumption pattern`,
      suggestedAction:
        'Complete the full 10-item AUDIT now and offer an extended brief intervention; a full-AUDIT score >= 8 indicates harmful or hazardous drinking.'
    });
  }

  // ─── Possible dependence indicators (HIGH) ──────────────────
  if (auditcScore >= 11) {
    flags.push({
      id: 'F-DEPENDENCE-INDICATORS-001',
      category: 'dependence-indicators',
      priority: 'high',
      description: `Very high AUDIT-C (score ${auditcScore} of 12, >= 11) — possible alcohol dependence`,
      suggestedAction:
        'Complete the full AUDIT; a full-AUDIT score >= 20 or clinical features of dependence warrant referral to specialist alcohol services.'
    });
  }

  // ─── Heavy episodic (binge) drinking (MEDIUM) ───────────────
  if (heavyPoint >= 3) {
    flags.push({
      id: 'F-HIGH-CONSUMPTION-001',
      category: 'high-consumption',
      priority: 'medium',
      description:
        'Heavy episodic (binge) drinking at least weekly (Q3 point >= 3) — single-session harm pattern',
      suggestedAction:
        'Advise specifically on the harms of heavy single-session drinking regardless of the total score.'
    });
  }

  // ─── Sex-specific low-cut positive (LOW) ────────────────────
  if (sex === 'female' && auditcScore === 4) {
    flags.push({
      id: 'F-SEX-SPECIFIC-CUT-001',
      category: 'sex-specific-low-cut',
      priority: 'low',
      description:
        'AUDIT-C 4 in a female patient — below the default cut of 5 but at or above the sex-specific female cut of 4',
      suggestedAction:
        'Consider brief advice: some validations apply a lower cut (>= 4) for women to improve sensitivity.'
    });
  }

  // ─── Incomplete assessment (LOW) ────────────────────────────
  const missing = [];
  if (isMissing(frequencyOfDrinking)) missing.push('Q1 frequency');
  if (isMissing(typicalQuantity)) missing.push('Q2 typical quantity');
  if (isMissing(heavyEpisodeFrequency)) missing.push('Q3 heavy episodes');
  if (missing.length > 0) {
    flags.push({
      id: 'F-INCOMPLETE-001',
      category: 'incomplete',
      priority: 'low',
      description: `Unanswered item(s): ${missing.join(', ')} — the total may understate risk`,
      suggestedAction:
        'Complete the missing item(s) and re-score before acting on the result.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlaggedIssues };
