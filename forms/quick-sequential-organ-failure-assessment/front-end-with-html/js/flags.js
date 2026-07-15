// Flagged-issue detection (red flags). Independent of the total qSOFA score
// (which the grader produces), this module raises clinician-facing safety flags
// per spec §5:
//
//   - Sepsis escalation (high)     — qsofaScore >= 2
//   - Hypotension (high)           — systolicBloodPressure <= 100
//   - Altered mentation (high)     — GCS < 15 or mentationAltered == 'yes'
//   - Tachypnoea (medium)          — respiratoryRate >= 22
//   - Incomplete assessment (low)  — any of the three criterion inputs missing
//
// Rows here mirror the `quick_sequential_organ_failure_assessment_grade_flag`
// SQL table (flag_id, category, priority, description, suggested_action).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

/**
 * @param {AssessmentData} data
 * @param {number} qsofaScore  - total 0-3 from the grader
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, qsofaScore) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  const rr = data.respiratory.respiratoryRate;
  const gcs = data.mentation.glasgowComaScale;
  const altered = data.mentation.mentationAltered;
  const sbp = data.circulation.systolicBloodPressure;

  // ─── Sepsis escalation (HIGH) ───────────────────────────────
  if (qsofaScore >= 2) {
    flags.push({
      id: 'F-SEPSIS-ESCALATION-001',
      category: 'sepsis-escalation',
      priority: 'high',
      description: `Positive qSOFA screen (score ${qsofaScore} of 3) — higher risk of a poor outcome`,
      suggestedAction:
        'Escalate: obtain senior / critical-care review, calculate a full SOFA score, and initiate a sepsis workup (cultures, lactate, fluids, antibiotics per local policy).'
    });
  }

  // ─── Hypotension (HIGH) ─────────────────────────────────────
  if (sbp !== null && sbp <= 100) {
    flags.push({
      id: 'F-HYPOTENSION-001',
      category: 'hypotension',
      priority: 'high',
      description: `Systolic blood pressure ${sbp} mmHg at or below the 100 mmHg threshold — risk of shock`,
      suggestedAction:
        'Reassess perfusion, consider fluid resuscitation and continuous blood-pressure monitoring.'
    });
  }

  // ─── Altered mentation (HIGH) ───────────────────────────────
  if ((gcs !== null && gcs < 15) || altered === 'yes') {
    const detail =
      gcs !== null && gcs < 15
        ? `Glasgow Coma Scale ${gcs} (below 15)`
        : 'Mentation altered from baseline';
    flags.push({
      id: 'F-ALTERED-MENTATION-001',
      category: 'altered-mentation',
      priority: 'high',
      description: `${detail} — new confusion or reduced consciousness`,
      suggestedAction:
        'Assess airway and neurology, check glucose, and consider causes of encephalopathy.'
    });
  }

  // ─── Tachypnoea (MEDIUM) ────────────────────────────────────
  if (rr !== null && rr >= 22) {
    flags.push({
      id: 'F-TACHYPNOEA-001',
      category: 'tachypnoea',
      priority: 'medium',
      description: `Respiratory rate ${rr} breaths/min at or above the 22/min threshold`,
      suggestedAction:
        'Check oxygen saturation and work of breathing; consider respiratory support.'
    });
  }

  // ─── Incomplete assessment (LOW) ────────────────────────────
  const missing = [];
  if (rr === null) missing.push('respiratory rate');
  if (gcs === null && altered === '') missing.push('mentation (GCS or altered-mentation flag)');
  if (sbp === null) missing.push('systolic blood pressure');
  if (missing.length > 0) {
    flags.push({
      id: 'F-INCOMPLETE-ASSESSMENT-001',
      category: 'incomplete-assessment',
      priority: 'low',
      description: `Missing criterion input(s): ${missing.join(', ')} — the score may understate risk`,
      suggestedAction:
        'Record the missing bedside observation(s) and re-score.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlaggedIssues };
