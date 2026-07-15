// Flagged-issue detection (red flags). Computed INDEPENDENTLY of the
// present / absent classification (which the grader produces), this module
// raises clinician-facing safety flags per spec §6:
//
//   - Delirium present -> cause workup (high) — classification == 'present'
//   - Hypoactive delirium (high)              — motoricSubtype == 'hypoactive'
//   - Altered consciousness / safety (high)   — consciousnessLevel stupor|coma
//   - Deliriogenic medication (medium)        — deliriogenicMedication == true
//   - Unable to assess (medium)               — classification unable-to-assess,
//                                               or attention test not-completable
//   - Repeat screening (low)                  — a single negative screen does
//                                               not exclude delirium
//
// Rows here mirror the `confusion_assessment_method_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

/**
 * @param {AssessmentData} data
 * @param {{ classification: string }} grade  - result of calculateCamGrade
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, grade) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  const classification = grade.classification;
  const motoricSubtype = data.observations.motoricSubtype;
  const level = data.feature4.consciousnessLevel;
  const attentionTest = data.feature2.attentionTest;

  // ─── Delirium present -> cause workup (HIGH) ────────────────────
  if (classification === 'present') {
    flags.push({
      id: 'F-DELIRIUM-PRESENT-001',
      category: 'delirium-present',
      priority: 'high',
      description:
        'CAM positive — delirium present. Delirium is a medical emergency with a reversible cause in most cases.',
      suggestedAction:
        'Commence the PINCH ME reversible-precipitant screen (Pain, Infection, Nutrition, Constipation, Hydration, Medication, Environment) and appropriate investigations; treat the underlying cause.'
    });
  }

  // ─── Hypoactive delirium (HIGH) ─────────────────────────────────
  if (motoricSubtype === 'hypoactive') {
    flags.push({
      id: 'F-HYPOACTIVE-DELIRIUM-001',
      category: 'hypoactive-delirium',
      priority: 'high',
      description:
        'Hypoactive (quiet, withdrawn, drowsy) presentation — the most frequently missed subtype and the one with the worst prognosis.',
      suggestedAction:
        'Do not mistake for depression or fatigue; escalate for medical review and screen actively for the underlying cause.'
    });
  }

  // ─── Altered consciousness / safety (HIGH) ──────────────────────
  if (level === 'stupor' || level === 'coma') {
    flags.push({
      id: 'F-ALTERED-CONSCIOUSNESS-001',
      category: 'altered-consciousness',
      priority: 'high',
      description: `Markedly depressed level of consciousness (${level}) — urgent medical concern.`,
      suggestedAction:
        'Assess airway and neurology, check glucose, and obtain urgent senior medical review.'
    });
  }

  // ─── Deliriogenic medication (MEDIUM) ───────────────────────────
  if (data.observations.deliriogenicMedication) {
    const detail = data.observations.deliriogenicMedicationDetail;
    flags.push({
      id: 'F-DELIRIOGENIC-MEDICATION-001',
      category: 'deliriogenic-medication',
      priority: 'medium',
      description:
        'Recent high-risk deliriogenic medication noted (anticholinergic, benzodiazepine, or opioid)' +
        (detail ? `: ${detail}.` : '.'),
      suggestedAction:
        'Review the medication chart, deprescribe or reduce the high-risk agent where safe, and consider alternatives.'
    });
  }

  // ─── Unable to assess (MEDIUM) ──────────────────────────────────
  if (classification === 'unable-to-assess' || attentionTest === 'not-completable') {
    const reason =
      classification === 'unable-to-assess'
        ? `CAM-ICU RASS ${data.feature4.rassScore} (unrousable)`
        : 'attention test not completable';
    flags.push({
      id: 'F-UNABLE-TO-ASSESS-001',
      category: 'unable-to-assess',
      priority: 'medium',
      description: `Assessment could not be completed — ${reason}.`,
      suggestedAction:
        'Re-assess when arousal improves; continue supportive care and record the reason in the notes.'
    });
  }

  // ─── Repeat screening (LOW) ─────────────────────────────────────
  if (classification === 'absent') {
    flags.push({
      id: 'F-REPEAT-SCREENING-001',
      category: 'repeat-screening',
      priority: 'low',
      description:
        'A single negative CAM screen does not exclude delirium — the course fluctuates and may become positive later.',
      suggestedAction:
        'Re-screen at least once per shift in at-risk patients and whenever the clinical picture changes.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlaggedIssues };
